package com.driveMetaData.prince.config;

import com.driveMetaData.prince.entity.AppUser;
import com.driveMetaData.prince.repository.AppUserRepository;
import com.driveMetaData.prince.service.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class InitialDataConfig {

    private final AppUserRepository appUserRepository;
    private final RedisService redisService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            // Set test client status to active on application startup
            String clientId = "10";
            String statusJson = "{\"status\":\"active\"}";
            
            redisService.setClientStatus(clientId, statusJson);
            log.info("Initialized client_id {} with status: active", clientId);
            
            // Initialize default users if none exist
            if (appUserRepository.count() == 0) {
                log.info("No users found, creating default admin and user accounts");
                
                AppUser admin = new AppUser(
                    "admin", 
                    passwordEncoder.encode("admin123"),
                    Arrays.asList("ADMIN", "USER")
                );
                
                AppUser user = new AppUser(
                    "user", 
                    passwordEncoder.encode("user123"),
                    Collections.singletonList("USER")
                );
                
                // Save users to DB
                List<AppUser> savedUsers = appUserRepository.saveAll(Arrays.asList(admin, user));
                log.info("Created {} default users", savedUsers.size());
            } else {
                log.info("Users already exist in database, skipping default user creation");
            }
        };
    }
}