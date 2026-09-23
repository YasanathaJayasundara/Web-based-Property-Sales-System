const APPOINTMENT_API = "/api/appointments";

async function handleResponse(response) {
  if (response.status === 204) return null;
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    let message = body?.message || `Request failed with status ${response.status}`;
    if (body?.errors) {
      message = Array.isArray(body.errors)
        ? body.errors.join(", ")
        : Object.values(body.errors).join(", ");
    }
    throw new Error(message);
  }
  return body;
}

export async function bookAppointment(appointmentData) {
  return handleResponse(await fetch(APPOINTMENT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData),
  }));
}

export async function getAllAppointments() {
  return handleResponse(await fetch(APPOINTMENT_API));
}

export async function getAppointmentById(id) {
  return handleResponse(await fetch(`${APPOINTMENT_API}/${id}`));
}

export async function getAppointmentsByBuyer(buyerId) {
  return handleResponse(await fetch(`${APPOINTMENT_API}/buyer/${buyerId}`));
}

export async function getAppointmentsByAgent(agentId) {
  return handleResponse(await fetch(`${APPOINTMENT_API}/agent/${agentId}`));
}

export async function updateAppointment(id, appointmentData) {
  return handleResponse(await fetch(`${APPOINTMENT_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData),
  }));
}

export async function updateAppointmentStatus(id, statusData) {
  return handleResponse(await fetch(`${APPOINTMENT_API}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statusData),
  }));
}

export async function deleteAppointment(id) {
  return handleResponse(await fetch(`${APPOINTMENT_API}/${id}`, {
    method: "DELETE",
  }));
}
