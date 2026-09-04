package com.sunbaby.english.service;

import com.sunbaby.english.dto.master.AcademicYearDto;
import com.sunbaby.english.dto.master.CreateAcademicYearRequest;
import com.sunbaby.english.dto.master.UpdateAcademicYearRequest;
import com.sunbaby.english.entity.AcademicYear;
import com.sunbaby.english.exception.BadRequestException;
import com.sunbaby.english.exception.ResourceNotFoundException;
import com.sunbaby.english.repository.AcademicYearRepository;
import com.sunbaby.english.repository.ClassGroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AcademicYearService {

    private final AcademicYearRepository academicYearRepository;
    private final ClassGroupRepository classGroupRepository;

    @Transactional(readOnly = true)
    public List<AcademicYearDto> getAllAcademicYears(Boolean activeOnly) {
        List<AcademicYear> list;
        if (Boolean.TRUE.equals(activeOnly)) {
            list = academicYearRepository.findByActiveTrue();
        } else {
            list = academicYearRepository.findAll(Sort.by(Sort.Direction.DESC, "startDate"));
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AcademicYearDto getAcademicYearById(Long id) {
        AcademicYear year = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", id));
        return toDto(year);
    }

    @Transactional
    public AcademicYearDto createAcademicYear(CreateAcademicYearRequest request) {
        validateDateRange(request.getStartDate(), request.getEndDate());

        if (academicYearRepository.findByName(request.getName().trim()).isPresent()) {
            throw new BadRequestException("Academic year with name '" + request.getName().trim() + "' already exists");
        }

        AcademicYear year = AcademicYear.builder()
                .name(request.getName().trim())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .active(request.getActive() == null || request.getActive())
                .build();

        AcademicYear saved = academicYearRepository.save(year);
        log.info("Created academic year: id={}, name={}", saved.getId(), saved.getName());
        return toDto(saved);
    }

    @Transactional
    public AcademicYearDto updateAcademicYear(Long id, UpdateAcademicYearRequest request) {
        AcademicYear year = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", id));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            String trimmedName = request.getName().trim();
            if (!trimmedName.equalsIgnoreCase(year.getName()) &&
                    academicYearRepository.findByName(trimmedName).isPresent()) {
                throw new BadRequestException("Academic year with name '" + trimmedName + "' already exists");
            }
            year.setName(trimmedName);
        }

        LocalDate newStart = request.getStartDate() != null ? request.getStartDate() : year.getStartDate();
        LocalDate newEnd = request.getEndDate() != null ? request.getEndDate() : year.getEndDate();
        validateDateRange(newStart, newEnd);

        year.setStartDate(newStart);
        year.setEndDate(newEnd);

        if (request.getActive() != null) {
            year.setActive(request.getActive());
        }

        AcademicYear updated = academicYearRepository.save(year);
        log.info("Updated academic year: id={}, name={}", updated.getId(), updated.getName());
        return toDto(updated);
    }

    @Transactional
    public AcademicYearDto toggleActive(Long id, boolean active) {
        AcademicYear year = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", id));
        year.setActive(active);
        AcademicYear updated = academicYearRepository.save(year);
        log.info("Academic year id={} active status updated to {}", id, active);
        return toDto(updated);
    }

    @Transactional
    public void deleteAcademicYear(Long id) {
        AcademicYear year = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", id));

        if (!classGroupRepository.findByAcademicYearId(id).isEmpty()) {
            throw new BadRequestException("Cannot delete academic year '" + year.getName() +
                    "' as it is referenced by existing class groups. Please deactivate/archive it instead.");
        }

        academicYearRepository.delete(year);
        log.info("Deleted academic year: id={}, name={}", id, year.getName());
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new BadRequestException("End date (" + endDate + ") must be on or after start date (" + startDate + ")");
        }
    }

    private AcademicYearDto toDto(AcademicYear year) {
        return AcademicYearDto.builder()
                .id(year.getId())
                .name(year.getName())
                .startDate(year.getStartDate())
                .endDate(year.getEndDate())
                .active(year.isActive())
                .createdAt(year.getCreatedAt())
                .updatedAt(year.getUpdatedAt())
                .build();
    }
}
