package com.driveMetaData.backend.listener;

import com.driveMetaData.backend.dto.RegistrationRequest;
import com.driveMetaData.backend.service.RegistrationService;
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

    @KafkaListener(
            topics = "${app.kafka.topic.registration}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "registrationKafkaListenerContainerFactory"
    )
    public void listenRegistrationTopic(
            @Payload RegistrationRequest message,
            @Header(name = KafkaHeaders.RECEIVED_PARTITION, required = false) Integer partition,
            @Header(name = KafkaHeaders.OFFSET, required = false) Long offset) {

        log.info("Received message from Kafka partition {}:{} - {}",
                partition != null ? partition : "N/A",
                offset != null ? offset : "N/A",
                message);
        try {
            registrationService.saveRegistration(message);
        } catch (Exception e) {
            log.error("Error processing message from partition {}:{} - {}",
                    partition != null ? partition : "N/A",
                    offset != null ? offset : "N/A",
                    e.getMessage(), e);
        }
    }
}