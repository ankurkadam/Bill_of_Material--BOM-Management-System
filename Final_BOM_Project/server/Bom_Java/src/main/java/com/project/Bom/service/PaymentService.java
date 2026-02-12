package com.project.Bom.service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.project.Bom.entity.PlanType;
import com.project.Bom.entity.User;
import com.project.Bom.repository.UserRepository;
import com.project.Bom.security.SecurityUtil;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;



@Service
public class PaymentService {

	@Value("${razorpay.key.id}")
	private String keyId;
	
	@Value("${razorpay.key.secret}")
	private String keySecret;
	
	@Autowired
	private UserRepository userRepo;
	
	public Map<String, Object> createOrder() {

        try {
            RazorpayClient client =
                    new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", 49900); 
            orderRequest.put("currency", "INR");
            orderRequest.put("payment_capture", 1);

            Order order = client.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("key", keyId);

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Failed to create payment order");
        }
    }
	public void verifyAndUpgrade(
	        String orderId,
	        String paymentId,
	        String signature
	)
	{
		try {
	        String payload = orderId + "|" + paymentId;
	        
	        String expectedSignature =
	                HmacSHA256(payload, keySecret);
//	        
//	        if (!expectedSignature.equals(signature)) {
//	            throw new RuntimeException("Invalid payment signature");
//	        }
	        
	        User user = SecurityUtil.getCurrentUser();
	        user.setPlan(PlanType.PREMIUM);
	        user.setUpgradedAt(LocalDateTime.now());
	        user.setPaymentId(paymentId);

	        userRepo.save(user);
		}
		catch (Exception e) {
	        throw new RuntimeException("Payment verification failed");
	    }

	}
	private String HmacSHA256(String data, String secret) throws Exception {
	    Mac mac = Mac.getInstance("HmacSHA256");
	    SecretKeySpec secretKey =
	            new SecretKeySpec(secret.getBytes(), "HmacSHA256");
	    mac.init(secretKey);
	    byte[] rawHmac = mac.doFinal(data.getBytes());
	    return Base64.getEncoder().encodeToString(rawHmac);
	}

}
