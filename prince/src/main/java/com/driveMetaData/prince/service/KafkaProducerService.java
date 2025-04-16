package com.driveMetaData.prince.service;

import com.driveMetaData.prince.dto.RegistrationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, RegistrationRequest> kafkaTemplate;

    @Value("${app.kafka.topic.registration}")
    private String registrationTopic;

    public void sendRegistrationMessage(RegistrationRequest request) {
        try {
            // Using email as key for potential partitioning, or null/UUID if not needed
            kafkaTemplate.send(registrationTopic, request.getEmail(), request);
            log.info("Sent registration request to Kafka topic '{}': {}", registrationTopic, request);
        } catch (Exception e) {
            log.error("Failed to send message to Kafka topic '{}': {}", registrationTopic, e.getMessage(), e);
            // Implement retry logic or handle the failure appropriately
        }
    }
}