package com.sunbaby.english.service;

import com.sunbaby.english.dto.master.CreateEnglishLevelRequest;
import com.sunbaby.english.dto.master.EnglishLevelDto;
import com.sunbaby.english.dto.master.UpdateEnglishLevelRequest;
import com.sunbaby.english.entity.EnglishLevel;
import com.sunbaby.english.exception.BadRequestException;
import com.sunbaby.english.exception.ResourceNotFoundException;
import com.sunbaby.english.repository.ClassGroupRepository;
import com.sunbaby.english.repository.EnglishLevelRepository;
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
public class EnglishLevelService {

    private final EnglishLevelRepository englishLevelRepository;
    private final ClassGroupRepository classGroupRepository;

    @Transactional(readOnly = true)
    public List<EnglishLevelDto> getAllEnglishLevels(Boolean activeOnly) {
        List<EnglishLevel> list;
        if (Boolean.TRUE.equals(activeOnly)) {
            list = englishLevelRepository.findByActiveTrueOrderByDisplayOrderAsc();
        } else {
            list = englishLevelRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder"));
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EnglishLevelDto getEnglishLevelById(Long id) {
        EnglishLevel level = englishLevelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EnglishLevel", "id", id));
        return toDto(level);
    }

    @Transactional
    public EnglishLevelDto createEnglishLevel(CreateEnglishLevelRequest request) {
        String trimmedName = request.getName().trim();
        if (englishLevelRepository.findByName(trimmedName).isPresent()) {
            throw new BadRequestException("English level with name '" + trimmedName + "' already exists");
        }

        EnglishLevel level = EnglishLevel.builder()
                .name(trimmedName)
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .active(request.getActive() == null || request.getActive())
                .build();

        EnglishLevel saved = englishLevelRepository.save(level);
        log.info("Created English level: id={}, name={}", saved.getId(), saved.getName());
        return toDto(saved);
    }

    @Transactional
    public EnglishLevelDto updateEnglishLevel(Long id, UpdateEnglishLevelRequest request) {
        EnglishLevel level = englishLevelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EnglishLevel", "id", id));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            String trimmedName = request.getName().trim();
            if (!trimmedName.equalsIgnoreCase(level.getName()) &&
                    englishLevelRepository.findByName(trimmedName).isPresent()) {
                throw new BadRequestException("English level with name '" + trimmedName + "' already exists");
            }
            level.setName(trimmedName);
        }

        if (request.getDescription() != null) {
            level.setDescription(request.getDescription());
        }

        if (request.getDisplayOrder() != null) {
            level.setDisplayOrder(request.getDisplayOrder());
        }

        if (request.getActive() != null) {
            level.setActive(request.getActive());
        }

        EnglishLevel updated = englishLevelRepository.save(level);
        log.info("Updated English level: id={}, name={}", updated.getId(), updated.getName());
        return toDto(updated);
    }

    @Transactional
    public EnglishLevelDto toggleActive(Long id, boolean active) {
        EnglishLevel level = englishLevelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EnglishLevel", "id", id));
        level.setActive(active);
        EnglishLevel updated = englishLevelRepository.save(level);
        log.info("English level id={} active status updated to {}", id, active);
        return toDto(updated);
    }

    @Transactional
    public void deleteEnglishLevel(Long id) {
        EnglishLevel level = englishLevelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EnglishLevel", "id", id));

        if (!classGroupRepository.findByEnglishLevelId(id).isEmpty()) {
            throw new BadRequestException("Cannot delete English level '" + level.getName() +
                    "' as it is referenced by existing class groups. Please deactivate/archive it instead.");
        }

        englishLevelRepository.delete(level);
        log.info("Deleted English level: id={}, name={}", id, level.getName());
    }

    private EnglishLevelDto toDto(EnglishLevel level) {
        return EnglishLevelDto.builder()
                .id(level.getId())
                .name(level.getName())
                .description(level.getDescription())
                .displayOrder(level.getDisplayOrder())
                .active(level.isActive())
                .createdAt(level.getCreatedAt())
                .updatedAt(level.getUpdatedAt())
                .build();
    }
}
