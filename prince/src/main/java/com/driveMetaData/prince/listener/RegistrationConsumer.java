package com.driveMetaData.prince.listener;

import com.driveMetaData.prince.dto.RegistrationRequest;
import com.driveMetaData.prince.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RegistrationConsumer {

    private final RegistrationService registrationService;

    @KafkaListener(topics = "${app.kafka.topic.registration}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenRegistrationTopic(
            @Payload RegistrationRequest message,
            @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {

        log.info("Received message from Kafka partition {}:{} - {}", partition, offset, message);
        try {
            registrationService.saveRegistration(message);
        } catch (Exception e) {
            // Handle exceptions during processing
            log.error("Error processing message from partition {}:{} - {}", partition, offset, e.getMessage(), e);
            // Implement error handling strategy (e.g., DLQ, logging)
        }
    }
}