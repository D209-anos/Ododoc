package com.ssafy.ododocintellij;

import com.intellij.openapi.project.Project;
import com.intellij.openapi.startup.ProjectActivity;
import com.ssafy.ododocintellij.login.frame.MainLoginFrame;
import javafx.application.Platform;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class StartUpActivity implements ProjectActivity {

    @Nullable
    @Override
    public Object execute(@NotNull Project project, @NotNull Continuation<? super Unit> continuation) {
//        project.getMessageBus().connect().subscribe();
        Platform.startup(() -> {
            new MainLoginFrame();
        });

        return null;
    }
}
