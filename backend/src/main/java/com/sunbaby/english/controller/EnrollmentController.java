package com.sunbaby.english.controller;

import com.sunbaby.english.dto.ApiResponse;
import com.sunbaby.english.dto.enrollment.CreateEnrollmentRequest;
import com.sunbaby.english.dto.enrollment.EnrollmentDto;
import com.sunbaby.english.dto.enrollment.UpdateEnrollmentStatusRequest;
import com.sunbaby.english.entity.enums.EnrollmentStatus;
import com.sunbaby.english.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<List<EnrollmentDto>>> getAllEnrollments(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long classGroupId,
            @RequestParam(required = false) EnrollmentStatus status) {
        List<EnrollmentDto> list = enrollmentService.getAllEnrollments(studentId, classGroupId, status);
        return ResponseEntity.ok(ApiResponse.success("Enrollments retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<EnrollmentDto>> getEnrollmentById(@PathVariable Long id) {
        EnrollmentDto dto = enrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(ApiResponse.success("Enrollment retrieved successfully", dto));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<EnrollmentDto>> enrollStudent(
            @Valid @RequestBody CreateEnrollmentRequest request) {
        EnrollmentDto enrolled = enrollmentService.enrollStudent(request);
        return new ResponseEntity<>(ApiResponse.success("Student enrolled successfully", enrolled), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<EnrollmentDto>> updateEnrollmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEnrollmentStatusRequest request) {
        EnrollmentDto updated = enrollmentService.updateEnrollmentStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Enrollment status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.ok(ApiResponse.success("Enrollment deleted successfully", null));
    }
}
