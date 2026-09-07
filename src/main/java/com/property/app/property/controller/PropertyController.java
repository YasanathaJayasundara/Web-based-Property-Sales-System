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

    // POST: Create a new property
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

    // GET: Get all properties
    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAllProperties() {
        List<PropertyResponse> properties =
                propertyService.getAllProperties();

        return ResponseEntity.ok(properties);
    }

    // GET: Get a property by ID
    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(
            @PathVariable Long id
    ) {
        PropertyResponse property =
                propertyService.getPropertyById(id);

        return ResponseEntity.ok(property);
    }

    // PUT: Update a property
    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyRequest request
    ) {
        PropertyResponse updatedProperty =
                propertyService.updateProperty(id, request);

        return ResponseEntity.ok(updatedProperty);
    }

    // DELETE: Delete a property
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id
    ) {
        propertyService.deleteProperty(id);

        return ResponseEntity.noContent().build();
    }
}