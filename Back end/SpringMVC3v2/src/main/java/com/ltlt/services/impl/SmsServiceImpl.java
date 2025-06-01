/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.services.impl;

import com.ltlt.services.SmsService;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

@Service
public class SmsServiceImpl implements SmsService {

    @Override
    public void sendSms(String content) {

        Message message = Message.creator(
                new PhoneNumber("+84983414384"),
                new PhoneNumber("+19786432877"),
                content
        ).create();

    }

}
