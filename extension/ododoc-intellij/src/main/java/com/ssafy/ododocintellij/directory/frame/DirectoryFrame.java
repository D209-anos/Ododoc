package com.ssafy.ododocintellij.directory.frame;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ododocintellij.directory.dto.DirectoryDto;
import com.ssafy.ododocintellij.directory.dto.ResultDto;
import com.ssafy.ododocintellij.directory.entity.FileInfo;
import com.ssafy.ododocintellij.directory.manager.DirectoryInfoManager;
import com.ssafy.ododocintellij.login.manager.TokenManager;
import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.input.MouseButton;
import javafx.stage.Stage;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

public class DirectoryFrame extends Application {

    private final String baseUrl = "https://k10d209.p.ssafy.io/api/directory/";
    private ContextMenu contextMenu = new ContextMenu();

    @Override
    public void start(Stage stage) throws Exception {
        DirectoryInfoManager directoryInfoManager = DirectoryInfoManager.getInstance();
        ResultDto resultDto = retrieveDirectory(directoryInfoManager.getRootId());

        // 제목 설정
        stage.setTitle(" " + directoryInfoManager.getTitle());

        // 오른쪽 마우스 이벤트 목록 생성
        makeContextMenu();

        // 디렉토리 UI 생성
        TreeItem<FileInfo> invisibleRoot = new TreeItem<>();
        invisibleRoot = viewDirectory(resultDto.getData().getChildren(), invisibleRoot);

        TreeView<FileInfo> treeView = new TreeView<>(invisibleRoot);
        treeView.setShowRoot(false);
        treeView.getSelectionModel().selectedItemProperty().addListener(new FileListener());
        treeView.setCellFactory(tv -> new FileInfoCell());

        treeView.setOnMouseClicked(event -> {
            if (event.getButton() == MouseButton.SECONDARY && treeView.getSelectionModel().getSelectedItem() == null) {
                contextMenu.show(treeView, event.getScreenX(), event.getScreenY());
            } else {
                contextMenu.hide();
            }
        });

        Scene scene = new Scene(treeView, 300, 500);
        stage.setScene(scene);
        stage.show();
    }

    private ResultDto retrieveDirectory(long rootId) throws JsonProcessingException {
        TokenManager tokenManager = TokenManager.getInstance();
        WebClient webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Content-type", "application/json")
                .defaultHeader("Authorization", tokenManager.getAccessToken())
                .build();

        ResultDto resultDto = webClient.get()
                .uri(rootId + "")
                .retrieve()
                .bodyToMono(ResultDto.class)
                .block();

        ObjectMapper objectMapper = new ObjectMapper();
        String temporaryDirectoryData = "{\n" +
                "  \"status\": 200,\n" +
                "  \"data\": {\n" +
                "    \"id\": 1,\n" +
                "    \"name\": \"아노쓰님의 정리공간\",\n" +
                "    \"type\": \"FOLDER\",\n" +
                "    \"children\": [\n" +
                "      {\n" +
                "        \"id\": 2,\n" +
                "        \"name\": \"폴더\",\n" +
                "        \"type\": \"FOLDER\",\n" +
                "        \"children\": [\n" +
                "          {\n" +
                "            \"id\": 3,\n" +
                "            \"name\": \"파일\",\n" +
                "            \"type\": \"FILE\",\n" +
                "            \"children\": []\n" +
                "          },\n" +
                "          {\n" +
                "            \"id\": 4,\n" +
                "            \"name\": \"폴더\",\n" +
                "            \"type\": \"FOLDER\",\n" +
                "            \"children\": [\n" +
                "              {\n" +
                "                \"id\": 5,\n" +
                "                \"name\": \"파일\",\n" +
                "                \"type\": \"FILE\",\n" +
                "                \"children\": []\n" +
                "              },\n" +
                "              {\n" +
                "                \"id\": 6,\n" +
                "                \"name\": \"파일\",\n" +
                "                \"type\": \"FILE\",\n" +
                "                \"children\": []\n" +
                "              },\n" +
                "              {\n" +
                "                \"id\": 7,\n" +
                "                \"name\": \"폴더\",\n" +
                "                \"type\": \"FOLDER\",\n" +
                "                \"children\": [\n" +
                "                  {\n" +
                "                    \"id\": 8,\n" +
                "                    \"name\": \"파일\",\n" +
                "                    \"type\": \"FILE\",\n" +
                "                    \"children\": []\n" +
                "                  }\n" +
                "                ]\n" +
                "              }\n" +
                "            ]\n" +
                "          }\n" +
                "        ]\n" +
                "      },\n" +
                "      {\n" +
                "        \"id\": 4,\n" +
                "        \"name\": \"파일\",\n" +
                "        \"type\": \"FILE\",\n" +
                "        \"children\": []\n" +
                "      }\n" +
                "    ]\n" +
                "  }\n" +
                "}";
        ResultDto resultDto1 = objectMapper.readValue(temporaryDirectoryData, ResultDto.class);

        return resultDto1;
    }

    private TreeItem<FileInfo> viewDirectory(List<DirectoryDto> children, TreeItem<FileInfo> invisibleRoot) {

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
        contextMenu.getItems().addAll(addFolder, addFile);

        addFolder.setOnAction(e -> System.out.println("폴더 생성"));
        addFile.setOnAction(e -> System.out.println("파일 생성"));
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

    class FileInfoCell extends TreeCell<FileInfo> {
        @Override
        protected void updateItem(FileInfo fileInfo, boolean empty) {
            super.updateItem(fileInfo, empty);

            if(empty || fileInfo == null) {
                setText(null);
                setContextMenu(null);
            } else{
                setText(fileInfo.toString());

                if(fileInfo.getType().equals("FOLDER")){
                    setContextMenu(contextMenu);
                } else{
                    setContextMenu(null);
                }
            }
        }
    }
}
