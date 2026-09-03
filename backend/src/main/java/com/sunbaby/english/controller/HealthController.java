package com.sunbaby.english.controller;

import com.sunbaby.english.dto.ApiResponse;
import com.sunbaby.english.exception.BadRequestException;
import com.sunbaby.english.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("service", "Sun Baby English Student Management System");
        healthInfo.put("version", "1.0.0");
        healthInfo.put("paymentMode", "MANUAL_OFFLINE_WHATSAPP_RECEIPT");
        healthInfo.put("onlinePaymentGateway", "DISABLED");
        healthInfo.put("serverTime", LocalDateTime.now().toString());

        return ResponseEntity.ok(ApiResponse.success("Sun Baby English API is operational", healthInfo));
    }

    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<String>> ping() {
        return ResponseEntity.ok(ApiResponse.success("pong", "OK"));
    }

    @GetMapping("/health/test-not-found")
    public ResponseEntity<Void> testNotFound() {
        throw new ResourceNotFoundException("DemoResource", "id", "9999");
    }

    @GetMapping("/health/test-bad-request")
    public ResponseEntity<Void> testBadRequest() {
        throw new BadRequestException("This is a simulated bad request for error testing.");
    }
}
