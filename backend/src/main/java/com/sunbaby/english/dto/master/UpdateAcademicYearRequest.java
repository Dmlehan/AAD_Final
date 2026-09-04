package com.sunbaby.english.dto.master;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAcademicYearRequest {

    @Size(max = 50, message = "Name cannot exceed 50 characters")
    private String name;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean active;
}
