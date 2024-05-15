package com.ssafy.ododocintellij.tracker;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intellij.execution.ExecutionListener;
import com.intellij.execution.process.ProcessEvent;
import com.intellij.execution.process.ProcessHandler;
import com.intellij.execution.process.ProcessListener;
import com.intellij.execution.process.ProcessOutputTypes;
import com.intellij.execution.runners.ExecutionEnvironment;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.util.Key;
import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.psi.PsiFile;
import com.intellij.psi.PsiManager;
import com.intellij.psi.search.FilenameIndex;
import com.intellij.psi.search.GlobalSearchScope;
import com.intellij.util.concurrency.AppExecutorUtil;
import com.ssafy.ododocintellij.directory.manager.ConnectedFileManager;
import com.ssafy.ododocintellij.login.alert.AlertHelper;
import com.ssafy.ododocintellij.login.manager.TokenManager;
import com.ssafy.ododocintellij.sender.BuildResultSender;
import com.ssafy.ododocintellij.tracker.dto.*;
import com.ssafy.ododocintellij.tracker.entity.ProjectInfo;
import com.ssafy.ododocintellij.tracker.manager.ProjectTracker;
import javafx.application.Platform;
import javafx.scene.control.Alert;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class CodeListener implements ExecutionListener {

    private final Project project;
    private List<PsiFile> psiFiles;
    private List<ErrorFileInfo> errorFiles = new ArrayList<>();
    private Map<String, ProjectInfo> currentProjectInfo = new HashMap<>();
    private boolean capturingError;
    private boolean errorFlag;
    private boolean connectFlag;
    public CodeListener(Project project) {
        this.project = project;
    }

    @Override
    public void processStarted(@NotNull String executorId, @NotNull ExecutionEnvironment env, @NotNull ProcessHandler handler) {
        AppExecutorUtil.getAppExecutorService().execute(() -> {
            getCurrentProject();
        });

        // 파일 연동이 되어있다면
        if(ConnectedFileManager.getInstance().getDirectoryId() != -1L){
            connectFlag = true;
            startSignal();
        }
        // 파일 연동이 되어 있지 않다면
        else{
            Platform.runLater(() -> {
                Alert alert =  AlertHelper.makeAlert(
                        Alert.AlertType.WARNING,
                        " Ododoc",
                        "파일 연동 오류",
                        "파일이 연동되지 않았습니다.\n파일을 연동해주세요.",
                        "/image/button/icon.png"
                );
                alert.showAndWait();
            });
        }

        handler.addProcessListener(new OdodocProcessListener());
    }

    private void getCurrentProject(){
        psiFiles = new ArrayList<>();
        currentProjectInfo.clear();
        ApplicationManager.getApplication().runReadAction(() -> {
            GlobalSearchScope scope = GlobalSearchScope.projectScope(project);
            Collection<VirtualFile> files = FilenameIndex.getAllFilesByExt(project, "java", scope);

            PsiManager psiManager = PsiManager.getInstance(project);

            psiFiles = files.stream()
                    .map(file -> psiManager.findFile(file))
                    .toList();

            for(PsiFile file : psiFiles){
                currentProjectInfo.put(file.getName(), new ProjectInfo(file,"", file.getText()));
            }

        });


    }

    private void startSignal(){
        RequestDto requestDto = new RequestDto();
        requestDto.setSourceApplication("IntelliJ");
        requestDto.setDataType("SIGNAL");
        requestDto.setAccessToken(TokenManager.getInstance().getAccessToken());
        requestDto.setConnectedFileId(ConnectedFileManager.getInstance().getDirectoryId());
        requestDto.setTimestamp(LocalDateTime.now());

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String output = objectMapper.writeValueAsString(requestDto);
            BuildResultSender.sendMessage(output);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

    }

    private List<ModifiedFileInfo> getModifiedFiles() {
        ProjectTracker projectTracker = ProjectTracker.getInstance();
        projectTracker.currentHashStatus(project);

        Map<String, ProjectInfo> beforeProjectStatus = projectTracker.getBeforeProjectStatus();
        Map<String, ProjectInfo> currentProjectStatus = projectTracker.getCurrentProjectStatus();
        String allBeforeProjectStatus = projectTracker.getAllBeforeProjectStatus();
        String allCurrentProjectStatus = projectTracker.getAllCurrentProjectStatus();

        String before, current= "";
        boolean isChange = false; // 변경된 파일이 있는지 확인
        List<ModifiedFileInfo> modifiedFileInfoList = new ArrayList<>();

        // 파일을 추가하거나 삭제하지 않은 경우
        if(allBeforeProjectStatus.equals(allCurrentProjectStatus)){
            for(Map.Entry<String, ProjectInfo> entry : beforeProjectStatus.entrySet()){
                before = entry.getValue().getHash();
                current = currentProjectStatus.get(entry.getKey()).getHash();

                // 바뀐 파일이라면 해당 파일
                if(!before.equals(current)){
                    isChange = true;
                    PsiFile modifiedFile = currentProjectStatus.get(entry.getKey()).getPsiFile();
                    addModifiedFile(modifiedFileInfoList, modifiedFile);
                }
            }
        }

        // 파일을 추가하거나 삭제한 경우
        else{
            int beforeSize = beforeProjectStatus.size();
            int currentSize = currentProjectStatus.size();

            // 추가한 경우
            if(beforeSize <= currentSize){
                for(Map.Entry<String, ProjectInfo> entry : currentProjectStatus.entrySet()){

                    // 추가된 파일이 아닐 경우
                    if(beforeProjectStatus.containsKey(entry.getKey())){
                        before = beforeProjectStatus.get(entry.getKey()).getHash();
                        current = entry.getValue().getHash();

                        // 바뀐 파일이라면 해당 파일 저장
                        if(!before.equals(current)){
                            isChange = true;
                            PsiFile modifiedFile = entry.getValue().getPsiFile();
                            addModifiedFile(modifiedFileInfoList, modifiedFile);
                        }
                    }

                    // 추가된 파일일 경우
                    else{
                        isChange = true;
                        PsiFile modifiedFile = entry.getValue().getPsiFile();
                        addModifiedFile(modifiedFileInfoList, modifiedFile);
                    }

                }
            }
            // 삭제한 경우
            else if(beforeSize > currentSize){
                for(Map.Entry<String, ProjectInfo> entry : beforeProjectStatus.entrySet()){

                    // 삭제된 파일이 아닐 경우
                    if(currentProjectStatus.containsKey(entry.getKey())){
                        before = entry.getValue().getHash();
                        current = currentProjectStatus.get(entry.getKey()).getHash();

                        // 바뀐 파일이라면 해당 파일 저장
                        if(!before.equals(current)){
                            isChange = true;
                            PsiFile modifiedFile = currentProjectStatus.get(entry.getKey()).getPsiFile();
                            addModifiedFile(modifiedFileInfoList, modifiedFile);
                        }
                    }

                    // 삭제된 파일일 경우
                    else{
                        isChange = true;
                    }

                }
            }
        }

        // 변경된 파일이 있을 경우 현재 상태를 전 상태로 돌리기 (깊은 복사 )
        if (isChange){
            deepCopy(currentProjectStatus);
        }

        return modifiedFileInfoList;
    }

    private void addModifiedFile(List<ModifiedFileInfo> modifiedFileInfoList, PsiFile modifiedFile){
        String fileName = modifiedFile.getName();
        String sourceCode = modifiedFile.getText();

        modifiedFileInfoList.add(new ModifiedFileInfo(fileName, sourceCode));
    }

    private void deepCopy(Map<String, ProjectInfo> currentProjectStatus){
        ProjectTracker projectTracker = ProjectTracker.getInstance();
        projectTracker.setBeforeProjectStatus(
                currentProjectStatus.entrySet().stream()
                        .collect(Collectors.toMap(e -> e.getKey(), e-> {
                            try {
                                return (ProjectInfo) e.getValue().clone();
                            } catch (CloneNotSupportedException ex) {
                                throw new RuntimeException(ex);
                            }
                        }))
        );
    }

    private class OdodocProcessListener implements ProcessListener {
        StringBuilder allOutputLog = new StringBuilder(); // 전체 로그만 담는 변수
        StringBuilder errorLog = new StringBuilder(); // 에러 출력만 담는 변수
        StringBuilder stdOutLog = new StringBuilder(); // 표준 출력만 담는 변수

        // 프로세스가 끝이 났을 경우
        @Override
        public void processTerminated(@NotNull ProcessEvent event) {

            if(connectFlag) {
                RequestDto requestDto = new RequestDto();
                BuildResultInfo buildResultInfo = new BuildResultInfo();

                requestDto.setSourceApplication("IntelliJ");
                requestDto.setAccessToken(TokenManager.getInstance().getAccessToken());
                requestDto.setConnectedFileId(ConnectedFileManager.getInstance().getDirectoryId());
                requestDto.setTimestamp(LocalDateTime.now());

                // 오류가 발생했다면
                if(errorFlag){
                    buildResultInfo.setDetails(errorLog.toString());
                    buildResultInfo.setErrorFile(errorFiles.get(0));
                    buildResultInfo.setModifiedFiles(getModifiedFiles());

                    requestDto.setDataType("ERROR");
                    requestDto.setContent(buildResultInfo);
                }

                // 오류가 발생하지 않았다면
                else{
                    buildResultInfo.setDetails(stdOutLog.toString());
                    buildResultInfo.setModifiedFiles(getModifiedFiles());

                    requestDto.setDataType("OUTPUT");
                    requestDto.setContent(buildResultInfo);
                }

                ObjectMapper objectMapper = new ObjectMapper();
                try {
                    String output = objectMapper.writeValueAsString(requestDto);
                    BuildResultSender.sendMessage(output);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }

                // 초기화
                allOutputLog.setLength(0);
                errorLog.setLength(0);
                stdOutLog.setLength(0);
                errorFiles = new ArrayList<>();
            }
        }

        // 터미널 파싱
        @Override
        public void onTextAvailable(@NotNull ProcessEvent event, @NotNull Key outputType) {
            String text = event.getText();
            // 표준 에러 출력일 경우 (에러가 발생한 상황)
            if(outputType.equals(ProcessOutputTypes.STDERR)){
                errorFlag = true;
                errorLog.append(text);
            }

            else if(outputType.equals(ProcessOutputTypes.STDOUT)){

                // 표준 출력이지만 에러로그인 경우
                if(text.contains("ERROR")){
                    errorFlag = true;
                    errorLog.append(text);
                    capturingError = true; // 오류 로그 캡쳐 시작
                }
                else if(capturingError){
                    if(text.matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}\\+\\d{2}:\\d{2} .*")){
                        capturingError = false; // 캡쳐 종료
                    }
                    else{
                        Pattern pattern = Pattern.compile("\\(([^)]+):(\\d+)\\)");
                        Matcher matcher = pattern.matcher(text);
                        if(matcher.find()){
                            if(currentProjectInfo.containsKey(matcher.group(1))){
                                ProjectInfo projectInfo = currentProjectInfo.get(matcher.group(1));
                                String fileName = projectInfo.getPsiFile().getName();
                                String sourceCode = projectInfo.getSourceCode();
                                int line = Integer.parseInt(matcher.group(2));
                                errorFiles.add(new ErrorFileInfo(fileName, sourceCode, line));
                            }
                        }
                        errorLog.append(text);
                    }
                }

                else{
                    stdOutLog.append(text);
                }
            }
            allOutputLog.append(text);
        }
    }
}
