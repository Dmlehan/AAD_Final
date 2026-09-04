package com.sunbaby.english.controller;

import com.sunbaby.english.dto.ApiResponse;
import com.sunbaby.english.dto.master.CreateEnglishLevelRequest;
import com.sunbaby.english.dto.master.EnglishLevelDto;
import com.sunbaby.english.dto.master.UpdateEnglishLevelRequest;
import com.sunbaby.english.service.EnglishLevelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/english-levels")
@RequiredArgsConstructor
public class EnglishLevelController {

    private final EnglishLevelService englishLevelService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<List<EnglishLevelDto>>> getAllEnglishLevels(
            @RequestParam(required = false) Boolean activeOnly) {
        List<EnglishLevelDto> list = englishLevelService.getAllEnglishLevels(activeOnly);
        return ResponseEntity.ok(ApiResponse.success("English levels retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<EnglishLevelDto>> getEnglishLevelById(@PathVariable Long id) {
        EnglishLevelDto dto = englishLevelService.getEnglishLevelById(id);
        return ResponseEntity.ok(ApiResponse.success("English level retrieved successfully", dto));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<EnglishLevelDto>> createEnglishLevel(
            @Valid @RequestBody CreateEnglishLevelRequest request) {
        EnglishLevelDto created = englishLevelService.createEnglishLevel(request);
        return new ResponseEntity<>(ApiResponse.success("English level created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<EnglishLevelDto>> updateEnglishLevel(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEnglishLevelRequest request) {
        EnglishLevelDto updated = englishLevelService.updateEnglishLevel(id, request);
        return ResponseEntity.ok(ApiResponse.success("English level updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<EnglishLevelDto>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active) {
        EnglishLevelDto updated = englishLevelService.toggleActive(id, active);
        return ResponseEntity.ok(ApiResponse.success("English level status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEnglishLevel(@PathVariable Long id) {
        englishLevelService.deleteEnglishLevel(id);
        return ResponseEntity.ok(ApiResponse.success("English level deleted successfully", null));
    }
}
