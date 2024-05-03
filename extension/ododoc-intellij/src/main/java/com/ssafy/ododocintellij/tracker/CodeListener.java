package com.ssafy.ododocintellij.tracker;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intellij.execution.ExecutionListener;
import com.intellij.execution.process.ProcessEvent;
import com.intellij.execution.process.ProcessHandler;
import com.intellij.execution.process.ProcessListener;
import com.intellij.execution.process.ProcessOutputTypes;
import com.intellij.execution.runners.ExecutionEnvironment;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.util.Key;
import com.intellij.psi.PsiFile;
import com.ssafy.ododocintellij.tracker.entity.ProjectInfo;
import com.ssafy.ododocintellij.tracker.manager.ProjectTracker;
import com.ssafy.ododocintellij.tracker.response.BuildResultInfo;
import com.ssafy.ododocintellij.tracker.response.ModifiedFileInfo;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CodeListener implements ExecutionListener {

    private final Project project;

    public CodeListener(Project project) {
        this.project = project;
    }

    @Override
    public void processStarted(@NotNull String executorId, @NotNull ExecutionEnvironment env, @NotNull ProcessHandler handler) {
        handler.addProcessListener(new ProcessListener() {

            StringBuilder outputLog = new StringBuilder();

            // 빌드가 끝이 났을 경우
            @Override
            public void processTerminated(@NotNull ProcessEvent event) {
                BuildResultInfo buildResultInfo = new BuildResultInfo();
                // Todo : 연동된 파일 ID 넣기
                buildResultInfo.setConnectedFileId(5);

                // 빌드가 끝난 시간 담기
                buildResultInfo.setTimeStamp(LocalDateTime.now().toString());

                // 빌드 성공 유무
                if(event.getExitCode() == 0){
                    buildResultInfo.setSuccess(true);
                }
                // 실패했을 경우 에러 내용 담기
                else{
                    buildResultInfo.setSuccess(false);
                    buildResultInfo.setContents(outputLog.toString());
                }
                buildResultInfo.setModifiedFiles(getModifiedFiles());
                outputLog.setLength(0);

                ObjectMapper objectMapper = new ObjectMapper();
                try {
                    String output = objectMapper.writeValueAsString(buildResultInfo);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }

            }

            // 터미널 파싱
            @Override
            public void onTextAvailable(@NotNull ProcessEvent event, @NotNull Key outputType) {
                if(outputType.equals(ProcessOutputTypes.STDERR)) {
                    outputLog.append(event.getText());
                }
            }
        });
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
    
}
