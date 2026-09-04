package com.sunbaby.english;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunbaby.english.dto.master.CreateClassGroupRequest;
import com.sunbaby.english.entity.AcademicYear;
import com.sunbaby.english.entity.SchoolGrade;
import com.sunbaby.english.repository.AcademicYearRepository;
import com.sunbaby.english.repository.ClassGroupRepository;
import com.sunbaby.english.repository.EnrollmentRepository;
import com.sunbaby.english.repository.SchoolGradeRepository;
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
import java.time.LocalTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ClassGroupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ClassGroupRepository classGroupRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private AcademicYearRepository academicYearRepository;

    @Autowired
    private SchoolGradeRepository schoolGradeRepository;

    private AcademicYear savedYear;
    private SchoolGrade savedGrade;

    @BeforeEach
    void setUp() {
        enrollmentRepository.deleteAll();
        classGroupRepository.deleteAll();
        academicYearRepository.deleteAll();
        schoolGradeRepository.deleteAll();

        savedYear = academicYearRepository.save(AcademicYear.builder()
                .name("2026 Academic Year")
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 12, 31))
                .active(true)
                .build());

        savedGrade = schoolGradeRepository.save(SchoolGrade.builder()
                .name("Grade 1")
                .displayOrder(1)
                .active(true)
                .build());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void testAdminCanCreateClassGroup() throws Exception {
        CreateClassGroupRequest request = CreateClassGroupRequest.builder()
                .name("Starters Saturday Morning")
                .academicYearId(savedYear.getId())
                .schoolGradeId(savedGrade.getId())
                .dayOfWeek("Saturday")
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(11, 0))
                .roomLocation("Room A1")
                .active(true)
                .build();

        mockMvc.perform(post("/api/v1/class-groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Starters Saturday Morning"))
                .andExpect(jsonPath("$.data.academicYearName").value("2026 Academic Year"))
                .andExpect(jsonPath("$.data.schoolGradeName").value("Grade 1"));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ROLE_ADMIN"})
    void testInvalidTimeRangeFailsValidation() throws Exception {
        CreateClassGroupRequest request = CreateClassGroupRequest.builder()
                .name("Invalid Time Class")
                .academicYearId(savedYear.getId())
                .dayOfWeek("Saturday")
                .startTime(LocalTime.of(12, 0))
                .endTime(LocalTime.of(10, 0)) // End before start
                .roomLocation("Room A1")
                .active(true)
                .build();

        mockMvc.perform(post("/api/v1/class-groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("End time")));
    }

    @Test
    @WithMockUser(username = "teacher", authorities = {"ROLE_TEACHER"})
    void testTeacherCanReadClassGroups() throws Exception {
        mockMvc.perform(get("/api/v1/class-groups"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "teacher", authorities = {"ROLE_TEACHER"})
    void testTeacherCannotCreateClassGroup() throws Exception {
        CreateClassGroupRequest request = CreateClassGroupRequest.builder()
                .name("Teacher Class")
                .academicYearId(savedYear.getId())
                .dayOfWeek("Sunday")
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(11, 0))
                .build();

        mockMvc.perform(post("/api/v1/class-groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
