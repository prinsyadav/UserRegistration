package com.driveMetaData.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topic.registration}")
    private String registrationTopic;

    public <T> CompletableFuture<SendResult<String, Object>> sendMessage(T message) {
        log.info("Sending message to topic {}: {}", registrationTopic, message);

        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(registrationTopic, message);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Message sent successfully to topic {} partition {} @ offset {}",
                        registrationTopic,
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            } else {
                log.error("Unable to send message to topic {}: {}", registrationTopic, ex.getMessage());
            }
        });

        return future;
    }
}