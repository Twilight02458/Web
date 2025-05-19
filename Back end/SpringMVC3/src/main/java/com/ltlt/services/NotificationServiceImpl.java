package com.ltlt.services;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.ltlt.pojo.NotificationPreference;
import com.ltlt.repositories.NotificationRepository;
import com.ltlt.utils.SpeedSMSAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Value("${speedsms.access.token}")
    private String speedSmsAccessToken;
    
    @Value("${speedsms.sender}")
    private String speedSmsSender;
    
    private static final Logger LOGGER = Logger.getLogger(NotificationServiceImpl.class.getName());
    private static final int SMS_TYPE = 4; // Using brandname default (Verify or Notify)
    
    static {
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                new ClassPathResource("firebase-service-account.json").getInputStream()
            );
            
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .build();
                
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error initializing Firebase", e);
        }
    }

    @Override
    public NotificationPreference getNotificationPreferences(Integer userId) {
        try {
            return notificationRepository.getPreferenceByUserId(userId);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error getting notification preferences", e);
            return null;
        }
    }

    @Override
    public boolean updateNotificationPreferences(NotificationPreference preferences) {
        try {
            NotificationPreference existing = notificationRepository.getPreferenceByUserId(preferences.getUserId());
            if (existing == null) {
                return notificationRepository.addNotificationPreference(preferences);
            }
            return notificationRepository.updateNotificationPreference(preferences);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error updating notification preferences", e);
            return false;
        }
    }

    @Override
    public boolean saveFcmToken(Integer userId, String token) {
        try {
            return notificationRepository.updateFcmToken(userId, token);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error saving FCM token", e);
            return false;
        }
    }

    @Override
    public void sendLockerNotification(Integer userId, String itemName) {
        try {
            NotificationPreference preferences = getNotificationPreferences(userId);
            if (preferences == null) {
                LOGGER.warning("No notification preferences found for user: " + userId);
                return;
            }

            if (preferences.isPushEnabled()) {
                String fcmToken = preferences.getFcmToken();
                if (fcmToken != null && !fcmToken.isEmpty()) {
                    try {
                        Message message = Message.builder()
                            .setNotification(Notification.builder()
                                .setTitle("Thông báo tủ đồ")
                                .setBody("Bạn có món hàng mới: " + itemName)
                                .build())
                            .setToken(fcmToken)
                            .build();

                        FirebaseMessaging.getInstance().send(message);
                        LOGGER.info("Push notification sent successfully to user: " + userId);
                    } catch (Exception e) {
                        LOGGER.log(Level.SEVERE, "Error sending push notification", e);
                    }
                } else {
                    LOGGER.warning("No FCM token found for user: " + userId);
                }
            }

            if (preferences.isSmsEnabled() && preferences.getPhoneNumber() != null) {
                try {
                    String smsMessage = "Bạn có món hàng mới trong tủ đồ: " + itemName;
                    sendSmsNotification(preferences.getPhoneNumber(), smsMessage);
                } catch (Exception e) {
                    LOGGER.log(Level.SEVERE, "Error sending SMS notification", e);
                }
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error in sendLockerNotification", e);
        }
    }

    @Override
    public void sendSmsNotification(String phoneNumber, String message) {
        try {
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                LOGGER.warning("Phone number is empty or null");
                return;
            }

            // Ensure phone number starts with country code
            if (!phoneNumber.startsWith("84")) {
                phoneNumber = "84" + phoneNumber.replaceFirst("^0+", "");
            }

            SpeedSMSAPI api = new SpeedSMSAPI(speedSmsAccessToken);
            String response = api.sendSMS(phoneNumber, message, SMS_TYPE, speedSmsSender);
            LOGGER.info("SMS Response for " + phoneNumber + ": " + response);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error sending SMS to " + phoneNumber, e);
        }
    }
} 