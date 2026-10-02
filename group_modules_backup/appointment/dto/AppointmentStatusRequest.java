package com.property.app.appointment.dto;

import com.property.app.appointment.model.Appointment;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AppointmentStatusRequest {

    @NotNull(message = "Status is required")
    private Appointment.Status status;

    private LocalDate newDate;

    private String newTime;

    private String reason;

    public Appointment.Status getStatus() { return status; }
    public void setStatus(Appointment.Status status) { this.status = status; }

    public LocalDate getNewDate() { return newDate; }
    public void setNewDate(LocalDate newDate) { this.newDate = newDate; }

    public String getNewTime() { return newTime; }
    public void setNewTime(String newTime) { this.newTime = newTime; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
