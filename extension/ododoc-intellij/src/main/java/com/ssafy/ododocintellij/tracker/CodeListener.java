package com.ssafy.ododocintellij.tracker;

import com.intellij.execution.ExecutionListener;
import com.intellij.execution.process.ProcessEvent;
import com.intellij.execution.process.ProcessHandler;
import com.intellij.execution.process.ProcessListener;
import com.intellij.execution.process.ProcessOutputTypes;
import com.intellij.execution.runners.ExecutionEnvironment;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.util.Key;
import org.jetbrains.annotations.NotNull;

public class CodeListener implements ExecutionListener {

    private final Project project;

    public CodeListener(Project project) {
        this.project = project;
    }

    @Override
    public void processStarted(@NotNull String executorId, @NotNull ExecutionEnvironment env, @NotNull ProcessHandler handler) {
        handler.addProcessListener(new ProcessListener() {

            StringBuilder outputLog = new StringBuilder();

            @Override
            public void processTerminated(@NotNull ProcessEvent event) {
                if(event.getExitCode() == 0){
                    System.out.println("성공");
                }
                else{
                    System.out.println("실패");
                }
                System.out.println(outputLog.toString());
            }

            @Override
            public void onTextAvailable(@NotNull ProcessEvent event, @NotNull Key outputType) {
                if(outputType.equals(ProcessOutputTypes.STDERR)) {
                    outputLog.append(event.getText());
                }
            }
        });
    }

}
