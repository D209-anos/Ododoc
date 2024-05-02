package com.ssafy.ododocintellij.tracker;

import com.intellij.execution.ExecutionListener;
import com.intellij.execution.process.ProcessEvent;
import com.intellij.execution.process.ProcessHandler;
import com.intellij.execution.process.ProcessListener;
import com.intellij.execution.process.ProcessOutputTypes;
import com.intellij.execution.runners.ExecutionEnvironment;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.util.Key;
import com.ssafy.ododocintellij.tracker.project.ProjectInfo;
import com.ssafy.ododocintellij.tracker.project.ProjectTracker;
import org.jetbrains.annotations.NotNull;

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

            // 프로세스가 끝이 났을 경우
            @Override
            public void processTerminated(@NotNull ProcessEvent event) {
                if(event.getExitCode() == 0){
                    System.out.println("성공");
                }
                else{
                    System.out.println("실패");
                }
                transferModifiedFiles();
                System.out.println(outputLog.toString());
                outputLog.setLength(0);
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

    private void transferModifiedFiles() {
        ProjectTracker projectTracker = ProjectTracker.getInstance();
        projectTracker.currentHashStatus(project);

        Map<String, ProjectInfo> beforeProjectStatus = projectTracker.getBeforeProjectStatus();
        Map<String, ProjectInfo> currentProjectStatus = projectTracker.getCurrentProjectStatus();
        String allBeforeProjectStatus = projectTracker.getAllBeforeProjectStatus();
        String allCurrentProjectStatus = projectTracker.getAllCurrentProjectStatus();

        String before, current= "";
        boolean isChange = false; // 변경된 파일이 있는지 확인

        // 파일을 추가하거나 삭제하지 않은 경우
        if(allBeforeProjectStatus.equals(allCurrentProjectStatus)){
            for(Map.Entry<String, ProjectInfo> entry : beforeProjectStatus.entrySet()){
                before = entry.getValue().getHash();
                current = currentProjectStatus.get(entry.getKey()).getHash();

                // 바뀐 파일이라면 해당 파일
                if(!before.equals(current)){
                    isChange = true;
                    System.out.println(currentProjectStatus.get(entry.getKey()).getPsiFile().getText());
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
                            System.out.println(entry.getValue().getPsiFile().getText());
                        }
                    }

                    // 추가된 파일일 경우
                    else{
                        isChange = true;
                        System.out.println(entry.getValue().getPsiFile().getText());
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
                            System.out.println(currentProjectStatus.get(entry.getKey()).getPsiFile().getText());
                        }
                    }

                    // 삭제된 파일일 경우
                    else{
                        isChange = true;
                        System.out.println("삭제되었습니다: " + entry.getValue().getPsiFile().getName());
                    }

                }
            }
        }

        // 변경된 파일이 있을 경우 현재 상태를 전 상태로 돌리기 (깊은 복사 )
        if (isChange){
            deepCopy(currentProjectStatus);
        }
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
