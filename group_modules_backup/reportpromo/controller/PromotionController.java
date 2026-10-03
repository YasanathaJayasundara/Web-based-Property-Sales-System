package com.property.app.reportpromo.controller;

import com.property.app.reportpromo.dto.PromoValidationResponse;
import com.property.app.reportpromo.dto.PromotionRequest;
import com.property.app.reportpromo.dto.PromotionResponse;
import com.property.app.reportpromo.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @PostMapping
    public ResponseEntity<PromotionResponse> createPromotion(@Valid @RequestBody PromotionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(promotionService.createPromotion(request));
    }

    @GetMapping
    public ResponseEntity<List<PromotionResponse>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    @GetMapping("/active")
    public ResponseEntity<List<PromotionResponse>> getActivePromotions() {
        return ResponseEntity.ok(promotionService.getActivePromotions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionResponse> getPromotionById(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.getPromotionById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionResponse> updatePromotion(
            @PathVariable Long id,
            @Valid @RequestBody PromotionRequest request
    ) {
        return ResponseEntity.ok(promotionService.updatePromotion(id, request));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<PromotionResponse> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.toggleStatus(id));
    }

    @PostMapping("/{id}/impression")
    public ResponseEntity<Void> trackImpression(@PathVariable Long id) {
        promotionService.trackImpression(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/click")
    public ResponseEntity<Void> trackClick(@PathVariable Long id) {
        promotionService.trackClick(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/validate")
    public ResponseEntity<PromoValidationResponse> validatePromoCode(
            @RequestParam String code,
            @RequestParam(required = false) BigDecimal price
    ) {
        return ResponseEntity.ok(promotionService.validatePromoCode(code, price));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }
}
