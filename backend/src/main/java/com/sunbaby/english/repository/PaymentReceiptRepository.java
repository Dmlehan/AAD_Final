package com.sunbaby.english.repository;

import com.sunbaby.english.entity.PaymentReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentReceiptRepository extends JpaRepository<PaymentReceipt, Long> {
    List<PaymentReceipt> findByPaymentId(Long paymentId);
    Optional<PaymentReceipt> findByStoredFileName(String storedFileName);
}
