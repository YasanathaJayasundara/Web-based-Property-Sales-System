import React, { useMemo, useState } from "react";
import { LISTINGS } from "../data/mockData";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const types = ["All", "House", "Apartment", "Land", "Commercial"];

  const filtered = useMemo(() => {
    let list = LISTINGS.filter((l) => l.status !== "Sold" || true); // keep sold visible but styled
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((l) => l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q));
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
  }, [query, type, maxPrice, sort]);

  return (
    <div>
      <div style={{ background: "var(--navy)", padding: "48px 0 40px" }}>
        <div className="container">
          <h1 style={{ color: "white" }}>Find your next property</h1>
          <p style={{ color: "var(--gold-light)", maxWidth: 560 }}>
            Browse verified listings from sellers and agents across the island &mdash; search by location, filter by type, and book a viewing in a few clicks.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: -28 }}>
        <div className="card card-pad">
          <div className="field-row" style={{ alignItems: "flex-end" }}>
            <div className="field" style={{ flex: 2 }}>
              <label htmlFor="q">Search</label>
              <input id="q" placeholder="Try “Colombo” or “beachfront”" value={query} onChange={(e) => setQuery(e.target.value)} />
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

      <div className="container page">
        <div className="flex-between mb-16">
          <h2 style={{ fontSize: "1.15rem" }}>{filtered.length} {filtered.length === 1 ? "property" : "properties"} found</h2>
        </div>

        {filtered.length === 0 ? (
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
