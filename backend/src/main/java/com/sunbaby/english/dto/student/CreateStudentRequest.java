package com.sunbaby.english.dto.student;

import com.sunbaby.english.dto.guardian.CreateGuardianRequest;
import com.sunbaby.english.entity.enums.Gender;
import jakarta.validation.constraints.NotBlank;
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
public class CreateStudentRequest {

    @Size(max = 30, message = "Student code cannot exceed 30 characters")
    private String studentCode;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    private LocalDate dateOfBirth;

    private Gender gender;

    private Long schoolGradeId;

    private String address;

    @Size(max = 30, message = "Phone cannot exceed 30 characters")
    private String phone;

    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    private String notes;

    @Builder.Default
    private Boolean active = true;

    // Optional embedded guardian to link upon creation
    private CreateGuardianRequest primaryGuardian;
}
