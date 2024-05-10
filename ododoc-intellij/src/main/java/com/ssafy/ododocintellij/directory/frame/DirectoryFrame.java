package com.ssafy.ododocintellij.directory.frame;

import com.ssafy.ododocintellij.directory.dto.request.CreateRequestDto;
import com.ssafy.ododocintellij.directory.dto.response.DirectoryDto;
import com.ssafy.ododocintellij.directory.dto.response.ResultDto;
import com.ssafy.ododocintellij.directory.entity.FileInfo;
import com.ssafy.ododocintellij.directory.manager.ConnectedFileManager;
import com.ssafy.ododocintellij.directory.manager.DirectoryInfoManager;
import com.ssafy.ododocintellij.login.manager.TokenManager;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.input.MouseButton;
import javafx.stage.Stage;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

public class DirectoryFrame extends Application {

    private Long currentDirectoryId;
    private final String baseUrl = "https://k10d209.p.ssafy.io/api/directory";
    private TreeView<FileInfo> treeView;
    private ContextMenu folderContextMenu = new ContextMenu();
    private ContextMenu fileContextMenu = new ContextMenu();

    @Override
    public void start(Stage stage) {
        DirectoryInfoManager directoryInfoManager = DirectoryInfoManager.getInstance();
        ResultDto resultDto = retrieveDirectory(directoryInfoManager.getRootId()).block();

        // 제목 설정
        stage.setTitle(" " + directoryInfoManager.getTitle());
        currentDirectoryId = directoryInfoManager.getRootId();

        // 오른쪽 마우스 이벤트 목록 생성
        makeContextMenu();

        // 디렉토리 UI 생성
        TreeItem<FileInfo> invisibleRoot = new TreeItem<>();
        invisibleRoot = LoadDirectory(resultDto.getData().getChildren(), invisibleRoot);

        treeView = new TreeView<>(invisibleRoot);
        treeView.setShowRoot(false);
        treeView.setEditable(true);
        treeView.getSelectionModel().selectedItemProperty().addListener(new FileListener());
        treeView.setCellFactory(tv -> new FileAndFolderTreeCell(folderContextMenu, fileContextMenu, this::refreshDirectoryView));
        treeView.setOnMouseClicked(event -> {
            // 오른쪽 마우스 클릭 시 빈 공간 일 경우 파일 및 폴더 생성
            if (event.getButton() == MouseButton.SECONDARY) {
                if(treeView.getSelectionModel().getSelectedItem() == null){
                    folderContextMenu.show(treeView, event.getScreenX(), event.getScreenY());
                    currentDirectoryId = directoryInfoManager.getRootId();
                } else{
                    currentDirectoryId = treeView.getSelectionModel().getSelectedItems().get(0).getValue().getId();
                }
            } else {
                folderContextMenu.hide();
            }

            // 왼쪽 마우스 클릭 시
            if(event.getButton() == MouseButton.PRIMARY){
                // 빈공간일 경우 폴더 및 파일을 선택 비활성화
                if(event.getTarget() instanceof TreeCell<?> && ((TreeCell) event.getTarget()).isEmpty()){
                    treeView.getSelectionModel().clearSelection();
                    currentDirectoryId = directoryInfoManager.getRootId();
                }
                else{
                    if(treeView.getSelectionModel().getSelectedItems().isEmpty()){
                        currentDirectoryId = directoryInfoManager.getRootId();
                    }
                    else{
                        currentDirectoryId = treeView.getSelectionModel().getSelectedItems().get(0).getValue().getId();
                    }
                }
            }
        });

        Scene scene = new Scene(treeView, 300, 500);
        stage.setScene(scene);
        stage.show();
    }

    private Mono<ResultDto> retrieveDirectory(long rootId) {
        WebClient webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Content-type", "application/json")
                .defaultHeader("Authorization", TokenManager.getInstance().getAccessToken())
                .build();

        return webClient.get()
                .uri("/" + rootId)
                .retrieve()
                .bodyToMono(ResultDto.class);
    }

    private TreeItem<FileInfo> LoadDirectory(List<DirectoryDto> children, TreeItem<FileInfo> invisibleRoot) {

        for(DirectoryDto dto : children){
            FileInfo fileInfo = new FileInfo(dto.getId(), dto.getName(), dto.getType());
            TreeItem<FileInfo> fileItem = new TreeItem<>(fileInfo);
            fileItem.setExpanded(true);
            DFS(dto.getChildren(), fileItem);
            invisibleRoot.getChildren().add(fileItem);
        }

        return invisibleRoot;
    }

    private void DFS(List<DirectoryDto> children, TreeItem<FileInfo> fileItem) {

        if(children == null){
            return;
        }

        for(DirectoryDto dto : children){
            FileInfo fileInfo = new FileInfo(dto.getId(), dto.getName(), dto.getType());
            TreeItem<FileInfo> childFileItem = new TreeItem<>(fileInfo);
            fileItem.getChildren().add(childFileItem);

            DFS(dto.getChildren(), childFileItem);
        }

    }

    private void makeContextMenu() {
        MenuItem addFolder = new MenuItem("폴더 생성");
        MenuItem addFile = new MenuItem("파일 생성");
        folderContextMenu.getItems().addAll(addFolder, addFile);

        MenuItem connectFile = new MenuItem("파일 연동");
        fileContextMenu.getItems().add(connectFile);

        addFolder.setOnAction(e -> createFolderOrFile("folder"));
        addFile.setOnAction(e -> createFolderOrFile("file"));
        connectFile.setOnAction(e -> connectFile());
    }

    private void connectFile() {
        ConnectedFileManager connectedFileManager = ConnectedFileManager.getInstance();
        connectedFileManager.setDirectoryId(currentDirectoryId);
    }

    private void createFolderOrFile(String type){
        WebClient webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Content-type", "application/json")
                .defaultHeader("Authorization", TokenManager.getInstance().getAccessToken())
                .build();

        CreateRequestDto createRequestDto = new CreateRequestDto(currentDirectoryId, "", type);

        webClient.post()
                .bodyValue(createRequestDto)
                .retrieve()
                .bodyToMono(ResultDto.class)
                .subscribe(result -> {
                    if (result.getStatus() == 200) {
                        refreshDirectoryView();
                    } else {
                        System.out.println("생성 실패");
                    }
                }, error -> System.out.println("API 호출 실패: " + error.getMessage()));
    }

    private void refreshDirectoryView() {
        retrieveDirectory(DirectoryInfoManager.getInstance().getRootId()).subscribe(resultDto -> {
            Platform.runLater(() -> {
                TreeItem<FileInfo> invisibleRoot = new TreeItem<>();
                invisibleRoot = LoadDirectory(resultDto.getData().getChildren(), invisibleRoot);
                treeView.setRoot(invisibleRoot);
                treeView.setShowRoot(false);
                treeView.refresh();
            });
        });
    }


    class FileListener implements ChangeListener<TreeItem<FileInfo>> {
        @Override
        public void changed(ObservableValue<? extends TreeItem<FileInfo>> observableValue, TreeItem<FileInfo> oldValue, TreeItem<FileInfo> newValue) {
            if (newValue != null) {
                FileInfo fileInfo = newValue.getValue();
                System.out.println("Selected: " + fileInfo.getName());
                System.out.println("ID: " + fileInfo.getId() + ", Type: " + fileInfo.getType());
            }
        }
    }

}
