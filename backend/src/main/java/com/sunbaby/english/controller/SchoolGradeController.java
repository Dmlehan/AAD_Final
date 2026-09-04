package com.sunbaby.english.controller;

import com.sunbaby.english.dto.ApiResponse;
import com.sunbaby.english.dto.master.CreateSchoolGradeRequest;
import com.sunbaby.english.dto.master.SchoolGradeDto;
import com.sunbaby.english.dto.master.UpdateSchoolGradeRequest;
import com.sunbaby.english.service.SchoolGradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/school-grades")
@RequiredArgsConstructor
public class SchoolGradeController {

    private final SchoolGradeService schoolGradeService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<List<SchoolGradeDto>>> getAllSchoolGrades(
            @RequestParam(required = false) Boolean activeOnly) {
        List<SchoolGradeDto> list = schoolGradeService.getAllSchoolGrades(activeOnly);
        return ResponseEntity.ok(ApiResponse.success("School grades retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<SchoolGradeDto>> getSchoolGradeById(@PathVariable Long id) {
        SchoolGradeDto dto = schoolGradeService.getSchoolGradeById(id);
        return ResponseEntity.ok(ApiResponse.success("School grade retrieved successfully", dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<SchoolGradeDto>> createSchoolGrade(
            @Valid @RequestBody CreateSchoolGradeRequest request) {
        SchoolGradeDto created = schoolGradeService.createSchoolGrade(request);
        return new ResponseEntity<>(ApiResponse.success("School grade created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<SchoolGradeDto>> updateSchoolGrade(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSchoolGradeRequest request) {
        SchoolGradeDto updated = schoolGradeService.updateSchoolGrade(id, request);
        return ResponseEntity.ok(ApiResponse.success("School grade updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<SchoolGradeDto>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active) {
        SchoolGradeDto updated = schoolGradeService.toggleActive(id, active);
        return ResponseEntity.ok(ApiResponse.success("School grade status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSchoolGrade(@PathVariable Long id) {
        schoolGradeService.deleteSchoolGrade(id);
        return ResponseEntity.ok(ApiResponse.success("School grade deleted successfully", null));
    }
}
