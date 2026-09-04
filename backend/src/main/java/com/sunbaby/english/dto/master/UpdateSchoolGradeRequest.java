package com.sunbaby.english.dto.master;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSchoolGradeRequest {

    @Size(max = 50, message = "Grade name cannot exceed 50 characters")
    private String name;

    private Integer displayOrder;

    private Boolean active;
}
