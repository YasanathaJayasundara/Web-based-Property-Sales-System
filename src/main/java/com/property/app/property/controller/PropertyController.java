package com.property.app.property.controller;

import com.property.app.property.dto.PropertyRequest;
import com.property.app.property.dto.PropertyRejectionRequest;
import com.property.app.property.dto.PropertyResponse;
import com.property.app.property.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<PropertyResponse> createProperty(
            @Valid @RequestBody PropertyRequest request
    ) {
        PropertyResponse createdProperty =
                propertyService.createProperty(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdProperty);
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAllProperties() {
        return ResponseEntity.ok(
                propertyService.getAllProperties()
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PropertyResponse>> getPendingProperties() {
        return ResponseEntity.ok(
                propertyService.getPendingProperties()
        );
    }

    @GetMapping("/published")
    public ResponseEntity<List<PropertyResponse>> getPublishedProperties() {
        return ResponseEntity.ok(
                propertyService.getPublishedProperties()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyResponse>> searchProperties(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return ResponseEntity.ok(
                propertyService.searchProperties(
                        keyword,
                        city,
                        propertyType,
                        status,
                        minPrice,
                        maxPrice
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                propertyService.getPropertyById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequest request
    ) {
        return ResponseEntity.ok(
                propertyService.updateProperty(id, request)
        );
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<PropertyResponse> approveProperty(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                propertyService.approveProperty(id)
        );
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<PropertyResponse> publishProperty(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                propertyService.publishProperty(id)
        );
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<PropertyResponse> rejectProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRejectionRequest request
    ) {
        return ResponseEntity.ok(
                propertyService.rejectProperty(
                        id,
                        request.getReason()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id
    ) {
        propertyService.deleteProperty(id);

        return ResponseEntity.noContent().build();
    }
}