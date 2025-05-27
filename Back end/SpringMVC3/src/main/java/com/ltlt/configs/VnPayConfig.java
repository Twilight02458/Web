/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;


@Configuration
@PropertySource("classpath:vnpay.properties")
public class VnPayConfig {

    @Value("${vnpay.tmnCode}")
    private String tmnCode;

    @Value("${vnpay.hashSecret}")
    private String hashSecret;

    @Value("${vnpay.returnUrl}")
    private String returnUrl;

    @Value("${vnpay.vnpayUrl}")
    private String vnpayUrl;

    @Value("${vnpay.version}")
    private String version;

    @Value("${vnpay.command}")
    private String command;

    // Getter để dùng trong Service
    public String getTmnCode() {
        return tmnCode;
    }

    public String getHashSecret() {
        return hashSecret;
    }

    public String getReturnUrl() {
        return returnUrl;
    }

    public String getVnpayUrl() {
        return vnpayUrl;
    }

    public String getVersion() {
        return version;
    }

    public String getCommand() {
        return command;
    }
}
