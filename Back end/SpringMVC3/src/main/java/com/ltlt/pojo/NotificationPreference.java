package com.ltlt.pojo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "notification_preference")
@NamedQueries({
    @NamedQuery(name = "NotificationPreference.findByUserId", 
                query = "SELECT n FROM NotificationPreference n WHERE n.userId = :userId")
})
public class NotificationPreference implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotNull
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(name = "push_enabled")
    private boolean pushEnabled = true;
    
    @Column(name = "sms_enabled")
    private boolean smsEnabled = false;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "fcm_token")
    private String fcmToken;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public boolean isPushEnabled() {
        return pushEnabled;
    }

    public void setPushEnabled(boolean pushEnabled) {
        this.pushEnabled = pushEnabled;
    }

    public boolean isSmsEnabled() {
        return smsEnabled;
    }

    public void setSmsEnabled(boolean smsEnabled) {
        this.smsEnabled = smsEnabled;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getFcmToken() {
        return fcmToken;
    }

    public void setFcmToken(String fcmToken) {
        this.fcmToken = fcmToken;
    }
} 