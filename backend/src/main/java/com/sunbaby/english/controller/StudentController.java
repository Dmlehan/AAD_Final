package com.sunbaby.english.controller;

import com.sunbaby.english.dto.ApiResponse;
import com.sunbaby.english.dto.guardian.CreateGuardianRequest;
import com.sunbaby.english.dto.student.CreateStudentRequest;
import com.sunbaby.english.dto.student.GuardianSummaryDto;
import com.sunbaby.english.dto.student.StudentDto;
import com.sunbaby.english.dto.student.UpdateStudentRequest;
import com.sunbaby.english.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<List<StudentDto>>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long schoolGradeId,
            @RequestParam(required = false) Boolean activeOnly) {
        List<StudentDto> students = studentService.getAllStudents(search, schoolGradeId, activeOnly);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(@PathVariable Long id) {
        StudentDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student profile retrieved successfully", student));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<StudentDto>> createStudent(@Valid @RequestBody CreateStudentRequest request) {
        StudentDto created = studentService.createStudent(request);
        return new ResponseEntity<>(ApiResponse.success("Student registered successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStudentRequest request) {
        StudentDto updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<StudentDto>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active) {
        StudentDto updated = studentService.toggleActive(id, active);
        return ResponseEntity.ok(ApiResponse.success("Student active status updated successfully", updated));
    }

    @PostMapping("/{id}/guardians")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<GuardianSummaryDto>> addGuardian(
            @PathVariable Long id,
            @Valid @RequestBody CreateGuardianRequest request) {
        GuardianSummaryDto linked = studentService.addGuardianToStudent(id, request);
        return new ResponseEntity<>(ApiResponse.success("Guardian attached successfully", linked), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}/guardians/{guardianId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<Void>> detachGuardian(
            @PathVariable Long id,
            @PathVariable Long guardianId) {
        studentService.detachGuardian(id, guardianId);
        return ResponseEntity.ok(ApiResponse.success("Guardian detached successfully", null));
    }
}
