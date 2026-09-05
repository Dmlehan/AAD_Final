package com.sunbaby.english.dto.enrollment;

import com.sunbaby.english.entity.enums.EnrollmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEnrollmentStatusRequest {

    @NotNull(message = "Enrollment status is required")
    private EnrollmentStatus status;

    private String notes;
}
