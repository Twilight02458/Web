package com.ltlt.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

public class SpeedSMSAPI {
    private static final Logger LOGGER = Logger.getLogger(SpeedSMSAPI.class.getName());
    private static final String API_URL = "https://api.speedsms.vn/index.php";
    private final String accessToken;

    public SpeedSMSAPI(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getUserInfo() {
        try {
            URL url = new URL(API_URL + "/user/info");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", accessToken);
            conn.setDoOutput(true);

            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            return response.toString();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error getting user info from SpeedSMS", e);
            return "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
        }
    }

    public String sendSMS(String phone, String content, int type, String sender) {
        try {
            URL url = new URL(API_URL + "/sms/send");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", accessToken);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            String jsonInputString = String.format(
                "{\"to\":[\"%s\"],\"content\":\"%s\",\"sms_type\":%d,\"sender\":\"%s\"}",
                phone, content, type, sender
            );

            try (OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream())) {
                writer.write(jsonInputString);
                writer.flush();
            }

            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            return response.toString();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error sending SMS via SpeedSMS", e);
            return "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
        }
    }
} 