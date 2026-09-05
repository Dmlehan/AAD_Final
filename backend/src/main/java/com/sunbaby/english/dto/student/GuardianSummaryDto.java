package com.sunbaby.english.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuardianSummaryDto {
    private Long linkId;
    private Long guardianId;
    private String name;
    private String relationship;
    private String phone;
    private String email;
    private String address;
    private boolean primary;
}
