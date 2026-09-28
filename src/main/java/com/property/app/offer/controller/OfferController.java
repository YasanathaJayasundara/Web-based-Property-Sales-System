package com.property.app.offer.controller;

import com.property.app.offer.dto.OfferActionRequest;
import com.property.app.offer.dto.OfferRequest;
import com.property.app.offer.dto.OfferResponse;
import com.property.app.offer.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping
    public ResponseEntity<OfferResponse> createOffer(@Valid @RequestBody OfferRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(offerService.createOffer(request));
    }

    @GetMapping
    public ResponseEntity<List<OfferResponse>> getAllOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferResponse> getOfferById(@PathVariable Long id) {
        return ResponseEntity.ok(offerService.getOfferById(id));
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<OfferResponse>> getByBuyer(@PathVariable Long buyerId) {
        return ResponseEntity.ok(offerService.getOffersByBuyer(buyerId));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<OfferResponse>> getBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(offerService.getOffersBySeller(sellerId));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<OfferResponse>> getByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(offerService.getOffersByProperty(propertyId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfferResponse> updateOffer(
            @PathVariable Long id,
            @Valid @RequestBody OfferRequest request
    ) {
        return ResponseEntity.ok(offerService.updateOffer(id, request));
    }

    @PatchMapping("/{id}/respond")
    public ResponseEntity<OfferResponse> respondToOffer(
            @PathVariable Long id,
            @Valid @RequestBody OfferActionRequest request
    ) {
        return ResponseEntity.ok(offerService.respondToOffer(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }
}
