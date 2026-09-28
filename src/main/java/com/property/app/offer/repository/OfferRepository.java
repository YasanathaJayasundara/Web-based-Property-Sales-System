package com.property.app.offer.repository;

import com.property.app.offer.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByBuyerId(Long buyerId);
    List<Offer> findBySellerId(Long sellerId);
    List<Offer> findByPropertyId(Long propertyId);
}
