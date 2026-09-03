package com.sunbaby.english.repository;

import com.sunbaby.english.entity.EnglishLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnglishLevelRepository extends JpaRepository<EnglishLevel, Long> {
    Optional<EnglishLevel> findByName(String name);
    List<EnglishLevel> findByActiveTrueOrderByDisplayOrderAsc();
}
