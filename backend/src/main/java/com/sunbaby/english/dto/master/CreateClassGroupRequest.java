package com.sunbaby.english.dto.master;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateClassGroupRequest {

    @NotBlank(message = "Class name is required")
    @Size(max = 100, message = "Class name cannot exceed 100 characters")
    private String name;

    @NotNull(message = "Academic year is required")
    private Long academicYearId;

    private Long schoolGradeId;

    private Long englishLevelId;

    @NotBlank(message = "Day of week is required")
    @Size(max = 20, message = "Day of week cannot exceed 20 characters")
    private String dayOfWeek;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Size(max = 50, message = "Room location cannot exceed 50 characters")
    private String roomLocation;

    @Builder.Default
    private Boolean active = true;
}
