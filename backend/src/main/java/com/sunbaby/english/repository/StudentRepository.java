package com.sunbaby.english.repository;

import com.sunbaby.english.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentCode(String studentCode);
    boolean existsByStudentCode(String studentCode);
    List<Student> findByActiveTrue();
    List<Student> findBySchoolGradeId(Long schoolGradeId);
}
