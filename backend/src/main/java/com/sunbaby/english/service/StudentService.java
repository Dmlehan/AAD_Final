package com.sunbaby.english.service;

import com.sunbaby.english.dto.enrollment.EnrollmentSummaryDto;
import com.sunbaby.english.dto.guardian.CreateGuardianRequest;
import com.sunbaby.english.dto.student.CreateStudentRequest;
import com.sunbaby.english.dto.student.GuardianSummaryDto;
import com.sunbaby.english.dto.student.StudentDto;
import com.sunbaby.english.dto.student.UpdateStudentRequest;
import com.sunbaby.english.entity.*;
import com.sunbaby.english.exception.BadRequestException;
import com.sunbaby.english.exception.ResourceNotFoundException;
import com.sunbaby.english.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;
    private final SchoolGradeRepository schoolGradeRepository;
    private final GuardianRepository guardianRepository;
    private final StudentGuardianRepository studentGuardianRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents(String search, Long schoolGradeId, Boolean activeOnly) {
        List<Student> students = studentRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return students.stream()
                .filter(s -> activeOnly == null || !activeOnly || s.isActive())
                .filter(s -> schoolGradeId == null || (s.getSchoolGrade() != null && s.getSchoolGrade().getId().equals(schoolGradeId)))
                .filter(s -> {
                    if (search == null || search.trim().isEmpty()) return true;
                    String term = search.trim().toLowerCase();
                    return s.getStudentCode().toLowerCase().contains(term) ||
                            s.getFirstName().toLowerCase().contains(term) ||
                            s.getLastName().toLowerCase().contains(term) ||
                            (s.getPhone() != null && s.getPhone().contains(term)) ||
                            (s.getEmail() != null && s.getEmail().toLowerCase().contains(term));
                })
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        return toFullDto(student);
    }

    @Transactional
    public StudentDto createStudent(CreateStudentRequest request) {
        String studentCode;
        if (request.getStudentCode() != null && !request.getStudentCode().trim().isEmpty()) {
            studentCode = request.getStudentCode().trim().toUpperCase();
            if (studentRepository.existsByStudentCode(studentCode)) {
                throw new BadRequestException("Student code '" + studentCode + "' is already in use");
            }
        } else {
            studentCode = generateStudentCode();
        }

        SchoolGrade schoolGrade = null;
        if (request.getSchoolGradeId() != null) {
            schoolGrade = schoolGradeRepository.findById(request.getSchoolGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException("SchoolGrade", "id", request.getSchoolGradeId()));
        }

        Student student = Student.builder()
                .studentCode(studentCode)
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .schoolGrade(schoolGrade)
                .address(request.getAddress())
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .email(request.getEmail() != null ? request.getEmail().trim() : null)
                .notes(request.getNotes())
                .active(request.getActive() == null || request.getActive())
                .build();

        Student saved = studentRepository.save(student);
        log.info("Created new student: id={}, code={}, name={}", saved.getId(), saved.getStudentCode(), saved.getFullName());

        // Attach primary guardian if provided
        if (request.getPrimaryGuardian() != null && request.getPrimaryGuardian().getName() != null) {
            addGuardianToStudent(saved.getId(), request.getPrimaryGuardian());
        }

        return toFullDto(saved);
    }

    @Transactional
    public StudentDto updateStudent(Long id, UpdateStudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
            student.setFirstName(request.getFirstName().trim());
        }
        if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
            student.setLastName(request.getLastName().trim());
        }
        if (request.getDateOfBirth() != null) {
            student.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getGender() != null) {
            student.setGender(request.getGender());
        }
        if (request.getSchoolGradeId() != null) {
            SchoolGrade grade = schoolGradeRepository.findById(request.getSchoolGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException("SchoolGrade", "id", request.getSchoolGradeId()));
            student.setSchoolGrade(grade);
        }
        if (request.getAddress() != null) {
            student.setAddress(request.getAddress().trim());
        }
        if (request.getPhone() != null) {
            student.setPhone(request.getPhone().trim());
        }
        if (request.getEmail() != null) {
            student.setEmail(request.getEmail().trim());
        }
        if (request.getNotes() != null) {
            student.setNotes(request.getNotes());
        }
        if (request.getActive() != null) {
            student.setActive(request.getActive());
        }

        Student updated = studentRepository.save(student);
        log.info("Updated student: id={}, code={}", updated.getId(), updated.getStudentCode());
        return toFullDto(updated);
    }

    @Transactional
    public StudentDto toggleActive(Long id, boolean active) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        student.setActive(active);
        Student updated = studentRepository.save(student);
        log.info("Student id={} active status updated to {}", id, active);
        return toFullDto(updated);
    }

    @Transactional
    public GuardianSummaryDto addGuardianToStudent(Long studentId, CreateGuardianRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        Guardian guardian = Guardian.builder()
                .name(request.getName().trim())
                .relationship(request.getRelationship().trim())
                .phone(request.getPhone().trim())
                .email(request.getEmail() != null ? request.getEmail().trim() : null)
                .address(request.getAddress())
                .build();

        Guardian savedGuardian = guardianRepository.save(guardian);

        boolean isPrimary = Boolean.TRUE.equals(request.getIsPrimary());

        // If this is primary, clear any other primary flag for this student
        if (isPrimary) {
            studentGuardianRepository.findByStudentIdAndPrimaryTrue(studentId).ifPresent(sg -> {
                sg.setPrimary(false);
                studentGuardianRepository.save(sg);
            });
        }

        StudentGuardian link = StudentGuardian.builder()
                .student(student)
                .guardian(savedGuardian)
                .primary(isPrimary)
                .build();

        StudentGuardian savedLink = studentGuardianRepository.save(link);
        log.info("Attached guardian id={} to student id={}", savedGuardian.getId(), student.getId());

        return GuardianSummaryDto.builder()
                .linkId(savedLink.getId())
                .guardianId(savedGuardian.getId())
                .name(savedGuardian.getName())
                .relationship(savedGuardian.getRelationship())
                .phone(savedGuardian.getPhone())
                .email(savedGuardian.getEmail())
                .address(savedGuardian.getAddress())
                .primary(savedLink.isPrimary())
                .build();
    }

    @Transactional
    public void detachGuardian(Long studentId, Long guardianId) {
        StudentGuardian link = studentGuardianRepository.findByStudentIdAndGuardianId(studentId, guardianId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentGuardian link not found for student " + studentId + " and guardian " + guardianId));

        studentGuardianRepository.delete(link);
        log.info("Detached guardian id={} from student id={}", guardianId, studentId);
    }

    public synchronized String generateStudentCode() {
        int year = LocalDate.now().getYear();
        String prefix = "SB-" + year + "-";
        long count = studentRepository.count();
        long nextNum = count + 1;
        String candidate = String.format("%s%04d", prefix, nextNum);
        while (studentRepository.existsByStudentCode(candidate)) {
            nextNum++;
            candidate = String.format("%s%04d", prefix, nextNum);
        }
        return candidate;
    }

    private StudentDto toSummaryDto(Student s) {
        return StudentDto.builder()
                .id(s.getId())
                .studentCode(s.getStudentCode())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .fullName(s.getFullName())
                .dateOfBirth(s.getDateOfBirth())
                .gender(s.getGender())
                .schoolGradeId(s.getSchoolGrade() != null ? s.getSchoolGrade().getId() : null)
                .schoolGradeName(s.getSchoolGrade() != null ? s.getSchoolGrade().getName() : null)
                .address(s.getAddress())
                .phone(s.getPhone())
                .email(s.getEmail())
                .notes(s.getNotes())
                .active(s.isActive())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    private StudentDto toFullDto(Student s) {
        StudentDto dto = toSummaryDto(s);

        // Populate guardians
        List<StudentGuardian> links = studentGuardianRepository.findByStudentId(s.getId());
        List<GuardianSummaryDto> guardianDtos = links.stream().map(link -> GuardianSummaryDto.builder()
                .linkId(link.getId())
                .guardianId(link.getGuardian().getId())
                .name(link.getGuardian().getName())
                .relationship(link.getGuardian().getRelationship())
                .phone(link.getGuardian().getPhone())
                .email(link.getGuardian().getEmail())
                .address(link.getGuardian().getAddress())
                .primary(link.isPrimary())
                .build()
        ).collect(Collectors.toList());
        dto.setGuardians(guardianDtos);

        // Populate enrollments
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(s.getId());
        List<EnrollmentSummaryDto> enrollmentDtos = enrollments.stream().map(e -> {
            ClassGroup cg = e.getClassGroup();
            return EnrollmentSummaryDto.builder()
                    .id(e.getId())
                    .classGroupId(cg.getId())
                    .classGroupName(cg.getName())
                    .academicYearName(cg.getAcademicYear() != null ? cg.getAcademicYear().getName() : null)
                    .dayOfWeek(cg.getDayOfWeek())
                    .startTime(cg.getStartTime())
                    .endTime(cg.getEndTime())
                    .roomLocation(cg.getRoomLocation())
                    .enrollmentDate(e.getEnrollmentDate())
                    .status(e.getStatus())
                    .notes(e.getNotes())
                    .createdAt(e.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
        dto.setEnrollments(enrollmentDtos);

        return dto;
    }
}
