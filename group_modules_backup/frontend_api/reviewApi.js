const REVIEW_API = "/api/reviews";
const NOTIFICATION_API = "/api/notifications";

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

// Review CRUD
export async function createReview(reviewData) {
  return handleResponse(await fetch(REVIEW_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  }));
}

export async function getAllReviews() {
  return handleResponse(await fetch(REVIEW_API));
}

export async function getReviewById(id) {
  return handleResponse(await fetch(`${REVIEW_API}/${id}`));
}

export async function getReviewsByProperty(propertyId) {
  return handleResponse(await fetch(`${REVIEW_API}/property/${propertyId}`));
}

export async function getReviewsByAgent(agentId) {
  return handleResponse(await fetch(`${REVIEW_API}/agent/${agentId}`));
}

export async function getReviewsByBuyer(buyerId) {
  return handleResponse(await fetch(`${REVIEW_API}/buyer/${buyerId}`));
}

export async function respondToReview(id, replyText) {
  return handleResponse(await fetch(`${REVIEW_API}/${id}/respond`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ response: replyText }),
  }));
}

export async function updateReviewStatus(id, status) {
  return handleResponse(await fetch(`${REVIEW_API}/${id}/status?status=${status}`, {
    method: "PATCH",
  }));
}

export async function deleteReview(id) {
  return handleResponse(await fetch(`${REVIEW_API}/${id}`, {
    method: "DELETE",
  }));
}

// Notification CRUD
export async function getUserNotifications(userId) {
  return handleResponse(await fetch(`${NOTIFICATION_API}/user/${userId}`));
}

export async function getUnreadCount(userId) {
  return handleResponse(await fetch(`${NOTIFICATION_API}/user/${userId}/unread-count`));
}

export async function markNotificationRead(id) {
  return handleResponse(await fetch(`${NOTIFICATION_API}/${id}/read`, {
    method: "PATCH",
  }));
}

export async function markAllNotificationsRead(userId) {
  return handleResponse(await fetch(`${NOTIFICATION_API}/user/${userId}/read-all`, {
    method: "PATCH",
  }));
}

export async function deleteNotification(id) {
  return handleResponse(await fetch(`${NOTIFICATION_API}/${id}`, {
    method: "DELETE",
  }));
}
