package com.ltlt.controllers;

import com.ltlt.pojo.NotificationPreference;
import com.ltlt.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/secure/notifications")
public class ApiNotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/preferences")
    public ResponseEntity<?> getNotificationPreferences(Authentication auth) {
        try {
            if (auth == null || auth.getName() == null) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }

            NotificationPreference preferences = notificationService.getNotificationPreferences(
                Integer.parseInt(auth.getName())
            );
            
            if (preferences == null) {
                // Create default preferences if none exist
                preferences = new NotificationPreference();
                preferences.setUserId(Integer.parseInt(auth.getName()));
                preferences.setPushEnabled(true);
                preferences.setSmsEnabled(false);
                notificationService.updateNotificationPreferences(preferences);
            }
            
            return new ResponseEntity<>(preferences, HttpStatus.OK);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>("Invalid user ID format", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting notification preferences: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/preferences")
    public ResponseEntity<?> updateNotificationPreferences(
            @RequestBody NotificationPreference preferences,
            Authentication auth) {
        try {
            if (auth == null || auth.getName() == null) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }

            // Ensure the user can only update their own preferences
            preferences.setUserId(Integer.parseInt(auth.getName()));
            
            boolean success = notificationService.updateNotificationPreferences(preferences);
            if (success) {
                return new ResponseEntity<>("Notification preferences updated successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Failed to update notification preferences", HttpStatus.BAD_REQUEST);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>("Invalid user ID format", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating notification preferences: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/fcm-token")
    public ResponseEntity<?> saveFcmToken(
            @RequestBody String token,
            Authentication auth) {
        try {
            if (auth == null || auth.getName() == null) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }

            if (token == null || token.trim().isEmpty()) {
                return new ResponseEntity<>("FCM token cannot be empty", HttpStatus.BAD_REQUEST);
            }

            boolean success = notificationService.saveFcmToken(
                Integer.parseInt(auth.getName()),
                token.trim()
            );
            
            if (success) {
                return new ResponseEntity<>("FCM token saved successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Failed to save FCM token", HttpStatus.BAD_REQUEST);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>("Invalid user ID format", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error saving FCM token: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 