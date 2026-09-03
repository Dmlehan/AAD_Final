package com.sunbaby.english;

import com.sunbaby.english.entity.*;
import com.sunbaby.english.entity.enums.AttendanceStatus;
import com.sunbaby.english.entity.enums.EnrollmentStatus;
import com.sunbaby.english.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ClassGroupEnrollmentTest {

    @Autowired
    private AcademicYearRepository academicYearRepository;

    @Autowired
    private EnglishLevelRepository englishLevelRepository;

    @Autowired
    private ClassGroupRepository classGroupRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    private AcademicYear year2026;
    private EnglishLevel levelFlyers;
    private ClassGroup classGroup;
    private Student student;

    @BeforeEach
    void setUp() {
        year2026 = academicYearRepository.save(AcademicYear.builder()
                .name("Academic Year 2026")
                .startDate(LocalDate.of(2026, 1, 10))
                .endDate(LocalDate.of(2026, 12, 15))
                .active(true)
                .build());

        levelFlyers = englishLevelRepository.save(EnglishLevel.builder()
                .name("Flyers")
                .description("Cambridge Flyers English Level")
                .displayOrder(3)
                .active(true)
                .build());

        classGroup = classGroupRepository.save(ClassGroup.builder()
                .name("Saturday Flyers Group A")
                .academicYear(year2026)
                .englishLevel(levelFlyers)
                .dayOfWeek("Saturday")
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(11, 0))
                .roomLocation("Room 1")
                .active(true)
                .build());

        student = studentRepository.save(Student.builder()
                .studentCode("SB-2026-099")
                .firstName("Kavith")
                .lastName("Dias")
                .active(true)
                .build());
    }

    @Test
    void testEnrollStudentAndRecordAttendance() {
        Enrollment enrollment = enrollmentRepository.save(Enrollment.builder()
                .student(student)
                .classGroup(classGroup)
                .enrollmentDate(LocalDate.of(2026, 2, 1))
                .status(EnrollmentStatus.ACTIVE)
                .build());

        assertNotNull(enrollment.getId());

        // Mark attendance
        AttendanceRecord attendance = attendanceRecordRepository.save(AttendanceRecord.builder()
                .enrollment(enrollment)
                .attendanceDate(LocalDate.of(2026, 9, 5))
                .status(AttendanceStatus.PRESENT)
                .notes("On time")
                .build());

        assertNotNull(attendance.getId());
        assertEquals(1, attendanceRecordRepository.findByEnrollmentId(enrollment.getId()).size());
    }

    @Test
    void testDuplicateEnrollmentThrowsException() {
        enrollmentRepository.saveAndFlush(Enrollment.builder()
                .student(student)
                .classGroup(classGroup)
                .enrollmentDate(LocalDate.of(2026, 2, 1))
                .status(EnrollmentStatus.ACTIVE)
                .build());

        assertThrows(DataIntegrityViolationException.class, () -> {
            enrollmentRepository.saveAndFlush(Enrollment.builder()
                    .student(student)
                    .classGroup(classGroup)
                    .enrollmentDate(LocalDate.of(2026, 2, 1))
                    .status(EnrollmentStatus.ACTIVE)
                    .build());
        });
    }
}
