package com.ssafy.ododocintellij.directory.frame;

import com.ssafy.ododocintellij.directory.dto.request.ModifyRequestDto;
import com.ssafy.ododocintellij.directory.dto.response.ResultDto;
import com.ssafy.ododocintellij.directory.entity.FileInfo;
import com.ssafy.ododocintellij.login.manager.TokenManager;
import javafx.scene.control.ContextMenu;
import javafx.scene.control.TextField;
import javafx.scene.control.TreeCell;
import javafx.scene.input.KeyCode;
import org.springframework.web.reactive.function.client.WebClient;

public class FileAndFolderTreeCell extends TreeCell<FileInfo> {

    private TextField textField;
    private Runnable refreshCallback;
    private ContextMenu folderContextMenu;
    private ContextMenu fileContextMenu;
    private final String baseUrl = "https://k10d209.p.ssafy.io/api/directory";

    public FileAndFolderTreeCell(ContextMenu folderContextMenu, ContextMenu fileContextMenu, Runnable refreshCallback) {
        this.fileContextMenu = fileContextMenu;
        this.folderContextMenu = folderContextMenu;
        this.refreshCallback = refreshCallback;
    }

    @Override
    protected void updateItem(FileInfo fileInfo, boolean empty) {
        super.updateItem(fileInfo, empty);
        if(empty || fileInfo == null) {
            setText(null);
            setGraphic(null);
            setContextMenu(null);
        } else{
            if(isEditing()){
                if(textField != null){
                    textField.setText(getString());
                }
                setText(null);
                setGraphic(textField);
            }else{
                setText(fileInfo.toString());
                setGraphic(null);

                if(fileInfo.getType().equals("FOLDER")){
                    setContextMenu(folderContextMenu);
                }
                else if (fileInfo.getType().equals("FILE")){
                    setContextMenu(fileContextMenu);
                }
            }
        }
    }

    @Override
    public void startEdit() {
        super.startEdit();
        if(textField == null){
            createTextField();
        }
        setGraphic(textField);
        setText(null);
        textField.setText(getItem().getName());
        textField.selectAll();
        textField.requestFocus();
    }

    @Override
    public void commitEdit(FileInfo fileInfo) {
        super.commitEdit(fileInfo);
        modifyFolderOrFile(fileInfo.getName());
    }

    @Override
    public void cancelEdit() {
        super.cancelEdit();
        setText(getItem().getName());
        setGraphic(null);
    }

    private void createTextField() {
        textField = new TextField(getString());
        textField.setOnKeyReleased(event -> {
            if (event.getCode() == KeyCode.ENTER) {
                commitEdit(new FileInfo(getItem().getId(), textField.getText(), getItem().getType()));
            } else if (event.getCode() == KeyCode.ESCAPE) {
                cancelEdit();
            }
        });
    }

    private void modifyFolderOrFile(String name) {
        WebClient webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Content-type", "application/json")
                .defaultHeader("Authorization", TokenManager.getInstance().getAccessToken())
                .build();

        ModifyRequestDto createRequestDto = new ModifyRequestDto(getItem().getId(), name);

        webClient.put()
                .uri("/edit")
                .bodyValue(createRequestDto)
                .retrieve()
                .bodyToMono(ResultDto.class)
                .subscribe(result -> {
                    if (result.getStatus() == 200) {
                        if (refreshCallback != null) {
                            refreshCallback.run();
                        }
                    } else {
                        System.out.println("수정 실패");
                    }
                }, error -> System.out.println("API 호출 실패: " + error.getMessage()));
    }
    private String getString() {
        return getItem() == null ? "" : getItem().toString();
    }
}
