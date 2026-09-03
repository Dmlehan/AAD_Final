package com.sunbaby.english.repository;

import com.sunbaby.english.entity.SchoolGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolGradeRepository extends JpaRepository<SchoolGrade, Long> {
    Optional<SchoolGrade> findByName(String name);
    List<SchoolGrade> findByActiveTrueOrderByDisplayOrderAsc();
}
