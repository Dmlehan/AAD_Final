package com.sunbaby.english.dto.master;

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
public class UpdateClassGroupRequest {

    @Size(max = 100, message = "Class name cannot exceed 100 characters")
    private String name;

    private Long academicYearId;

    private Long schoolGradeId;

    private Long englishLevelId;

    @Size(max = 20, message = "Day of week cannot exceed 20 characters")
    private String dayOfWeek;

    private LocalTime startTime;

    private LocalTime endTime;

    @Size(max = 50, message = "Room location cannot exceed 50 characters")
    private String roomLocation;

    private Boolean active;
}
