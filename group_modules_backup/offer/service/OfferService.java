package com.property.app.offer.service;

import com.property.app.offer.dto.OfferActionRequest;
import com.property.app.offer.dto.OfferRequest;
import com.property.app.offer.dto.OfferResponse;
import com.property.app.offer.model.Offer;
import com.property.app.offer.model.OfferHistory;
import com.property.app.offer.repository.OfferHistoryRepository;
import com.property.app.offer.repository.OfferRepository;
import com.property.app.property.repository.PropertyRepository;
import com.property.app.review.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OfferService {

    private final OfferRepository offerRepository;
    private final OfferHistoryRepository offerHistoryRepository;
    private final PropertyRepository propertyRepository;
    private final NotificationService notificationService;

    public OfferService(OfferRepository offerRepository,
                        OfferHistoryRepository offerHistoryRepository,
                        PropertyRepository propertyRepository,
                        NotificationService notificationService) {
        this.offerRepository = offerRepository;
        this.offerHistoryRepository = offerHistoryRepository;
        this.propertyRepository = propertyRepository;
        this.notificationService = notificationService;
    }

    public OfferResponse createOffer(OfferRequest req) {
        Offer offer = new Offer();
        offer.setPropertyId(req.getPropertyId());
        offer.setPropertyTitle(req.getPropertyTitle());
        offer.setBuyerId(req.getBuyerId());
        offer.setBuyerName(req.getBuyerName());
        offer.setSellerId(req.getSellerId());
        offer.setOfferAmount(req.getOfferAmount());
        offer.setInitialAmount(req.getOfferAmount());
        offer.setMessage(req.getMessage());
        offer.setStatus(Offer.Status.PENDING);

        Offer saved = offerRepository.save(offer);

        OfferHistory history = new OfferHistory(
                saved.getId(),
                "BUYER",
                "OFFER_SUBMITTED",
                req.getOfferAmount(),
                req.getMessage() != null ? req.getMessage() : "Initial offer submitted"
        );
        offerHistoryRepository.save(history);

        // Notify seller
        notificationService.sendNotification(
                req.getSellerId(),
                "New Offer Received",
                req.getBuyerName() + " submitted an offer of Rs. " + req.getOfferAmount() + " on " + req.getPropertyTitle(),
                "OFFER",
                "/offers"
        );

        return OfferResponse.fromEntity(saved, List.of(history));
    }

    @Transactional(readOnly = true)
    public List<OfferResponse> getAllOffers() {
        return offerRepository.findAll().stream()
                .map(o -> OfferResponse.fromEntity(o, offerHistoryRepository.findByOfferIdOrderByCreatedAtAsc(o.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OfferResponse getOfferById(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found with id: " + id));
        List<OfferHistory> history = offerHistoryRepository.findByOfferIdOrderByCreatedAtAsc(id);
        return OfferResponse.fromEntity(offer, history);
    }

    @Transactional(readOnly = true)
    public List<OfferResponse> getOffersByBuyer(Long buyerId) {
        return offerRepository.findByBuyerId(buyerId).stream()
                .map(o -> OfferResponse.fromEntity(o, offerHistoryRepository.findByOfferIdOrderByCreatedAtAsc(o.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OfferResponse> getOffersBySeller(Long sellerId) {
        return offerRepository.findBySellerId(sellerId).stream()
                .map(o -> OfferResponse.fromEntity(o, offerHistoryRepository.findByOfferIdOrderByCreatedAtAsc(o.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OfferResponse> getOffersByProperty(Long propertyId) {
        return offerRepository.findByPropertyId(propertyId).stream()
                .map(o -> OfferResponse.fromEntity(o, offerHistoryRepository.findByOfferIdOrderByCreatedAtAsc(o.getId())))
                .collect(Collectors.toList());
    }

    public OfferResponse respondToOffer(Long id, OfferActionRequest req) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found with id: " + id));

        offer.setStatus(req.getStatus());
        BigDecimal currentAmount = offer.getOfferAmount();

        if (req.getStatus() == Offer.Status.COUNTERED && req.getCounterAmount() != null) {
            offer.setCounterAmount(req.getCounterAmount());
            offer.setOfferAmount(req.getCounterAmount());
            offer.setCounterMessage(req.getMessage());
            currentAmount = req.getCounterAmount();
        } else if (req.getStatus() == Offer.Status.ACCEPTED) {
            // Update property status if accepted
            propertyRepository.findById(offer.getPropertyId()).ifPresent(p -> {
                // If Property has status PENDING / PUBLISHED, we keep it trackable
            });
        }

        Offer saved = offerRepository.save(offer);

        OfferHistory history = new OfferHistory(
                saved.getId(),
                req.getActorRole(),
                req.getStatus().name(),
                currentAmount,
                req.getMessage() != null ? req.getMessage() : "Status updated to " + req.getStatus()
        );
        offerHistoryRepository.save(history);

        // Notify counterparty
        Long notifyUserId = "SELLER".equalsIgnoreCase(req.getActorRole()) ? offer.getBuyerId() : offer.getSellerId();
        notificationService.sendNotification(
                notifyUserId,
                "Offer " + req.getStatus().name(),
                "Your offer on " + offer.getPropertyTitle() + " was updated to: " + req.getStatus().name(),
                "OFFER",
                "/offers"
        );

        List<OfferHistory> fullHistory = offerHistoryRepository.findByOfferIdOrderByCreatedAtAsc(id);
        return OfferResponse.fromEntity(saved, fullHistory);
    }

    public OfferResponse updateOffer(Long id, OfferRequest req) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found with id: " + id));

        offer.setOfferAmount(req.getOfferAmount());
        if (req.getMessage() != null) offer.setMessage(req.getMessage());

        Offer saved = offerRepository.save(offer);
        OfferHistory history = new OfferHistory(
                saved.getId(),
                "BUYER",
                "OFFER_UPDATED",
                req.getOfferAmount(),
                req.getMessage() != null ? req.getMessage() : "Buyer updated offer amount"
        );
        offerHistoryRepository.save(history);

        List<OfferHistory> fullHistory = offerHistoryRepository.findByOfferIdOrderByCreatedAtAsc(id);
        return OfferResponse.fromEntity(saved, fullHistory);
    }

    public void deleteOffer(Long id) {
        if (!offerRepository.existsById(id)) {
            throw new IllegalArgumentException("Offer not found with id: " + id);
        }
        offerRepository.deleteById(id);
    }
}
