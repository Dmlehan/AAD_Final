package com.sunbaby.english.repository;

import com.sunbaby.english.entity.ClassGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassGroupRepository extends JpaRepository<ClassGroup, Long> {
    List<ClassGroup> findByAcademicYearId(Long academicYearId);
    List<ClassGroup> findByActiveTrue();
    List<ClassGroup> findBySchoolGradeId(Long schoolGradeId);
    List<ClassGroup> findByEnglishLevelId(Long englishLevelId);
    Optional<ClassGroup> findByNameAndAcademicYearId(String name, Long academicYearId);
}
