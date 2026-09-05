package com.sunbaby.english.service;

import com.sunbaby.english.dto.enrollment.CreateEnrollmentRequest;
import com.sunbaby.english.dto.enrollment.EnrollmentDto;
import com.sunbaby.english.dto.enrollment.UpdateEnrollmentStatusRequest;
import com.sunbaby.english.entity.ClassGroup;
import com.sunbaby.english.entity.Enrollment;
import com.sunbaby.english.entity.Student;
import com.sunbaby.english.entity.enums.EnrollmentStatus;
import com.sunbaby.english.exception.BadRequestException;
import com.sunbaby.english.exception.ResourceNotFoundException;
import com.sunbaby.english.repository.ClassGroupRepository;
import com.sunbaby.english.repository.EnrollmentRepository;
import com.sunbaby.english.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final ClassGroupRepository classGroupRepository;

    @Transactional(readOnly = true)
    public List<EnrollmentDto> getAllEnrollments(Long studentId, Long classGroupId, EnrollmentStatus status) {
        List<Enrollment> list = enrollmentRepository.findAll(Sort.by(Sort.Direction.DESC, "enrollmentDate"));

        return list.stream()
                .filter(e -> studentId == null || e.getStudent().getId().equals(studentId))
                .filter(e -> classGroupId == null || e.getClassGroup().getId().equals(classGroupId))
                .filter(e -> status == null || e.getStatus() == status)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EnrollmentDto getEnrollmentById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", id));
        return toDto(enrollment);
    }

    @Transactional
    public EnrollmentDto enrollStudent(CreateEnrollmentRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        if (!student.isActive()) {
            throw new BadRequestException("Cannot enroll inactive student '" + student.getFullName() + "'");
        }

        ClassGroup classGroup = classGroupRepository.findById(request.getClassGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("ClassGroup", "id", request.getClassGroupId()));

        if (!classGroup.isActive()) {
            throw new BadRequestException("Cannot enroll in inactive class group '" + classGroup.getName() + "'");
        }

        // Check for existing active enrollment in this same class group
        Optional<Enrollment> existing = enrollmentRepository.findByStudentIdAndClassGroupId(student.getId(), classGroup.getId());
        if (existing.isPresent()) {
            Enrollment prev = existing.get();
            if (prev.getStatus() == EnrollmentStatus.ACTIVE) {
                throw new BadRequestException("Student '" + student.getFullName() +
                        "' is already actively enrolled in class '" + classGroup.getName() + "'");
            } else {
                // Reactivate previous dropped/completed enrollment record
                prev.setStatus(EnrollmentStatus.ACTIVE);
                prev.setEnrollmentDate(request.getEnrollmentDate() != null ? request.getEnrollmentDate() : LocalDate.now());
                if (request.getNotes() != null) {
                    prev.setNotes(request.getNotes());
                }
                Enrollment reactivated = enrollmentRepository.save(prev);
                log.info("Reactivated enrollment: id={}, student={}, class={}", reactivated.getId(), student.getStudentCode(), classGroup.getName());
                return toDto(reactivated);
            }
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .classGroup(classGroup)
                .enrollmentDate(request.getEnrollmentDate() != null ? request.getEnrollmentDate() : LocalDate.now())
                .status(request.getStatus() != null ? request.getStatus() : EnrollmentStatus.ACTIVE)
                .notes(request.getNotes())
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        log.info("Created enrollment: id={}, student={}, class={}", saved.getId(), student.getStudentCode(), classGroup.getName());
        return toDto(saved);
    }

    @Transactional
    public EnrollmentDto updateEnrollmentStatus(Long id, UpdateEnrollmentStatusRequest request) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", id));

        enrollment.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            enrollment.setNotes(request.getNotes());
        }

        Enrollment updated = enrollmentRepository.save(enrollment);
        log.info("Updated enrollment id={} status to {}", id, request.getStatus());
        return toDto(updated);
    }

    @Transactional
    public void deleteEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", id));

        enrollmentRepository.delete(enrollment);
        log.info("Deleted enrollment id={}", id);
    }

    private EnrollmentDto toDto(Enrollment e) {
        Student s = e.getStudent();
        ClassGroup cg = e.getClassGroup();

        return EnrollmentDto.builder()
                .id(e.getId())
                .studentId(s.getId())
                .studentCode(s.getStudentCode())
                .studentName(s.getFullName())
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
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
