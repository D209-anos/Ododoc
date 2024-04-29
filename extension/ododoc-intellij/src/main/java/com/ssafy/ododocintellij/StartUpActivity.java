package com.ssafy.ododocintellij;

import com.intellij.openapi.project.Project;
import com.intellij.openapi.startup.ProjectActivity;
import com.ssafy.ododocintellij.login.frame.MainLoginFrame;
import com.ssafy.ododocintellij.login.token.TokenManager;
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
        TokenManager tokenManager = TokenManager.getInstance();
        Platform.startup(() -> {

            // 토큰이 없다면 로그인 요구
            if(tokenManager.getAccessToken() == null || tokenManager.getRefreshToken() == null){
                new MainLoginFrame();
            }

        });

        return null;
    }
}
