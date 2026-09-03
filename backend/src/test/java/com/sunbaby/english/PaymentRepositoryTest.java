package com.sunbaby.english;

import com.sunbaby.english.entity.Payment;
import com.sunbaby.english.entity.PaymentReceipt;
import com.sunbaby.english.entity.Student;
import com.sunbaby.english.entity.User;
import com.sunbaby.english.entity.enums.PaymentMethod;
import com.sunbaby.english.entity.enums.PaymentStatus;
import com.sunbaby.english.entity.enums.UserRole;
import com.sunbaby.english.repository.PaymentReceiptRepository;
import com.sunbaby.english.repository.PaymentRepository;
import com.sunbaby.english.repository.StudentRepository;
import com.sunbaby.english.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PaymentRepositoryTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentReceiptRepository paymentReceiptRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    private Student student;
    private User admin;

    @BeforeEach
    void setUp() {
        student = studentRepository.save(Student.builder()
                .studentCode("SB-PAY-001")
                .firstName("Kamal")
                .lastName("Perera")
                .active(true)
                .build());

        admin = userRepository.save(User.builder()
                .username("teacher1")
                .email("teacher@sunbaby.edu")
                .passwordHash("hashed_pw_placeholder")
                .fullName("Teacher Anoma")
                .role(UserRole.ROLE_TEACHER)
                .build());
    }

    @Test
    void testCreateOfflinePaymentWithWhatsAppReceipt() {
        Payment payment = Payment.builder()
                .student(student)
                .paymentDate(LocalDate.of(2026, 9, 3))
                .paymentPeriod("2026-09")
                .amount(new BigDecimal("5000.00"))
                .paymentMethod(PaymentMethod.WHATSAPP_RECEIPT)
                .referenceNumber("WA-REF-20260903-887")
                .status(PaymentStatus.PENDING_VERIFICATION)
                .notes("Parent sent WhatsApp transfer receipt screenshot.")
                .createdBy(admin)
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        assertNotNull(savedPayment.getId());
        assertEquals(PaymentStatus.PENDING_VERIFICATION, savedPayment.getStatus());
        assertEquals(PaymentMethod.WHATSAPP_RECEIPT, savedPayment.getPaymentMethod());

        // Attach WhatsApp receipt metadata
        PaymentReceipt receipt = PaymentReceipt.builder()
                .payment(savedPayment)
                .originalFileName("whatsapp_slip_september.jpg")
                .storedFileName("receipt_20260903_001.jpg")
                .contentType("image/jpeg")
                .fileSize(245760L)
                .storagePath("/storage/receipts/2026/09/receipt_20260903_001.jpg")
                .uploadedBy(admin)
                .build();

        PaymentReceipt savedReceipt = paymentReceiptRepository.save(receipt);
        assertNotNull(savedReceipt.getId());

        List<PaymentReceipt> receipts = paymentReceiptRepository.findByPaymentId(savedPayment.getId());
        assertEquals(1, receipts.size());
        assertEquals("whatsapp_slip_september.jpg", receipts.get(0).getOriginalFileName());

        // Verify payment
        savedPayment.setStatus(PaymentStatus.VERIFIED);
        paymentRepository.saveAndFlush(savedPayment);

        Payment verified = paymentRepository.findById(savedPayment.getId()).orElseThrow();
        assertEquals(PaymentStatus.VERIFIED, verified.getStatus());
    }
}
