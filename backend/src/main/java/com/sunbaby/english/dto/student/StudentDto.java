package com.sunbaby.english.dto.student;

import com.sunbaby.english.dto.enrollment.EnrollmentSummaryDto;
import com.sunbaby.english.entity.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {
    private Long id;
    private String studentCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private Long schoolGradeId;
    private String schoolGradeName;
    private String address;
    private String phone;
    private String email;
    private String notes;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<GuardianSummaryDto> guardians = new ArrayList<>();

    @Builder.Default
    private List<EnrollmentSummaryDto> enrollments = new ArrayList<>();
}
