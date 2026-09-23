const USER_API = "/api/users";
const PAYMENT_API = "/api/payments";

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

// User CRUD
export async function registerUser(userData) {
  return handleResponse(await fetch(`${USER_API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }));
}

export async function loginUser(credentials) {
  return handleResponse(await fetch(`${USER_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }));
}

export async function getAllUsers() {
  return handleResponse(await fetch(USER_API));
}

export async function getUserById(id) {
  return handleResponse(await fetch(`${USER_API}/${id}`));
}

export async function updateUser(id, userData) {
  return handleResponse(await fetch(`${USER_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }));
}

export async function toggleSuspendUser(id) {
  return handleResponse(await fetch(`${USER_API}/${id}/toggle-suspend`, {
    method: "PATCH",
  }));
}

export async function deleteUser(id) {
  return handleResponse(await fetch(`${USER_API}/${id}`, {
    method: "DELETE",
  }));
}

// Payment CRUD
export async function processPayment(paymentData) {
  return handleResponse(await fetch(PAYMENT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  }));
}

export async function getAllPayments() {
  return handleResponse(await fetch(PAYMENT_API));
}

export async function getPaymentById(id) {
  return handleResponse(await fetch(`${PAYMENT_API}/${id}`));
}

export async function getPaymentsByBuyer(buyerId) {
  return handleResponse(await fetch(`${PAYMENT_API}/buyer/${buyerId}`));
}

export async function getPaymentsByOffer(offerId) {
  return handleResponse(await fetch(`${PAYMENT_API}/offer/${offerId}`));
}

export async function getByReceipt(receiptNumber) {
  return handleResponse(await fetch(`${PAYMENT_API}/receipt/${receiptNumber}`));
}

export async function updatePaymentStatus(id, status) {
  return handleResponse(await fetch(`${PAYMENT_API}/${id}/status?status=${status}`, {
    method: "PATCH",
  }));
}

export async function deletePayment(id) {
  return handleResponse(await fetch(`${PAYMENT_API}/${id}`, {
    method: "DELETE",
  }));
}
