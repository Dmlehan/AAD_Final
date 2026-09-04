package com.sunbaby.english;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunbaby.english.dto.auth.LoginRequest;
import com.sunbaby.english.dto.user.CreateUserRequest;
import com.sunbaby.english.entity.User;
import com.sunbaby.english.entity.enums.UserRole;
import com.sunbaby.english.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String teacherToken;

    @BeforeEach
    void setUp() throws Exception {
        userRepository.deleteAll();

        userRepository.save(User.builder()
                .username("adminuser")
                .email("admin@test.com")
                .fullName("Admin Fullname")
                .passwordHash(passwordEncoder.encode("Secret123!"))
                .role(UserRole.ROLE_ADMIN)
                .active(true)
                .build());

        userRepository.save(User.builder()
                .username("teacheruser")
                .email("teacher@test.com")
                .fullName("Teacher Fullname")
                .passwordHash(passwordEncoder.encode("Secret123!"))
                .role(UserRole.ROLE_TEACHER)
                .active(true)
                .build());

        adminToken = obtainToken("adminuser", "Secret123!");
        teacherToken = obtainToken("teacheruser", "Secret123!");
    }

    private String obtainToken(String username, String password) throws Exception {
        LoginRequest request = LoginRequest.builder()
                .usernameOrEmail(username)
                .password(password)
                .build();

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();
    }

    @Test
    void testAdminCanListUsers() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(2)));
    }

    @Test
    void testTeacherCannotAccessUserManagementReturns403() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                        .header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.status", is(403)))
                .andExpect(jsonPath("$.error", is("Forbidden")));
    }

    @Test
    void testAdminCanCreateUserAndHashIsNeverExposed() throws Exception {
        CreateUserRequest request = CreateUserRequest.builder()
                .username("newteacher")
                .email("newteacher@test.com")
                .fullName("New Teacher")
                .password("NewPass123!")
                .role(UserRole.ROLE_TEACHER)
                .build();

        mockMvc.perform(post("/api/v1/users")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.username", is("newteacher")))
                .andExpect(jsonPath("$.data.role", is("ROLE_TEACHER")))
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.data.password").doesNotExist());
    }
}
