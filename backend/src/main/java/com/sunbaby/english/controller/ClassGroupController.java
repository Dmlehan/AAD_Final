package com.sunbaby.english.controller;

import com.sunbaby.english.dto.ApiResponse;
import com.sunbaby.english.dto.master.ClassGroupDto;
import com.sunbaby.english.dto.master.CreateClassGroupRequest;
import com.sunbaby.english.dto.master.UpdateClassGroupRequest;
import com.sunbaby.english.service.ClassGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/class-groups")
@RequiredArgsConstructor
public class ClassGroupController {

    private final ClassGroupService classGroupService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<List<ClassGroupDto>>> getAllClassGroups(
            @RequestParam(required = false) Long academicYearId,
            @RequestParam(required = false) Long schoolGradeId,
            @RequestParam(required = false) Long englishLevelId,
            @RequestParam(required = false) Boolean activeOnly) {
        List<ClassGroupDto> list = classGroupService.getAllClassGroups(academicYearId, schoolGradeId, englishLevelId, activeOnly);
        return ResponseEntity.ok(ApiResponse.success("Class groups retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<ClassGroupDto>> getClassGroupById(@PathVariable Long id) {
        ClassGroupDto dto = classGroupService.getClassGroupById(id);
        return ResponseEntity.ok(ApiResponse.success("Class group retrieved successfully", dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ClassGroupDto>> createClassGroup(
            @Valid @RequestBody CreateClassGroupRequest request) {
        ClassGroupDto created = classGroupService.createClassGroup(request);
        return new ResponseEntity<>(ApiResponse.success("Class group created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ClassGroupDto>> updateClassGroup(
            @PathVariable Long id,
            @Valid @RequestBody UpdateClassGroupRequest request) {
        ClassGroupDto updated = classGroupService.updateClassGroup(id, request);
        return ResponseEntity.ok(ApiResponse.success("Class group updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ClassGroupDto>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active) {
        ClassGroupDto updated = classGroupService.toggleActive(id, active);
        return ResponseEntity.ok(ApiResponse.success("Class group status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteClassGroup(@PathVariable Long id) {
        classGroupService.deleteClassGroup(id);
        return ResponseEntity.ok(ApiResponse.success("Class group deleted successfully", null));
    }
}
