package com.sunbaby.english.dto.master;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEnglishLevelRequest {

    @NotBlank(message = "English level name is required")
    @Size(max = 50, message = "Name cannot exceed 50 characters")
    private String name;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @NotNull(message = "Display order is required")
    @Builder.Default
    private Integer displayOrder = 0;

    @Builder.Default
    private Boolean active = true;
}
