package com.sunbaby.english.repository;

import com.sunbaby.english.entity.Guardian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuardianRepository extends JpaRepository<Guardian, Long> {
    List<Guardian> findByPhone(String phone);
    List<Guardian> findByNameContainingIgnoreCase(String name);
}
