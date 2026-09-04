package com.sunbaby.english.dto.master;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassGroupDto {
    private Long id;
    private String name;
    private Long academicYearId;
    private String academicYearName;
    private Long schoolGradeId;
    private String schoolGradeName;
    private Long englishLevelId;
    private String englishLevelName;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String roomLocation;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
