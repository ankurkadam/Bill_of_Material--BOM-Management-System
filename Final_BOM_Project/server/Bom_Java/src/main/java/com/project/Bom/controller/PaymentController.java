package com.project.Bom.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.Bom.dto.PaymentVerifyDTO;
import com.project.Bom.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public Map<String, Object> createOrder() {
        return paymentService.createOrder();
    }

    @PostMapping("/verify")
    public String verifyPayment(@RequestBody PaymentVerifyDTO dto) {

        paymentService.verifyAndUpgrade(
                dto.getOrderId(),
                dto.getPaymentId(),
                dto.getSignature()
        );

        return "Payment successful. Plan upgraded to PREMIUM.";
    }
}
