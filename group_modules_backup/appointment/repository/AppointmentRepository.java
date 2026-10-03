package com.property.app.appointment.repository;

import com.property.app.appointment.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByBuyerId(Long buyerId);
    List<Appointment> findByAgentId(Long agentId);
    List<Appointment> findByPropertyId(Long propertyId);
    List<Appointment> findByPropertyIdAndAppointmentDate(Long propertyId, LocalDate appointmentDate);
}
