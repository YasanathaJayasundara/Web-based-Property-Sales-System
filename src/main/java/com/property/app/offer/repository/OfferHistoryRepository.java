package com.property.app.offer.repository;

import com.property.app.offer.model.OfferHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferHistoryRepository extends JpaRepository<OfferHistory, Long> {
    List<OfferHistory> findByOfferIdOrderByCreatedAtAsc(Long offerId);
}
