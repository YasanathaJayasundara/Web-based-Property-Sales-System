const API_URL = "/api/properties";

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

export async function getAllProperties() {
  return handleResponse(await fetch(API_URL));
}

export async function getPublishedProperties() {
  return handleResponse(await fetch(`${API_URL}/published`));
}

export async function getPropertyById(id) {
  return handleResponse(await fetch(`${API_URL}/${id}`));
}

export async function createProperty(propertyData) {
  return handleResponse(await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(propertyData)
  }));
}

export async function updateProperty(id, propertyData) {
  return handleResponse(await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(propertyData)
  }));
}

export async function deleteProperty(id) {
  return handleResponse(await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  }));
}

export async function approveProperty(id) {
  return handleResponse(await fetch(`${API_URL}/${id}/approve`, { method: "PATCH" }));
}

export async function publishProperty(id) {
  return handleResponse(await fetch(`${API_URL}/${id}/publish`, { method: "PATCH" }));
}

export async function rejectProperty(id, reason) {
  return handleResponse(await fetch(`${API_URL}/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason })
  }));
}

export async function markPropertySold(id) {
  return handleResponse(await fetch(`${API_URL}/${id}/sold`, { method: "PATCH" }));
}

export async function archiveProperty(id) {
  return handleResponse(await fetch(`${API_URL}/${id}/archive`, { method: "PATCH" }));
}

export async function searchProperties(params) {
  const query = new URLSearchParams();
  if (params?.keyword) query.append("keyword", params.keyword);
  if (params?.city) query.append("city", params.city);
  if (params?.propertyType) query.append("propertyType", params.propertyType);
  if (params?.status) query.append("status", params.status);
  if (params?.minPrice) query.append("minPrice", params.minPrice);
  if (params?.maxPrice) query.append("maxPrice", params.maxPrice);

  const url = `${API_URL}/search?${query.toString()}`;
  return handleResponse(await fetch(url));
}
