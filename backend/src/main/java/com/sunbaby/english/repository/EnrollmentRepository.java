package com.sunbaby.english.repository;

import com.sunbaby.english.entity.Enrollment;
import com.sunbaby.english.entity.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByStudentIdAndClassGroupId(Long studentId, Long classGroupId);
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findByClassGroupId(Long classGroupId);
    List<Enrollment> findByClassGroupIdAndStatus(Long classGroupId, EnrollmentStatus status);
}
