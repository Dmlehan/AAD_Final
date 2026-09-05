package com.sunbaby.english.dto.guardian;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateGuardianRequest {

    @NotBlank(message = "Guardian name is required")
    @Size(max = 100, message = "Guardian name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Relationship is required")
    @Size(max = 50, message = "Relationship cannot exceed 50 characters")
    private String relationship;

    @NotBlank(message = "Phone number is required")
    @Size(max = 30, message = "Phone cannot exceed 30 characters")
    private String phone;

    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    private String address;

    @Builder.Default
    private Boolean isPrimary = false;
}
