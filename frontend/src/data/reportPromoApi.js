const PROMOTION_API = "/api/promotions";
const REPORT_API = "/api/reports";

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

// -------------------------------------------------------------
// Advertisements & Promotions Management (Shavindi T.D.P.)
// -------------------------------------------------------------
export async function getAllPromotions() {
  return handleResponse(await fetch(PROMOTION_API));
}

export async function getActivePromotions() {
  return handleResponse(await fetch(`${PROMOTION_API}/active`));
}

export async function getPromotionById(id) {
  return handleResponse(await fetch(`${PROMOTION_API}/${id}`));
}

export async function createPromotion(promoData) {
  return handleResponse(await fetch(PROMOTION_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(promoData),
  }));
}

export async function updatePromotion(id, promoData) {
  return handleResponse(await fetch(`${PROMOTION_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(promoData),
  }));
}

export async function togglePromotionStatus(id) {
  return handleResponse(await fetch(`${PROMOTION_API}/${id}/toggle-status`, {
    method: "PATCH",
  }));
}

export async function deletePromotion(id) {
  return handleResponse(await fetch(`${PROMOTION_API}/${id}`, {
    method: "DELETE",
  }));
}

export async function trackPromoImpression(id) {
  return fetch(`${PROMOTION_API}/${id}/impression`, { method: "POST" }).catch(() => null);
}

export async function trackPromoClick(id) {
  return fetch(`${PROMOTION_API}/${id}/click`, { method: "POST" }).catch(() => null);
}

export async function validatePromoCode(code, price) {
  const query = new URLSearchParams({ code });
  if (price !== undefined && price !== null) query.append("price", price);
  return handleResponse(await fetch(`${PROMOTION_API}/validate?${query.toString()}`));
}

// -------------------------------------------------------------
// Reports & Analytics Dashboard (Shavindi T.D.P.)
// -------------------------------------------------------------
export async function generateReport(reportData) {
  return handleResponse(await fetch(`${REPORT_API}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reportData),
  }));
}

export async function getAllReports() {
  return handleResponse(await fetch(REPORT_API));
}

export async function getReportById(id) {
  return handleResponse(await fetch(`${REPORT_API}/${id}`));
}

export async function updateReport(id, notes, status) {
  const query = new URLSearchParams();
  if (notes) query.append("notes", notes);
  if (status) query.append("status", status);
  return handleResponse(await fetch(`${REPORT_API}/${id}?${query.toString()}`, {
    method: "PUT",
  }));
}

export async function deleteReport(id) {
  return handleResponse(await fetch(`${REPORT_API}/${id}`, {
    method: "DELETE",
  }));
}

export async function getDashboardAnalytics(range = "6m") {
  return handleResponse(await fetch(`${REPORT_API}/analytics/dashboard?range=${range}`));
}

export function getReportExportUrl(id) {
  return `${REPORT_API}/${id}/export`;
}
