package com.sunbaby.english;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testResourceNotFoundReturnsConsistentErrorEnvelope() throws Exception {
        mockMvc.perform(get("/api/v1/health/test-not-found")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("DemoResource not found")))
                .andExpect(jsonPath("$.path", is("/api/v1/health/test-not-found")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    public void testBadRequestReturnsConsistentErrorEnvelope() throws Exception {
        mockMvc.perform(get("/api/v1/health/test-bad-request")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.message", containsString("simulated bad request")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser
    public void testNonExistentRouteReturns404Envelope() throws Exception {
        mockMvc.perform(get("/api/v1/non-existent-route-xyz")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }
}
