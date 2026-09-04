package com.sunbaby.english.controller;

import com.sunbaby.english.dto.ApiResponse;
import com.sunbaby.english.dto.master.AcademicYearDto;
import com.sunbaby.english.dto.master.CreateAcademicYearRequest;
import com.sunbaby.english.dto.master.UpdateAcademicYearRequest;
import com.sunbaby.english.service.AcademicYearService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/academic-years")
@RequiredArgsConstructor
public class AcademicYearController {

    private final AcademicYearService academicYearService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<List<AcademicYearDto>>> getAllAcademicYears(
            @RequestParam(required = false) Boolean activeOnly) {
        List<AcademicYearDto> list = academicYearService.getAllAcademicYears(activeOnly);
        return ResponseEntity.ok(ApiResponse.success("Academic years retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<AcademicYearDto>> getAcademicYearById(@PathVariable Long id) {
        AcademicYearDto dto = academicYearService.getAcademicYearById(id);
        return ResponseEntity.ok(ApiResponse.success("Academic year retrieved successfully", dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AcademicYearDto>> createAcademicYear(
            @Valid @RequestBody CreateAcademicYearRequest request) {
        AcademicYearDto created = academicYearService.createAcademicYear(request);
        return new ResponseEntity<>(ApiResponse.success("Academic year created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AcademicYearDto>> updateAcademicYear(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAcademicYearRequest request) {
        AcademicYearDto updated = academicYearService.updateAcademicYear(id, request);
        return ResponseEntity.ok(ApiResponse.success("Academic year updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AcademicYearDto>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active) {
        AcademicYearDto updated = academicYearService.toggleActive(id, active);
        return ResponseEntity.ok(ApiResponse.success("Academic year status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAcademicYear(@PathVariable Long id) {
        academicYearService.deleteAcademicYear(id);
        return ResponseEntity.ok(ApiResponse.success("Academic year deleted successfully", null));
    }
}
