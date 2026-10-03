package com.property.app.review.repository;

import com.property.app.review.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPropertyId(Long propertyId);
    List<Review> findByAgentId(Long agentId);
    List<Review> findByBuyerId(Long buyerId);
    List<Review> findByStatus(Review.Status status);
}
