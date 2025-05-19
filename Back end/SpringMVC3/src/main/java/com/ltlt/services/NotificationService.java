package com.ltlt.services;

import com.ltlt.pojo.NotificationPreference;

public interface NotificationService {
    NotificationPreference getNotificationPreferences(Integer userId);
    boolean updateNotificationPreferences(NotificationPreference preferences);
    boolean saveFcmToken(Integer userId, String token);
    void sendLockerNotification(Integer userId, String itemName);
    void sendSmsNotification(String phoneNumber, String message);
} 