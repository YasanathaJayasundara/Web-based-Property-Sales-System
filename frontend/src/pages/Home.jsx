import React, { useEffect, useMemo, useState } from "react";
import { getAllProperties } from "../data/propertyApi";
import { getActivePromotions, trackPromoClick, trackPromoImpression } from "../data/reportPromoApi";
import { LISTINGS } from "../data/mockData";
import ListingCard from "../components/ListingCard";
import { Link } from "react-router-dom";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const types = ["All", "House", "Apartment", "Land", "Commercial"];

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [propsData, promosData] = await Promise.all([
          getAllProperties().catch(() => null),
          getActivePromotions().catch(() => [])
        ]);

        if (propsData && propsData.length > 0) {
          // Normalize properties to match ListingCard expectations
          const formatted = propsData.map((p) => ({
            id: p.id,
            ownerId: p.sellerId ? "u" + p.sellerId : "u2",
            title: p.title,
            price: Number(p.price) || 0,
            location: p.location + (p.city ? `, ${p.city}` : ""),
            type: p.propertyType,
            bedrooms: p.bedrooms || 0,
            bathrooms: p.bathrooms || 0,
            area: p.area || 0,
            status: p.status === "PUBLISHED" ? "Available" : p.status,
            description: p.description,
            photos: p.imageUrl ? [p.imageUrl] : (p.images?.map(i => i.imageUrl) || ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]),
            agentId: "u3",
          }));
          setProperties(formatted);
        } else {
          setProperties(LISTINGS);
        }

        if (promosData && promosData.length > 0) {
          setPromotions(promosData);
          trackPromoImpression(promosData[0].id);
        }
      } catch (err) {
        console.warn("Failed to fetch from backend, using sample listings:", err);
        setProperties(LISTINGS);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const activePromo = promotions.length > 0 ? promotions[activeBannerIndex % promotions.length] : null;

  function handlePromoClick(promo) {
    if (promo?.id) {
      trackPromoClick(promo.id);
    }
  }

  const filtered = useMemo(() => {
    let list = properties.filter((l) => l.status !== "Sold" || true);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((l) => (l.title || "").toLowerCase().includes(q) || (l.location || "").toLowerCase().includes(q));
    }
    if (type !== "All") {
      list = list.filter((l) => l.type === type);
    }
    if (maxPrice) {
      list = list.filter((l) => l.price <= Number(maxPrice));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [properties, query, type, maxPrice, sort]);

  return (
    <div>
      {/* Active Promotion Hero Carousel Banner (Module 5: Shavindi T.D.P.) */}
      {activePromo && (
        <div style={{
          background: "linear-gradient(90deg, #1b3946 0%, #295163 100%)",
          color: "white",
          padding: "16px 0",
          borderBottom: "3px solid var(--gold)"
        }}>
          <div className="container flex-between" style={{ alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div className="flex gap-12" style={{ alignItems: "center" }}>
              <span style={{
                background: "var(--gold)",
                color: "#1b3946",
                fontWeight: 800,
                fontSize: "0.75rem",
                padding: "4px 8px",
                borderRadius: 4,
                textTransform: "uppercase"
              }}>
                Special Offer
              </span>
              <div>
                <strong style={{ fontSize: "1.05rem" }}>{activePromo.title}</strong>
                <span className="muted" style={{ color: "#dbe4e8", marginLeft: 8, fontSize: "0.9rem" }}>
                  Use code <code style={{ background: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: 4, color: "var(--gold)", fontWeight: 700 }}>{activePromo.promoCode}</code> for {activePromo.discountType === "PERCENTAGE" ? `${activePromo.discountValue}% OFF` : `Rs. ${Number(activePromo.discountValue).toLocaleString()} OFF`}!
                </span>
              </div>
            </div>
            <div className="flex gap-8" style={{ alignItems: "center" }}>
              {promotions.length > 1 && (
                <button
                  className="btn btn-outline btn-sm"
                  style={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}
                  onClick={() => setActiveBannerIndex((prev) => (prev + 1) % promotions.length)}
                >
                  Next Promo &rarr;
                </button>
              )}
              {activePromo.targetUrl && (
                <Link
                  to={activePromo.targetUrl}
                  className="btn btn-gold btn-sm"
                  onClick={() => handlePromoClick(activePromo)}
                >
                  Claim Offer
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div style={{ background: "var(--navy)", padding: "48px 0 40px" }}>
        <div className="container">
          <h1 style={{ color: "white" }}>Find your next property</h1>
          <p style={{ color: "var(--gold-light)", maxWidth: 560 }}>
            Browse verified listings from sellers and agents across Sri Lanka &mdash; search by location, filter by type, negotiate offers, and book viewings online.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="container" style={{ marginTop: -28 }}>
        <div className="card card-pad">
          <div className="field-row" style={{ alignItems: "flex-end" }}>
            <div className="field" style={{ flex: 2 }}>
              <label htmlFor="q">Search</label>
              <input id="q" placeholder="Try “Colombo”, “Nugegoda” or “Apartment”" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="type">Property type</label>
              <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="maxPrice">Max price (Rs.)</label>
              <input id="maxPrice" type="number" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="sort">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Property Results */}
      <div className="container page">
        <div className="flex-between mb-16">
          <h2 style={{ fontSize: "1.15rem" }}>
            {filtered.length} {filtered.length === 1 ? "property" : "properties"} available
          </h2>
          <Link to="/promotions" className="muted" style={{ fontSize: "0.85rem", textDecoration: "none" }}>
            View All Promos & Advertisements &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="card card-pad center">Loading properties from database...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state card card-pad">
            <h3>No properties match your search</h3>
            <p>Try widening your price range or clearing the search filters.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}
