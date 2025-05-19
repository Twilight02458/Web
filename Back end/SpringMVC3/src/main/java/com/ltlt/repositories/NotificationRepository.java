package com.ltlt.repositories;

import com.ltlt.pojo.NotificationPreference;
import java.util.List;

public interface NotificationRepository {
    NotificationPreference getPreferenceByUserId(Integer userId);
    boolean addNotificationPreference(NotificationPreference preference);
    boolean updateNotificationPreference(NotificationPreference preference);
    boolean updateFcmToken(Integer userId, String token);
} 