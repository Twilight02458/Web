/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.configs;

/**
 *
 * @author aicon
 */
import com.twilio.Twilio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:database.properties")
public class TwilioConfig {

    @Value("${twilio.account_sid}")
    private String accountSid;

    @Value("${twilio.auth_token}")
    private String authToken;

    @PostConstruct
    public void init() {
        System.out.println("Twilio init with SID: " + accountSid);
        Twilio.init(accountSid, authToken);
    }
}

