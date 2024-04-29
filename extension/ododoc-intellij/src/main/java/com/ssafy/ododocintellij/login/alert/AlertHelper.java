package com.ssafy.ododocintellij.login.alert;

import javafx.scene.control.Alert;

public class AlertHelper {

    public static Alert makeAlert(Alert.AlertType alertType, String title, String header, String content) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.showAndWait();

        return alert;
    }
}
