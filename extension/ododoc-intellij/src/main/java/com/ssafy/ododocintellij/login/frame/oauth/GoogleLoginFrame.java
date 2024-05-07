package com.ssafy.ododocintellij.login.frame.oauth;

import com.intellij.execution.ExecutionManager;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.project.Project;
import com.ssafy.ododocintellij.login.alert.AlertHelper;
import com.ssafy.ododocintellij.login.frame.MainLoginFrame;
import com.ssafy.ododocintellij.login.token.TokenManager;
import com.ssafy.ododocintellij.sender.BuildResultSender;
import com.ssafy.ododocintellij.tracker.CodeListener;
import com.ssafy.ododocintellij.tracker.manager.ProjectProvider;
import com.ssafy.ododocintellij.tracker.manager.ProjectTracker;
import javafx.application.Platform;
import javafx.concurrent.Worker;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.ProgressIndicator;
import javafx.scene.image.Image;
import javafx.scene.layout.StackPane;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import org.java_websocket.client.WebSocketClient;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.net.CookieHandler;
import java.net.CookieManager;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import static java.net.CookiePolicy.ACCEPT_ALL;

public class GoogleLoginFrame extends Stage {
    private final String CLIENT_ID = "599323777848-68aq3cu9p98np6eml1m77mfc1ethpkrp.apps.googleusercontent.com";
    private final String REDIRECT_URI = "https://k10d209.p.ssafy.io/api/oauth2/authorization/google";
    private final int TIME_OUT = 5; // 로그인 응답 대기 시간

    private ScheduledExecutorService scheduler;
    private MainLoginFrame mainLoginFrame = null;
    private ProgressIndicator loadingIndicator;
    private Alert alert;

    public GoogleLoginFrame(MainLoginFrame mainLoginFrame) {
        this.mainLoginFrame = mainLoginFrame;

        setTitle(" GOOGLE");
        Image windowIcon = new Image(getClass().getResourceAsStream("/image/button/google_icon.png"));
        getIcons().add(windowIcon);

        StackPane layout = new StackPane();
        WebView webView = new WebView();
        WebEngine webEngine = webView.getEngine();
        loadingIndicator = new ProgressIndicator();
        loadingIndicator.setVisible(false);

        layout.getChildren().addAll(webView, loadingIndicator);
        Scene scene = new Scene(layout, 450, 600);
        setScene(scene);
        show();

        alert = AlertHelper.makeAlert(
                Alert.AlertType.CONFIRMATION,
                " GOOGLE",
                "로그인 실패",
                "다시 로그인 해주세요.",
                "/image/button/google_icon.png"
        );

        doGoogleLogin(webEngine);
    }

    private void doGoogleLogin(WebEngine webEngine) {

        CookieManager cookieManager = new CookieManager();
        cookieManager.setCookiePolicy(ACCEPT_ALL);
        CookieHandler.setDefault(cookieManager);

        TokenManager tokenManager = TokenManager.getInstance();

        if(scheduler != null && !scheduler.isShutdown()){
            scheduler.shutdownNow();
        }
        scheduler = Executors.newSingleThreadScheduledExecutor();
        Runnable timeoutTask = () -> {
            Platform.runLater(() -> {
                alert.showAndWait();
                close();
                cookieManager.getCookieStore().removeAll();
            });
        };


        webEngine.getLoadWorker().stateProperty().addListener((obs, oldState, newState) -> {

            // 화면이 성공적으로 전환이 되었을 때
            if (newState == Worker.State.SUCCEEDED) {

                // 로그인 응답 시간 스케쥴러 등록, 로딩 스피너 작동
                if (webEngine.getLocation().contains("SetSID")){
                    scheduler.schedule(timeoutTask, TIME_OUT, TimeUnit.SECONDS);
                    loadingIndicator.setVisible(true);
                }

                // 응답을 받을 화면이 나온다면
                if (webEngine.getLocation().contains(REDIRECT_URI) && webEngine.getLocation().contains("Fuserinfo.profile")) {

                    scheduler.shutdownNow();
                    loadingIndicator.setVisible(false);

                    // javascript를 실행시켜 content 정보 가져오기
                    String content = (String) webEngine.executeScript("document.body.textContent");

                    Long status;
                    JSONParser jsonParser = new JSONParser();

                    try {
                        // String to Json
                        JSONObject json = (JSONObject) jsonParser.parse(content);
                        status = (Long) json.get("status");
                        JSONObject data = (JSONObject) json.get("data");

                        if (status != 200) {
                            alert.showAndWait();
                            close();
                            cookieManager.getCookieStore().removeAll();
                        } else {
                            // access 토큰을 싱글톤 객체에 저장
                            tokenManager.setAccessToken((String) data.get("accessToken"));
                        }


                    } catch (ParseException e) {
                        throw new RuntimeException(e);
                    }

                    // 쿠키의 refresh 토큰을 싱글톤 객체에 저장
                    cookieManager.getCookieStore().getCookies().forEach(cookie -> {
                        if (cookie.getName().equals("refreshToken")) {
                            tokenManager.setRefreshToken(cookie.getValue());
                        }
                    });

                    // 지금 현재 등록되어 있는 모든 프로젝트들에게 codeListener 추가하기
                    addCodeListener(ProjectProvider.getInstance());
                    connectWebSocket();

                    mainLoginFrame.close();
                    close();
                }
            }

        });

        webEngine.load(
                "https://accounts.google.com/o/oauth2/v2/auth?client_id="
                        + CLIENT_ID
                        + "&redirect_uri="
                        + REDIRECT_URI
                        + "&scope=profile&response_type=code");
    }

    // Queue에 있는 project 객체에 codeListener 추가해주기.
    private void addCodeListener(ProjectProvider projectProvider){
        int size = projectProvider.getProjects().size();
        ProjectTracker projectTracker = ProjectTracker.getInstance();
        Project tempProject = null;
        for(int i = 0; i < size; i++){
            tempProject = projectProvider.getProjects().poll();
            tempProject.getMessageBus().connect().subscribe(ExecutionManager.EXECUTION_TOPIC, new CodeListener(tempProject));

            Project finalTempProject = tempProject;
            ApplicationManager.getApplication().runReadAction(() -> {
                projectTracker.initHashStatus(finalTempProject);
            });
        }
    }

    // 처리 서버와 webSocket 연결해주기
    private void connectWebSocket() {
        BuildResultSender.getINSTANCE("ws://localhost:18080/process/ws");
    }
}
