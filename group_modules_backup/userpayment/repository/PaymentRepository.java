package com.property.app.userpayment.repository;

import com.property.app.userpayment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBuyerId(Long buyerId);
    List<Payment> findByOfferId(Long offerId);
    List<Payment> findByPropertyId(Long propertyId);
    Optional<Payment> findByReceiptNumber(String receiptNumber);
}
