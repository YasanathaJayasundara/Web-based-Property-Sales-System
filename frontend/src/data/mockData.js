// This module simulates the Spring Boot REST API responses with in-memory data,
// so the frontend can be built and demoed before the backend is ready.
// Swap the functions in src/api/* for real fetch() calls once the backend exists.

export const USERS = [
  { id: "u1", name: "Amara Fernando", email: "amara.buyer@example.com", role: "BUYER", phone: "077 123 4567" },
  { id: "u2", name: "Nadeesha Perera", email: "nadeesha.seller@example.com", role: "SELLER", phone: "071 234 5678" },
  { id: "u3", name: "Ruwan Silva", email: "ruwan.agent@example.com", role: "AGENT", phone: "070 345 6789" },
  { id: "u4", name: "Platform Admin", email: "admin@haven.lk", role: "ADMIN", phone: "011 200 0000" },
];

export const LISTINGS = [
  {
    id: "l1", ownerId: "u2", title: "Modern 3BR House in Nugegoda", price: 42500000,
    location: "Nugegoda, Colombo", type: "House", bedrooms: 3, bathrooms: 2, area: 1850,
    status: "Available", description: "A bright, recently renovated three-bedroom home with an open-plan kitchen, private garden, and secure parking for two vehicles. Walking distance to schools and the town centre.",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    agentId: "u3",
  },
  {
    id: "l2", ownerId: "u2", title: "Beachfront Land Plot, Bentota", price: 18000000,
    location: "Bentota, Galle", type: "Land", bedrooms: 0, bathrooms: 0, area: 4356,
    status: "Available", description: "A rare 10-perch beachfront plot ideal for a boutique villa or holiday home. Clear deed, road access, and electricity/water connections already in place.",
    photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
    agentId: "u3",
  },
  {
    id: "l3", ownerId: "u2", title: "2BR Apartment, Rajagiriya", price: 26800000,
    location: "Rajagiriya, Colombo", type: "Apartment", bedrooms: 2, bathrooms: 2, area: 1050,
    status: "Under Offer", description: "A modern apartment on the 8th floor with city views, 24-hour security, a shared pool, and covered parking. Ready to move in.",
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    agentId: "u3",
  },
  {
    id: "l4", ownerId: "u2", title: "Commercial Lot, Kurunegala Town", price: 31000000,
    location: "Kurunegala", type: "Commercial", bedrooms: 0, bathrooms: 1, area: 3200,
    status: "Available", description: "High-visibility corner lot on the main road, currently zoned commercial. Suited to retail, a showroom, or mixed-use development.",
    photos: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"],
    agentId: null,
  },
  {
    id: "l5", ownerId: "u2", title: "4BR Family Home, Kandy Hills", price: 58900000,
    location: "Kandy", type: "House", bedrooms: 4, bathrooms: 3, area: 2600,
    status: "Sold", description: "A spacious hillside family home with panoramic valley views, a landscaped garden, and a separate annex suitable for extended family or rental income.",
    photos: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"],
    agentId: "u3",
  },
  {
    id: "l6", ownerId: "u2", title: "Studio Apartment, Colombo 5", price: 15400000,
    location: "Colombo 5", type: "Apartment", bedrooms: 1, bathrooms: 1, area: 520,
    status: "Available", description: "A compact, well-designed studio close to Independence Square. Ideal as a first home or rental investment property.",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    agentId: "u3",
  },
];

export const APPOINTMENTS = [
  { id: "a1", listingId: "l1", buyerId: "u1", agentId: "u3", dateTime: "2026-09-10T10:00:00", status: "Confirmed" },
  { id: "a2", listingId: "l3", buyerId: "u1", agentId: "u3", dateTime: "2026-09-12T14:30:00", status: "Pending" },
];

export const OFFERS = [
  { id: "o1", listingId: "l1", buyerId: "u1", amount: 41000000, status: "Pending", message: "Would you consider a slightly lower price given the required repainting?", history: [{ by: "Buyer", amount: 41000000, note: "Initial offer" }] },
  { id: "o2", listingId: "l3", buyerId: "u1", amount: 26000000, status: "Accepted", message: "", history: [
    { by: "Buyer", amount: 25500000, note: "Initial offer" },
    { by: "Seller", amount: 26300000, note: "Countered" },
    { by: "Buyer", amount: 26000000, note: "Countered" },
    { by: "Seller", amount: 26000000, note: "Accepted" },
  ]},
];

export const PAYMENTS = [
  { id: "p1", offerId: "o2", buyerId: "u1", amount: 2600000, status: "Completed", createdAt: "2026-08-20T09:15:00", receiptId: "RCPT-1002" },
];

export const REVIEWS = [
  { id: "r1", listingId: "l5", agentId: "u3", buyerId: "u1", rating: 5, comment: "Ruwan made the whole process effortless — responsive, honest about the property's condition, and great with follow-up.", response: "Thank you, Amara! It was a pleasure helping you find the right home.", status: "Published", createdAt: "2026-07-02" },
  { id: "r2", listingId: "l3", agentId: "u3", buyerId: "u1", rating: 4, comment: "Good communication throughout, though the viewing was rescheduled twice.", response: "", status: "Published", createdAt: "2026-08-22" },
];

export const NOTIFICATIONS = [
  { id: "n1", userId: "u1", message: "Your appointment for Modern 3BR House in Nugegoda was confirmed.", isRead: false, createdAt: "2026-09-01T08:00:00" },
  { id: "n2", userId: "u1", message: "Your offer on 2BR Apartment, Rajagiriya was accepted.", isRead: false, createdAt: "2026-08-20T09:00:00" },
  { id: "n3", userId: "u3", message: "New review received from Amara Fernando.", isRead: true, createdAt: "2026-08-22T11:20:00" },
];

export const SALES_TREND = [
  { month: "Mar", sales: 4, revenue: 62.5 },
  { month: "Apr", sales: 6, revenue: 98.2 },
  { month: "May", sales: 5, revenue: 84.0 },
  { month: "Jun", sales: 8, revenue: 141.6 },
  { month: "Jul", sales: 7, revenue: 119.3 },
  { month: "Aug", sales: 9, revenue: 158.9 },
];

export const PROPERTY_TYPE_BREAKDOWN = [
  { type: "House", count: 14 },
  { type: "Apartment", count: 22 },
  { type: "Land", count: 9 },
  { type: "Commercial", count: 5 },
];

export const AGENT_PERFORMANCE = [
  { agent: "Ruwan Silva", closed: 12, avgDays: 21 },
  { agent: "Kamal Jayasuriya", closed: 9, avgDays: 27 },
  { agent: "Dilani Rathnayake", closed: 15, avgDays: 18 },
];

export function currency(n) {
  return "Rs. " + Number(n).toLocaleString("en-LK");
}

export function findListing(id) {
  return LISTINGS.find((l) => l.id === id);
}

export function findUser(id) {
  return USERS.find((u) => u.id === id);
}
