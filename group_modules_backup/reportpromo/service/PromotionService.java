package com.property.app.reportpromo.service;

import com.property.app.reportpromo.dto.PromoValidationResponse;
import com.property.app.reportpromo.dto.PromotionRequest;
import com.property.app.reportpromo.dto.PromotionResponse;
import com.property.app.reportpromo.model.Promotion;
import com.property.app.reportpromo.repository.PromotionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    public PromotionResponse createPromotion(PromotionRequest req) {
        if (promotionRepository.existsByPromoCodeIgnoreCase(req.getPromoCode())) {
            throw new IllegalArgumentException("Promo code already exists: " + req.getPromoCode());
        }

        Promotion p = new Promotion();
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setPromoCode(req.getPromoCode().toUpperCase().trim());
        p.setDiscountType(req.getDiscountType() != null ? req.getDiscountType() : Promotion.DiscountType.PERCENTAGE);
        p.setDiscountValue(req.getDiscountValue());
        p.setBannerImageUrl(req.getBannerImageUrl());
        p.setTargetUrl(req.getTargetUrl());
        p.setTargetPropertyType(req.getTargetPropertyType());
        p.setPlacement(req.getPlacement() != null ? req.getPlacement() : Promotion.Placement.HERO_BANNER);
        p.setStatus(req.getStatus() != null ? req.getStatus() : Promotion.Status.ACTIVE);
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());
        p.setCreatedBy(req.getCreatedBy() != null ? req.getCreatedBy() : "Shavindi T.D.P.");

        Promotion saved = promotionRepository.save(p);
        return PromotionResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(PromotionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> getActivePromotions() {
        LocalDate today = LocalDate.now();
        return promotionRepository.findByStatus(Promotion.Status.ACTIVE).stream()
                .filter(p -> (p.getStartDate() == null || !p.getStartDate().isAfter(today)) &&
                             (p.getEndDate() == null || !p.getEndDate().isBefore(today)))
                .map(PromotionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PromotionResponse getPromotionById(Long id) {
        Promotion p = promotionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Promotion not found with id: " + id));
        return PromotionResponse.fromEntity(p);
    }

    public PromotionResponse updatePromotion(Long id, PromotionRequest req) {
        Promotion p = promotionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Promotion not found with id: " + id));

        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setDiscountType(req.getDiscountType());
        p.setDiscountValue(req.getDiscountValue());
        p.setBannerImageUrl(req.getBannerImageUrl());
        p.setTargetUrl(req.getTargetUrl());
        p.setTargetPropertyType(req.getTargetPropertyType());
        p.setPlacement(req.getPlacement());
        if (req.getStatus() != null) p.setStatus(req.getStatus());
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());

        return PromotionResponse.fromEntity(promotionRepository.save(p));
    }

    public PromotionResponse toggleStatus(Long id) {
        Promotion p = promotionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Promotion not found with id: " + id));

        p.setStatus(p.getStatus() == Promotion.Status.ACTIVE ? Promotion.Status.INACTIVE : Promotion.Status.ACTIVE);
        return PromotionResponse.fromEntity(promotionRepository.save(p));
    }

    public void trackImpression(Long id) {
        promotionRepository.findById(id).ifPresent(p -> {
            p.setImpressionCount((p.getImpressionCount() != null ? p.getImpressionCount() : 0) + 1);
            promotionRepository.save(p);
        });
    }

    public void trackClick(Long id) {
        promotionRepository.findById(id).ifPresent(p -> {
            p.setClickCount((p.getClickCount() != null ? p.getClickCount() : 0) + 1);
            promotionRepository.save(p);
        });
    }

    @Transactional(readOnly = true)
    public PromoValidationResponse validatePromoCode(String code, BigDecimal propertyPrice) {
        if (code == null || code.trim().isEmpty()) {
            return PromoValidationResponse.invalid("Please provide a promo code.");
        }

        Optional<Promotion> promoOpt = promotionRepository.findByPromoCodeIgnoreCase(code.trim());
        if (promoOpt.isEmpty()) {
            return PromoValidationResponse.invalid("Promo code '" + code + "' is not valid.");
        }

        Promotion p = promoOpt.get();
        LocalDate today = LocalDate.now();

        if (p.getStatus() != Promotion.Status.ACTIVE) {
            return PromoValidationResponse.invalid("Promo code '" + code + "' is currently inactive.");
        }
        if (p.getStartDate() != null && today.isBefore(p.getStartDate())) {
            return PromoValidationResponse.invalid("Promo code '" + code + "' has not started yet.");
        }
        if (p.getEndDate() != null && today.isAfter(p.getEndDate())) {
            return PromoValidationResponse.invalid("Promo code '" + code + "' has expired.");
        }

        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal price = propertyPrice != null ? propertyPrice : BigDecimal.ZERO;

        if (p.getDiscountType() == Promotion.DiscountType.PERCENTAGE) {
            discount = price.multiply(p.getDiscountValue()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        } else {
            discount = p.getDiscountValue();
        }

        if (discount.compareTo(price) > 0) {
            discount = price;
        }
        BigDecimal finalPrice = price.subtract(discount);

        PromoValidationResponse res = new PromoValidationResponse();
        res.setValid(true);
        res.setPromoCode(p.getPromoCode());
        res.setTitle(p.getTitle());
        res.setDiscountType(p.getDiscountType());
        res.setDiscountValue(p.getDiscountValue());
        res.setCalculatedDiscount(discount);
        res.setFinalPrice(finalPrice);
        res.setMessage("Promo code applied successfully: " + p.getTitle());
        return res;
    }

    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new IllegalArgumentException("Promotion not found with id: " + id);
        }
        promotionRepository.deleteById(id);
    }
}
