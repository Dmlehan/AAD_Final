package com.sunbaby.english;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunbaby.english.dto.auth.LoginRequest;
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
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private User activeAdmin;
    private User inactiveTeacher;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        activeAdmin = userRepository.save(User.builder()
                .username("testadmin")
                .email("admin@test.com")
                .fullName("Test Administrator")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.ROLE_ADMIN)
                .active(true)
                .build());

        inactiveTeacher = userRepository.save(User.builder()
                .username("disabledteacher")
                .email("inactive@test.com")
                .fullName("Inactive Teacher")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.ROLE_TEACHER)
                .active(false)
                .build());
    }

    @Test
    void testSuccessfulLoginReturnsJwtAndUserDto() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .usernameOrEmail("testadmin")
                .password("Password123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.accessToken", notNullValue()))
                .andExpect(jsonPath("$.data.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.data.user.username", is("testadmin")))
                .andExpect(jsonPath("$.data.user.role", is("ROLE_ADMIN")))
                .andExpect(jsonPath("$.data.user.passwordHash").doesNotExist());
    }

    @Test
    void testInvalidPasswordReturns401() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .usernameOrEmail("testadmin")
                .password("WrongPassword")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.error", is("Unauthorized")))
                .andExpect(jsonPath("$.message", containsString("Invalid username or password")));
    }

    @Test
    void testInactiveUserCannotLogin() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .usernameOrEmail("disabledteacher")
                .password("Password123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("disabled")));
    }

    @Test
    void testGetMeWithValidTokenReturnsCurrentUser() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .usernameOrEmail("testadmin")
                .password("Password123!")
                .build();

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn();

        String token = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();

        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.username", is("testadmin")))
                .andExpect(jsonPath("$.data.email", is("admin@test.com")))
                .andExpect(jsonPath("$.data.role", is("ROLE_ADMIN")));
    }

    @Test
    void testGetMeWithoutTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.status", is(401)));
    }
}
