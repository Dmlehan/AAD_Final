package com.sunbaby.english.dto.enrollment;

import com.sunbaby.english.entity.enums.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentSummaryDto {
    private Long id;
    private Long classGroupId;
    private String classGroupName;
    private String academicYearName;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String roomLocation;
    private LocalDate enrollmentDate;
    private EnrollmentStatus status;
    private String notes;
    private LocalDateTime createdAt;
}
