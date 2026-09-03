package com.sunbaby.english.repository;

import com.sunbaby.english.entity.Payment;
import com.sunbaby.english.entity.enums.PaymentMethod;
import com.sunbaby.english.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentId(Long studentId);
    List<Payment> findByEnrollmentId(Long enrollmentId);
    List<Payment> findByPaymentPeriod(String paymentPeriod);
    List<Payment> findByStatus(PaymentStatus status);
    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);
    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);
    List<Payment> findByStudentIdAndPaymentPeriod(Long studentId, String paymentPeriod);
}
