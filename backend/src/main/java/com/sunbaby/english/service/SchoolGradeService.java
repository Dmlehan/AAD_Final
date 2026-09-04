package com.sunbaby.english.service;

import com.sunbaby.english.dto.master.CreateSchoolGradeRequest;
import com.sunbaby.english.dto.master.SchoolGradeDto;
import com.sunbaby.english.dto.master.UpdateSchoolGradeRequest;
import com.sunbaby.english.entity.SchoolGrade;
import com.sunbaby.english.exception.BadRequestException;
import com.sunbaby.english.exception.ResourceNotFoundException;
import com.sunbaby.english.repository.ClassGroupRepository;
import com.sunbaby.english.repository.SchoolGradeRepository;
import com.sunbaby.english.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchoolGradeService {

    private final SchoolGradeRepository schoolGradeRepository;
    private final ClassGroupRepository classGroupRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<SchoolGradeDto> getAllSchoolGrades(Boolean activeOnly) {
        List<SchoolGrade> list;
        if (Boolean.TRUE.equals(activeOnly)) {
            list = schoolGradeRepository.findByActiveTrueOrderByDisplayOrderAsc();
        } else {
            list = schoolGradeRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder"));
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SchoolGradeDto getSchoolGradeById(Long id) {
        SchoolGrade grade = schoolGradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SchoolGrade", "id", id));
        return toDto(grade);
    }

    @Transactional
    public SchoolGradeDto createSchoolGrade(CreateSchoolGradeRequest request) {
        String trimmedName = request.getName().trim();
        if (schoolGradeRepository.findByName(trimmedName).isPresent()) {
            throw new BadRequestException("School grade with name '" + trimmedName + "' already exists");
        }

        SchoolGrade grade = SchoolGrade.builder()
                .name(trimmedName)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .active(request.getActive() == null || request.getActive())
                .build();

        SchoolGrade saved = schoolGradeRepository.save(grade);
        log.info("Created school grade: id={}, name={}", saved.getId(), saved.getName());
        return toDto(saved);
    }

    @Transactional
    public SchoolGradeDto updateSchoolGrade(Long id, UpdateSchoolGradeRequest request) {
        SchoolGrade grade = schoolGradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SchoolGrade", "id", id));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            String trimmedName = request.getName().trim();
            if (!trimmedName.equalsIgnoreCase(grade.getName()) &&
                    schoolGradeRepository.findByName(trimmedName).isPresent()) {
                throw new BadRequestException("School grade with name '" + trimmedName + "' already exists");
            }
            grade.setName(trimmedName);
        }

        if (request.getDisplayOrder() != null) {
            grade.setDisplayOrder(request.getDisplayOrder());
        }

        if (request.getActive() != null) {
            grade.setActive(request.getActive());
        }

        SchoolGrade updated = schoolGradeRepository.save(grade);
        log.info("Updated school grade: id={}, name={}", updated.getId(), updated.getName());
        return toDto(updated);
    }

    @Transactional
    public SchoolGradeDto toggleActive(Long id, boolean active) {
        SchoolGrade grade = schoolGradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SchoolGrade", "id", id));
        grade.setActive(active);
        SchoolGrade updated = schoolGradeRepository.save(grade);
        log.info("School grade id={} active status updated to {}", id, active);
        return toDto(updated);
    }

    @Transactional
    public void deleteSchoolGrade(Long id) {
        SchoolGrade grade = schoolGradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SchoolGrade", "id", id));

        if (!classGroupRepository.findBySchoolGradeId(id).isEmpty() ||
                !studentRepository.findBySchoolGradeId(id).isEmpty()) {
            throw new BadRequestException("Cannot delete school grade '" + grade.getName() +
                    "' as it is referenced by existing class groups or students. Please deactivate/archive it instead.");
        }

        schoolGradeRepository.delete(grade);
        log.info("Deleted school grade: id={}, name={}", id, grade.getName());
    }

    private SchoolGradeDto toDto(SchoolGrade grade) {
        return SchoolGradeDto.builder()
                .id(grade.getId())
                .name(grade.getName())
                .displayOrder(grade.getDisplayOrder())
                .active(grade.isActive())
                .createdAt(grade.getCreatedAt())
                .updatedAt(grade.getUpdatedAt())
                .build();
    }
}
