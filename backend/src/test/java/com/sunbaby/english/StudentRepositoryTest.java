package com.sunbaby.english;

import com.sunbaby.english.entity.Guardian;
import com.sunbaby.english.entity.SchoolGrade;
import com.sunbaby.english.entity.Student;
import com.sunbaby.english.entity.StudentGuardian;
import com.sunbaby.english.entity.enums.Gender;
import com.sunbaby.english.repository.GuardianRepository;
import com.sunbaby.english.repository.SchoolGradeRepository;
import com.sunbaby.english.repository.StudentGuardianRepository;
import com.sunbaby.english.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class StudentRepositoryTest {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SchoolGradeRepository schoolGradeRepository;

    @Autowired
    private GuardianRepository guardianRepository;

    @Autowired
    private StudentGuardianRepository studentGuardianRepository;

    private SchoolGrade grade1;

    @BeforeEach
    void setUp() {
        grade1 = schoolGradeRepository.save(SchoolGrade.builder()
                .name("Grade 1")
                .displayOrder(1)
                .active(true)
                .build());
    }

    @Test
    void testCreateAndFindStudent() {
        Student student = Student.builder()
                .studentCode("SB-2026-001")
                .firstName("Aarav")
                .lastName("Perera")
                .dateOfBirth(LocalDate.of(2018, 5, 12))
                .gender(Gender.MALE)
                .schoolGrade(grade1)
                .phone("+94771234567")
                .email("aarav.parent@example.com")
                .active(true)
                .build();

        Student saved = studentRepository.save(student);
        assertNotNull(saved.getId());

        Optional<Student> found = studentRepository.findByStudentCode("SB-2026-001");
        assertTrue(found.isPresent());
        assertEquals("Aarav", found.get().getFirstName());
        assertEquals("Grade 1", found.get().getSchoolGrade().getName());
    }

    @Test
    void testDuplicateStudentCodeThrowsException() {
        Student s1 = Student.builder()
                .studentCode("SB-DUP-001")
                .firstName("John")
                .lastName("Doe")
                .active(true)
                .build();
        studentRepository.saveAndFlush(s1);

        Student s2 = Student.builder()
                .studentCode("SB-DUP-001")
                .firstName("Jane")
                .lastName("Doe")
                .active(true)
                .build();

        assertThrows(DataIntegrityViolationException.class, () -> {
            studentRepository.saveAndFlush(s2);
        });
    }

    @Test
    void testStudentWithMultipleGuardians() {
        Student student = studentRepository.save(Student.builder()
                .studentCode("SB-2026-002")
                .firstName("Maya")
                .lastName("Silva")
                .active(true)
                .build());

        Guardian mother = guardianRepository.save(Guardian.builder()
                .name("Kavindi Silva")
                .relationship("Mother")
                .phone("+94779876543")
                .email("kavindi@example.com")
                .build());

        Guardian father = guardianRepository.save(Guardian.builder()
                .name("Sunil Silva")
                .relationship("Father")
                .phone("+94771122334")
                .build());

        studentGuardianRepository.save(StudentGuardian.builder()
                .student(student)
                .guardian(mother)
                .primary(true)
                .build());

        studentGuardianRepository.save(StudentGuardian.builder()
                .student(student)
                .guardian(father)
                .primary(false)
                .build());

        assertEquals(2, studentGuardianRepository.findByStudentId(student.getId()).size());
        Optional<StudentGuardian> primary = studentGuardianRepository.findByStudentIdAndPrimaryTrue(student.getId());
        assertTrue(primary.isPresent());
        assertEquals("Mother", primary.get().getGuardian().getRelationship());
    }
}
