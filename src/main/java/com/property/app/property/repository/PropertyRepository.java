package com.property.app.property.repository;

import com.property.app.property.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PropertyRepository
        extends JpaRepository<Property, Long> {

    List<Property> findByStatusOrderByCreatedAtDesc(
            Property.Status status
    );

    List<Property> findBySellerIdOrderByCreatedAtDesc(
            Long sellerId
    );

    List<Property> findByCityContainingIgnoreCase(
            String city
    );

    List<Property> findByPropertyTypeIgnoreCase(
            String propertyType
    );

    List<Property> findByPriceBetween(
            BigDecimal minimumPrice,
            BigDecimal maximumPrice
    );

    Optional<Property> findByIdAndSellerId(
            Long propertyId,
            Long sellerId
    );
}