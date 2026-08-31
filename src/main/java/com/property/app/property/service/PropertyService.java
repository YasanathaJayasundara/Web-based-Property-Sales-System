package com.property.app.property.service;

import com.property.app.property.dto.PropertyRequest;
import com.property.app.property.dto.PropertyResponse;
import com.property.app.property.model.Property;
import com.property.app.property.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PropertyResponse createProperty(PropertyRequest request) {
        Property property = new Property();

        property.setTitle(request.title());
        property.setCity(request.city());
        property.setPrice(request.price());

        Property savedProperty =
                propertyRepository.save(property);

        return toResponse(savedProperty);
    }

    private PropertyResponse toResponse(Property property) {
        return new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getCity(),
                property.getPrice()
        );
    }
}