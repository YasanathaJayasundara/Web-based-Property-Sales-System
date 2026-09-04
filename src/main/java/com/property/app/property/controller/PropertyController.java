package com.property.app.property.controller;

import com.property.app.property.dto.PropertyRequest;
import com.property.app.property.dto.PropertyResponse;
import com.property.app.property.service.PropertyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // Create a new property listing
    @PostMapping
    public ResponseEntity<PropertyResponse> createProperty(
            @RequestBody PropertyRequest request
    ) {

        PropertyResponse createdProperty =
                propertyService.createProperty(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdProperty);
    }

    // Get all property listings
    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAllProperties() {

        List<PropertyResponse> properties =
                propertyService.getAllProperties();

        return ResponseEntity.ok(properties);
    }

    // Get one property by ID
    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(
            @PathVariable Long id
    ) {

        PropertyResponse property =
                propertyService.getPropertyById(id);

        return ResponseEntity.ok(property);
    }
}