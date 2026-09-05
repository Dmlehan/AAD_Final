package com.sunbaby.english;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunbaby.english.dto.enrollment.CreateEnrollmentRequest;
import com.sunbaby.english.dto.enrollment.UpdateEnrollmentStatusRequest;
import com.sunbaby.english.entity.AcademicYear;
import com.sunbaby.english.entity.ClassGroup;
import com.sunbaby.english.entity.Student;
import com.sunbaby.english.entity.enums.EnrollmentStatus;
import com.sunbaby.english.repository.AcademicYearRepository;
import com.sunbaby.english.repository.ClassGroupRepository;
import com.sunbaby.english.repository.EnrollmentRepository;
import com.sunbaby.english.repository.StudentRepository;
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
public class EnrollmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassGroupRepository classGroupRepository;

    @Autowired
    private AcademicYearRepository academicYearRepository;

    private Student activeStudent;
    private ClassGroup activeClass;

    @BeforeEach
    void setUp() {
        enrollmentRepository.deleteAll();
        classGroupRepository.deleteAll();
        academicYearRepository.deleteAll();
        studentRepository.deleteAll();

        AcademicYear year = academicYearRepository.save(AcademicYear.builder()
                .name("2026 Year")
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 12, 31))
                .active(true)
                .build());

        activeClass = classGroupRepository.save(ClassGroup.builder()
                .name("Movers Sunday Morning")
                .academicYear(year)
                .dayOfWeek("Sunday")
                .startTime(LocalTime.of(9, 30))
                .endTime(LocalTime.of(11, 30))
                .active(true)
                .build());

        activeStudent = studentRepository.save(Student.builder()
                .studentCode("SB-2026-TEST")
                .firstName("Kasun")
                .lastName("Fernando")
                .active(true)
                .build());
    }

    @Test
    @WithMockUser(username = "teacher", authorities = {"ROLE_TEACHER"})
    void testTeacherCanEnrollStudentInClass() throws Exception {
        CreateEnrollmentRequest request = CreateEnrollmentRequest.builder()
                .studentId(activeStudent.getId())
                .classGroupId(activeClass.getId())
                .enrollmentDate(LocalDate.now())
                .notes("New enrollment for Term 1")
                .build();

        mockMvc.perform(post("/api/v1/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.studentName").value("Kasun Fernando"))
                .andExpect(jsonPath("$.data.classGroupName").value("Movers Sunday Morning"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));
    }

    @Test
    @WithMockUser(username = "teacher", authorities = {"ROLE_TEACHER"})
    void testDuplicateActiveEnrollmentFails() throws Exception {
        CreateEnrollmentRequest request = CreateEnrollmentRequest.builder()
                .studentId(activeStudent.getId())
                .classGroupId(activeClass.getId())
                .build();

        mockMvc.perform(post("/api/v1/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Try enrolling again while active
        mockMvc.perform(post("/api/v1/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("already actively enrolled")));
    }

    @Test
    @WithMockUser(username = "teacher", authorities = {"ROLE_TEACHER"})
    void testUpdateEnrollmentStatus() throws Exception {
        CreateEnrollmentRequest request = CreateEnrollmentRequest.builder()
                .studentId(activeStudent.getId())
                .classGroupId(activeClass.getId())
                .build();

        String res = mockMvc.perform(post("/api/v1/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long enrollmentId = objectMapper.readTree(res).path("data").path("id").asLong();

        UpdateEnrollmentStatusRequest updateRequest = UpdateEnrollmentStatusRequest.builder()
                .status(EnrollmentStatus.DROPPED)
                .notes("Relocated to another city")
                .build();

        mockMvc.perform(patch("/api/v1/enrollments/" + enrollmentId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("DROPPED"))
                .andExpect(jsonPath("$.data.notes").value("Relocated to another city"));
    }
}
