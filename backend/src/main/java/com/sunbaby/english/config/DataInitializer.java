package com.sunbaby.english.config;

import com.sunbaby.english.entity.User;
import com.sunbaby.english.entity.enums.UserRole;
import com.sunbaby.english.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding initial administrator and teacher accounts for development...");

            User admin = User.builder()
                    .username("admin")
                    .email("admin@sunbaby.edu")
                    .fullName("Head Administrator")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(UserRole.ROLE_ADMIN)
                    .active(true)
                    .build();

            User teacher = User.builder()
                    .username("teacher")
                    .email("teacher@sunbaby.edu")
                    .fullName("Senior English Teacher")
                    .passwordHash(passwordEncoder.encode("teacher123"))
                    .role(UserRole.ROLE_TEACHER)
                    .active(true)
                    .build();

            userRepository.save(admin);
            userRepository.save(teacher);

            log.info("Initial users seeded successfully: 'admin' (ROLE_ADMIN) and 'teacher' (ROLE_TEACHER).");
        }
    }
}
