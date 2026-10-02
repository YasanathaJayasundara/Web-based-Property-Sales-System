package com.property.app.appointment.service;

import com.property.app.appointment.dto.AppointmentRequest;
import com.property.app.appointment.dto.AppointmentResponse;
import com.property.app.appointment.dto.AppointmentStatusRequest;
import com.property.app.appointment.model.Appointment;
import com.property.app.appointment.repository.AppointmentRepository;
import com.property.app.review.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    public AppointmentService(AppointmentRepository appointmentRepository, NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
    }

    public AppointmentResponse bookAppointment(AppointmentRequest req) {
        Appointment appointment = new Appointment();
        appointment.setPropertyId(req.getPropertyId());
        appointment.setPropertyTitle(req.getPropertyTitle());
        appointment.setBuyerId(req.getBuyerId());
        appointment.setBuyerName(req.getBuyerName());
        appointment.setBuyerPhone(req.getBuyerPhone());
        appointment.setBuyerEmail(req.getBuyerEmail());
        appointment.setAgentId(req.getAgentId());
        appointment.setAppointmentDate(req.getAppointmentDate());
        appointment.setAppointmentTime(req.getAppointmentTime());
        appointment.setNotes(req.getNotes());
        appointment.setStatus(Appointment.Status.PENDING);

        Appointment saved = appointmentRepository.save(appointment);

        // Notify agent if assigned
        if (req.getAgentId() != null) {
            notificationService.sendNotification(
                    req.getAgentId(),
                    "New Viewing Requested",
                    req.getBuyerName() + " requested a viewing for " + req.getPropertyTitle() + " on " + req.getAppointmentDate() + " at " + req.getAppointmentTime(),
                    "APPOINTMENT",
                    "/appointments"
            );
        }

        return AppointmentResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found with id: " + id));
        return AppointmentResponse.fromEntity(appt);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByBuyer(Long buyerId) {
        return appointmentRepository.findByBuyerId(buyerId).stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByAgent(Long agentId) {
        return appointmentRepository.findByAgentId(agentId).stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public AppointmentResponse updateStatusOrReschedule(Long id, AppointmentStatusRequest req) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found with id: " + id));

        appt.setStatus(req.getStatus());
        if (req.getNewDate() != null) appt.setAppointmentDate(req.getNewDate());
        if (req.getNewTime() != null) appt.setAppointmentTime(req.getNewTime());
        if (req.getReason() != null) appt.setCancellationReason(req.getReason());

        Appointment saved = appointmentRepository.save(appt);

        // Notify buyer of appointment status change
        String notificationMessage = "Your viewing appointment for " + saved.getPropertyTitle() + " status is now: " + saved.getStatus();
        if (req.getStatus() == Appointment.Status.RESCHEDULED && req.getNewDate() != null) {
            notificationMessage += " (Rescheduled to " + req.getNewDate() + " " + req.getNewTime() + ")";
        }
        notificationService.sendNotification(
                saved.getBuyerId(),
                "Appointment " + saved.getStatus(),
                notificationMessage,
                "APPOINTMENT",
                "/appointments"
        );

        return AppointmentResponse.fromEntity(saved);
    }

    public AppointmentResponse updateAppointment(Long id, AppointmentRequest req) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found with id: " + id));

        appt.setAppointmentDate(req.getAppointmentDate());
        appt.setAppointmentTime(req.getAppointmentTime());
        if (req.getNotes() != null) appt.setNotes(req.getNotes());
        if (req.getBuyerPhone() != null) appt.setBuyerPhone(req.getBuyerPhone());
        if (req.getBuyerEmail() != null) appt.setBuyerEmail(req.getBuyerEmail());

        return AppointmentResponse.fromEntity(appointmentRepository.save(appt));
    }

    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new IllegalArgumentException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }
}
