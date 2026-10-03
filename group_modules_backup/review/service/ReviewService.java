package com.property.app.review.service;

import com.property.app.review.dto.ReviewReplyRequest;
import com.property.app.review.dto.ReviewRequest;
import com.property.app.review.dto.ReviewResponse;
import com.property.app.review.model.Review;
import com.property.app.review.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final NotificationService notificationService;

    public ReviewService(ReviewRepository reviewRepository, NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.notificationService = notificationService;
    }

    public ReviewResponse createReview(ReviewRequest req) {
        Review review = new Review();
        review.setPropertyId(req.getPropertyId());
        review.setBuyerId(req.getBuyerId());
        review.setBuyerName(req.getBuyerName());
        review.setAgentId(req.getAgentId());
        review.setPaymentId(req.getPaymentId());
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        review.setStatus(Review.Status.PUBLISHED);

        Review saved = reviewRepository.save(review);

        // Notify Agent if assigned
        if (req.getAgentId() != null) {
            notificationService.sendNotification(
                    req.getAgentId(),
                    "New Review Received",
                    req.getBuyerName() + " left a " + req.getRating() + "-star review: \"" + req.getComment() + "\"",
                    "REVIEW",
                    "/reviews"
            );
        }

        return ReviewResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + id));
        return ReviewResponse.fromEntity(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProperty(Long propertyId) {
        return reviewRepository.findByPropertyId(propertyId).stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByAgent(Long agentId) {
        return reviewRepository.findByAgentId(agentId).stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByBuyer(Long buyerId) {
        return reviewRepository.findByBuyerId(buyerId).stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ReviewResponse respondToReview(Long id, ReviewReplyRequest req) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + id));

        review.setResponse(req.getResponse());
        Review saved = reviewRepository.save(review);

        // Notify Buyer
        notificationService.sendNotification(
                review.getBuyerId(),
                "Agent Replied to Your Review",
                "The agent has replied to your review: \"" + req.getResponse() + "\"",
                "REVIEW",
                "/reviews"
        );

        return ReviewResponse.fromEntity(saved);
    }

    public ReviewResponse updateStatus(Long id, Review.Status status) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + id));
        review.setStatus(status);
        return ReviewResponse.fromEntity(reviewRepository.save(review));
    }

    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new IllegalArgumentException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }
}
