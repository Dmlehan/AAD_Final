package com.sunbaby.english;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunbaby.english.dto.master.CreateAcademicYearRequest;
import com.sunbaby.english.repository.AcademicYearRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AcademicYearControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AcademicYearRepository academicYearRepository;

    @BeforeEach
    void setUp() {
        academicYearRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void testAdminCanCreateAcademicYear() throws Exception {
        CreateAcademicYearRequest request = CreateAcademicYearRequest.builder()
                .name("2026 Academic Year")
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 12, 31))
                .active(true)
                .build();

        mockMvc.perform(post("/api/v1/academic-years")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("2026 Academic Year"))
                .andExpect(jsonPath("$.data.active").value(true));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void testEndDateBeforeStartDateFailsValidation() throws Exception {
        CreateAcademicYearRequest request = CreateAcademicYearRequest.builder()
                .name("Invalid Dates 2026")
                .startDate(LocalDate.of(2026, 12, 31))
                .endDate(LocalDate.of(2026, 1, 1))
                .active(true)
                .build();

        mockMvc.perform(post("/api/v1/academic-years")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("End date")));
    }

    @Test
    @WithMockUser(username = "teacher", authorities = {"ROLE_TEACHER"})
    void testTeacherCanReadAcademicYears() throws Exception {
        mockMvc.perform(get("/api/v1/academic-years"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "teacher", authorities = {"ROLE_TEACHER"})
    void testTeacherCannotCreateAcademicYear() throws Exception {
        CreateAcademicYearRequest request = CreateAcademicYearRequest.builder()
                .name("Teacher Year 2026")
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 12, 31))
                .build();

        mockMvc.perform(post("/api/v1/academic-years")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
