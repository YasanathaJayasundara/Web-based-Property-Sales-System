const OFFER_API = "/api/offers";

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

export async function createOffer(offerData) {
  return handleResponse(await fetch(OFFER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offerData),
  }));
}

export async function getAllOffers() {
  return handleResponse(await fetch(OFFER_API));
}

export async function getOfferById(id) {
  return handleResponse(await fetch(`${OFFER_API}/${id}`));
}

export async function getOffersByBuyer(buyerId) {
  return handleResponse(await fetch(`${OFFER_API}/buyer/${buyerId}`));
}

export async function getOffersBySeller(sellerId) {
  return handleResponse(await fetch(`${OFFER_API}/seller/${sellerId}`));
}

export async function getOffersByProperty(propertyId) {
  return handleResponse(await fetch(`${OFFER_API}/property/${propertyId}`));
}

export async function updateOffer(id, offerData) {
  return handleResponse(await fetch(`${OFFER_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offerData),
  }));
}

export async function respondToOffer(id, actionData) {
  return handleResponse(await fetch(`${OFFER_API}/${id}/respond`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actionData),
  }));
}

export async function deleteOffer(id) {
  return handleResponse(await fetch(`${OFFER_API}/${id}`, {
    method: "DELETE",
  }));
}
