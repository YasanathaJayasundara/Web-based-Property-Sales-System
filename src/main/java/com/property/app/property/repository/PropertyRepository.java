package com.property.app.property.repository;

import com.property.app.property.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository
        extends JpaRepository<Property, Long> {

    @Query("""
            SELECT p
            FROM Property p
            WHERE (
                :keywordPattern IS NULL
                OR LOWER(p.title) LIKE LOWER(:keywordPattern)
                OR LOWER(p.description) LIKE LOWER(:keywordPattern)
                OR LOWER(p.address) LIKE LOWER(:keywordPattern)
            )
            AND (
                :city IS NULL
                OR LOWER(p.city) = LOWER(:city)
            )
            AND (
                :propertyType IS NULL
                OR LOWER(p.propertyType) = LOWER(:propertyType)
            )
            AND (
                :status IS NULL
                OR LOWER(p.status) = LOWER(:status)
            )
            AND (
                :minPrice IS NULL
                OR p.price >= :minPrice
            )
            AND (
                :maxPrice IS NULL
                OR p.price <= :maxPrice
            )
            ORDER BY p.id DESC
            """)
    List<Property> searchProperties(
            @Param("keywordPattern") String keywordPattern,
            @Param("city") String city,
            @Param("propertyType") String propertyType,
            @Param("status") String status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );
}