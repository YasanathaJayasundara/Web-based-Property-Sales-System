package com.property.app.reportpromo.repository;

import com.property.app.reportpromo.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByStatus(Promotion.Status status);
    List<Promotion> findByPlacementAndStatus(Promotion.Placement placement, Promotion.Status status);
    Optional<Promotion> findByPromoCodeIgnoreCase(String promoCode);
    boolean existsByPromoCodeIgnoreCase(String promoCode);
}
