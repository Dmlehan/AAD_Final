package com.sunbaby.english.repository;

import com.sunbaby.english.entity.AttendanceRecord;
import com.sunbaby.english.entity.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    Optional<AttendanceRecord> findByEnrollmentIdAndAttendanceDate(Long enrollmentId, LocalDate attendanceDate);
    List<AttendanceRecord> findByEnrollmentId(Long enrollmentId);
    List<AttendanceRecord> findByAttendanceDate(LocalDate attendanceDate);
    List<AttendanceRecord> findByEnrollmentClassGroupIdAndAttendanceDate(Long classGroupId, LocalDate attendanceDate);
    long countByEnrollmentIdAndStatus(Long enrollmentId, AttendanceStatus status);
}
