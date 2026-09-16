import React, { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { SALES_TREND, PROPERTY_TYPE_BREAKDOWN, AGENT_PERFORMANCE, LISTINGS, currency } from "../data/mockData";

const PIE_COLORS = ["#1b3946", "#c9a227", "#5c7a6b", "#8a9aa3"];

export default function ReportsAnalytics() {
  const [range, setRange] = useState("6m");
  const [exporting, setExporting] = useState(false);

  const totalRevenue = SALES_TREND.reduce((s, d) => s + d.revenue, 0);
  const totalSales = SALES_TREND.reduce((s, d) => s + d.sales, 0);
  const activeListings = LISTINGS.filter((l) => l.status !== "Sold").length;

  function handleExport() {
    setExporting(true);
    setTimeout(() => setExporting(false), 900);
  }

  return (
    <div className="container page">
      <div className="flex-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="muted">Platform-wide activity, sales performance, and agent metrics.</p>
        </div>
        <div className="flex gap-8">
          <select value={range} onChange={(e) => setRange(e.target.value)} style={{ padding: "0.5em 0.8em", border: "1px solid var(--border)", borderRadius: 7 }}>
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="12m">Last 12 months</option>
          </select>
          <button className="btn btn-gold" onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting\u2026" : "Export report"}
          </button>
        </div>
      </div>

      <div className="grid grid-3 mt-24">
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Total revenue ({range})</p>
          <h2 style={{ margin: "4px 0 0" }}>Rs. {totalRevenue.toFixed(1)}M</h2>
        </div>
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Properties sold ({range})</p>
          <h2 style={{ margin: "4px 0 0" }}>{totalSales}</h2>
        </div>
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Active listings</p>
          <h2 style={{ margin: "4px 0 0" }}>{activeListings}</h2>
        </div>
      </div>

      <div className="grid grid-2 mt-24">
        <div className="card card-pad">
          <h3>Monthly sales trend</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={SALES_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#1b3946" strokeWidth={2.5} name="Sales" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-pad">
          <h3>Property type breakdown</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={PROPERTY_TYPE_BREAKDOWN} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={85} label={(d) => d.type}>
                  {PROPERTY_TYPE_BREAKDOWN.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card card-pad mt-24">
        <h3>Agent performance</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={AGENT_PERFORMANCE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="agent" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="closed" fill="#1b3946" name="Listings closed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgDays" fill="#c9a227" name="Avg. days to sale" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
