package com.property.app.property.repository;

import com.property.app.property.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository
        extends JpaRepository<Property, Long> {
}