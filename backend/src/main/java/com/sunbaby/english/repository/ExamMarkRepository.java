package com.sunbaby.english.repository;

import com.sunbaby.english.entity.ExamMark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamMarkRepository extends JpaRepository<ExamMark, Long> {
    Optional<ExamMark> findByExamIdAndStudentId(Long examId, Long studentId);
    List<ExamMark> findByExamId(Long examId);
    List<ExamMark> findByStudentId(Long studentId);
}
