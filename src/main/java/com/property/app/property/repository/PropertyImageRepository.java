package com.property.app.property.repository;

import com.property.app.property.model.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyImageRepository
        extends JpaRepository<PropertyImage, Long> {

    List<PropertyImage> findAllByPropertyIdOrderByUploadedAtAsc(
            Long propertyId
    );

    Optional<PropertyImage> findByIdAndPropertyId(
            Long id,
            Long propertyId
    );

    Optional<PropertyImage>
    findFirstByPropertyIdOrderByUploadedAtAsc(
            Long propertyId
    );

    long countByPropertyId(Long propertyId);

    void deleteAllByPropertyId(Long propertyId);
}