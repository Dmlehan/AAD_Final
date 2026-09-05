package com.sunbaby.english.dto.enrollment;

import com.sunbaby.english.entity.enums.EnrollmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEnrollmentRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Class Group ID is required")
    private Long classGroupId;

    private LocalDate enrollmentDate;

    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;

    private String notes;
}
