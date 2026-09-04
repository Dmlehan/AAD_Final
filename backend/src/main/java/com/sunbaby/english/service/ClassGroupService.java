package com.sunbaby.english.service;

import com.sunbaby.english.dto.master.ClassGroupDto;
import com.sunbaby.english.dto.master.CreateClassGroupRequest;
import com.sunbaby.english.dto.master.UpdateClassGroupRequest;
import com.sunbaby.english.entity.AcademicYear;
import com.sunbaby.english.entity.ClassGroup;
import com.sunbaby.english.entity.EnglishLevel;
import com.sunbaby.english.entity.SchoolGrade;
import com.sunbaby.english.exception.BadRequestException;
import com.sunbaby.english.exception.ResourceNotFoundException;
import com.sunbaby.english.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassGroupService {

    private final ClassGroupRepository classGroupRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SchoolGradeRepository schoolGradeRepository;
    private final EnglishLevelRepository englishLevelRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional(readOnly = true)
    public List<ClassGroupDto> getAllClassGroups(Long academicYearId, Long schoolGradeId, Long englishLevelId, Boolean activeOnly) {
        List<ClassGroup> list = classGroupRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));

        return list.stream()
                .filter(cg -> academicYearId == null || (cg.getAcademicYear() != null && cg.getAcademicYear().getId().equals(academicYearId)))
                .filter(cg -> schoolGradeId == null || (cg.getSchoolGrade() != null && cg.getSchoolGrade().getId().equals(schoolGradeId)))
                .filter(cg -> englishLevelId == null || (cg.getEnglishLevel() != null && cg.getEnglishLevel().getId().equals(englishLevelId)))
                .filter(cg -> activeOnly == null || !activeOnly || cg.isActive())
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClassGroupDto getClassGroupById(Long id) {
        ClassGroup classGroup = classGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ClassGroup", "id", id));
        return toDto(classGroup);
    }

    @Transactional
    public ClassGroupDto createClassGroup(CreateClassGroupRequest request) {
        validateTimeRange(request.getStartTime(), request.getEndTime());

        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", request.getAcademicYearId()));

        String trimmedName = request.getName().trim();
        if (classGroupRepository.findByNameAndAcademicYearId(trimmedName, academicYear.getId()).isPresent()) {
            throw new BadRequestException("A class group named '" + trimmedName + "' already exists in academic year '" + academicYear.getName() + "'");
        }

        SchoolGrade schoolGrade = null;
        if (request.getSchoolGradeId() != null) {
            schoolGrade = schoolGradeRepository.findById(request.getSchoolGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException("SchoolGrade", "id", request.getSchoolGradeId()));
        }

        EnglishLevel englishLevel = null;
        if (request.getEnglishLevelId() != null) {
            englishLevel = englishLevelRepository.findById(request.getEnglishLevelId())
                    .orElseThrow(() -> new ResourceNotFoundException("EnglishLevel", "id", request.getEnglishLevelId()));
        }

        ClassGroup classGroup = ClassGroup.builder()
                .name(trimmedName)
                .academicYear(academicYear)
                .schoolGrade(schoolGrade)
                .englishLevel(englishLevel)
                .dayOfWeek(request.getDayOfWeek().trim())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .roomLocation(request.getRoomLocation() != null ? request.getRoomLocation().trim() : null)
                .active(request.getActive() == null || request.getActive())
                .build();

        ClassGroup saved = classGroupRepository.save(classGroup);
        log.info("Created class group: id={}, name={}, year={}", saved.getId(), saved.getName(), academicYear.getName());
        return toDto(saved);
    }

    @Transactional
    public ClassGroupDto updateClassGroup(Long id, UpdateClassGroupRequest request) {
        ClassGroup classGroup = classGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ClassGroup", "id", id));

        if (request.getAcademicYearId() != null) {
            AcademicYear newYear = academicYearRepository.findById(request.getAcademicYearId())
                    .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", request.getAcademicYearId()));
            classGroup.setAcademicYear(newYear);
        }

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            String trimmedName = request.getName().trim();
            Long currentYearId = classGroup.getAcademicYear().getId();
            classGroupRepository.findByNameAndAcademicYearId(trimmedName, currentYearId).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new BadRequestException("A class group named '" + trimmedName + "' already exists in academic year '" + classGroup.getAcademicYear().getName() + "'");
                }
            });
            classGroup.setName(trimmedName);
        }

        if (request.getSchoolGradeId() != null) {
            SchoolGrade grade = schoolGradeRepository.findById(request.getSchoolGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException("SchoolGrade", "id", request.getSchoolGradeId()));
            classGroup.setSchoolGrade(grade);
        }

        if (request.getEnglishLevelId() != null) {
            EnglishLevel level = englishLevelRepository.findById(request.getEnglishLevelId())
                    .orElseThrow(() -> new ResourceNotFoundException("EnglishLevel", "id", request.getEnglishLevelId()));
            classGroup.setEnglishLevel(level);
        }

        LocalTime newStart = request.getStartTime() != null ? request.getStartTime() : classGroup.getStartTime();
        LocalTime newEnd = request.getEndTime() != null ? request.getEndTime() : classGroup.getEndTime();
        validateTimeRange(newStart, newEnd);
        classGroup.setStartTime(newStart);
        classGroup.setEndTime(newEnd);

        if (request.getDayOfWeek() != null && !request.getDayOfWeek().trim().isEmpty()) {
            classGroup.setDayOfWeek(request.getDayOfWeek().trim());
        }

        if (request.getRoomLocation() != null) {
            classGroup.setRoomLocation(request.getRoomLocation().trim());
        }

        if (request.getActive() != null) {
            classGroup.setActive(request.getActive());
        }

        ClassGroup updated = classGroupRepository.save(classGroup);
        log.info("Updated class group: id={}, name={}", updated.getId(), updated.getName());
        return toDto(updated);
    }

    @Transactional
    public ClassGroupDto toggleActive(Long id, boolean active) {
        ClassGroup classGroup = classGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ClassGroup", "id", id));
        classGroup.setActive(active);
        ClassGroup updated = classGroupRepository.save(classGroup);
        log.info("Class group id={} active status updated to {}", id, active);
        return toDto(updated);
    }

    @Transactional
    public void deleteClassGroup(Long id) {
        ClassGroup classGroup = classGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ClassGroup", "id", id));

        if (!enrollmentRepository.findByClassGroupId(id).isEmpty()) {
            throw new BadRequestException("Cannot delete class group '" + classGroup.getName() +
                    "' as it has existing student enrollments. Please deactivate it instead.");
        }

        classGroupRepository.delete(classGroup);
        log.info("Deleted class group: id={}, name={}", id, classGroup.getName());
    }

    private void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (!endTime.isAfter(startTime)) {
            throw new BadRequestException("End time (" + endTime + ") must be after start time (" + startTime + ")");
        }
    }

    private ClassGroupDto toDto(ClassGroup cg) {
        return ClassGroupDto.builder()
                .id(cg.getId())
                .name(cg.getName())
                .academicYearId(cg.getAcademicYear() != null ? cg.getAcademicYear().getId() : null)
                .academicYearName(cg.getAcademicYear() != null ? cg.getAcademicYear().getName() : null)
                .schoolGradeId(cg.getSchoolGrade() != null ? cg.getSchoolGrade().getId() : null)
                .schoolGradeName(cg.getSchoolGrade() != null ? cg.getSchoolGrade().getName() : null)
                .englishLevelId(cg.getEnglishLevel() != null ? cg.getEnglishLevel().getId() : null)
                .englishLevelName(cg.getEnglishLevel() != null ? cg.getEnglishLevel().getName() : null)
                .dayOfWeek(cg.getDayOfWeek())
                .startTime(cg.getStartTime())
                .endTime(cg.getEndTime())
                .roomLocation(cg.getRoomLocation())
                .active(cg.isActive())
                .createdAt(cg.getCreatedAt())
                .updatedAt(cg.getUpdatedAt())
                .build();
    }
}
