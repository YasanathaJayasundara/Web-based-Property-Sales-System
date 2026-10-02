import React, { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  getDashboardAnalytics,
  getAllReports,
  generateReport,
  updateReport,
  deleteReport,
  getReportExportUrl
} from "../data/reportPromoApi";
import { currency } from "../data/mockData";

const PIE_COLORS = ["#1b3946", "#c9a227", "#5c7a6b", "#8a9aa3", "#d9534f"];

export default function ReportsAnalytics() {
  const [range, setRange] = useState("6m");
  const [analytics, setAnalytics] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal state for generating reports
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    title: "",
    reportType: "SALES_SUMMARY",
    dateRangeStart: "2026-01-01",
    dateRangeEnd: "2026-12-31",
    notes: "",
  });

  // Selected report modal view
  const [selectedReport, setSelectedReport] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [analyticsData, reportsData] = await Promise.all([
        getDashboardAnalytics(range).catch(() => null),
        getAllReports().catch(() => [])
      ]);

      if (analyticsData) setAnalytics(analyticsData);
      setReports(reportsData || []);
    } catch (err) {
      setError(err.message || "Failed to load reports and analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [range]);

  async function handleGenerateSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const created = await generateReport({
        ...generateForm,
        generatedBy: "Shavindi T.D.P.",
      });
      setReports((prev) => [created, ...prev]);
      setSuccess(`Report "${created.title}" generated and saved successfully!`);
      setShowGenerateModal(false);
      setGenerateForm({
        title: "",
        reportType: "SALES_SUMMARY",
        dateRangeStart: "2026-01-01",
        dateRangeEnd: "2026-12-31",
        notes: "",
      });
    } catch (err) {
      setError(err.message || "Failed to generate report");
    }
  }

  async function handleDeleteReport(report) {
    if (!window.confirm(`Delete report "${report.title}"?`)) return;
    try {
      await deleteReport(report.id);
      setReports((prev) => prev.filter((r) => r.id !== report.id));
      setSuccess("Report deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete report");
    }
  }

  // Fallback metrics if analytics API is pending
  const totalRevenue = analytics?.totalRevenue ? Number(analytics.totalRevenue) : 58900000;
  const totalSales = analytics?.totalSales || 6;
  const activeListings = analytics?.activeListings || 12;
  const salesTrend = analytics?.salesTrend || [];
  const propertyTypes = analytics?.propertyTypeBreakdown || [];
  const agentPerformance = analytics?.agentPerformance || [];

  return (
    <div className="container page">
      <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="badge badge-accepted" style={{ marginBottom: 6, display: "inline-block" }}>
            Module 5 &middot; Shavindi T.D.P. (IT25200808)
          </span>
          <h1 style={{ margin: "4px 0" }}>Reports & Analytics Dashboard</h1>
          <p className="muted" style={{ margin: 0 }}>
            Platform-wide revenue intelligence, sales performance, agent activity, and custom report generator.
          </p>
        </div>

        <div className="flex gap-8" style={{ alignItems: "center" }}>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            style={{ padding: "0.5em 0.8em", border: "1px solid var(--border)", borderRadius: 7 }}
          >
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="12m">Last 12 months</option>
          </select>
          <button className="btn btn-gold" onClick={() => setShowGenerateModal(true)}>
            + Generate Custom Report
          </button>
        </div>
      </div>

      {success && (
        <div style={{ padding: "12px 16px", marginTop: 16, background: "#d1e7dd", color: "#0f5132", borderRadius: 8, fontWeight: 500 }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ padding: "12px 16px", marginTop: 16, background: "#f8d7da", color: "#842029", borderRadius: 8, fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Top Aggregates */}
      <div className="grid grid-3 mt-24">
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Total Revenue ({range})</p>
          <h2 style={{ margin: "4px 0 0", color: "var(--navy)" }}>{currency(totalRevenue)}</h2>
        </div>
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Properties Sold / Transactions</p>
          <h2 style={{ margin: "4px 0 0", color: "var(--gold)" }}>{totalSales}</h2>
        </div>
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Active Marketplace Listings</p>
          <h2 style={{ margin: "4px 0 0", color: "var(--green, #2e7d32)" }}>{activeListings}</h2>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-2 mt-24">
        <div className="card card-pad">
          <h3 style={{ margin: "0 0 12px" }}>Monthly Sales & Transaction Trend</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#1b3946" strokeWidth={2.5} name="Closed Sales" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="revenue" stroke="#c9a227" strokeWidth={2} name="Volume (M LKR)" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ margin: "0 0 12px" }}>Property Inventory by Type</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={propertyTypes} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={85} label={(d) => `${d.type} (${d.count})`}>
                  {propertyTypes.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card card-pad mt-24">
        <h3 style={{ margin: "0 0 12px" }}>Agent Performance Leaderboard</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={agentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="agent" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="closed" fill="#1b3946" name="Listings Closed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgDays" fill="#c9a227" name="Avg. Days to Sale" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Saved Reports CRUD Table */}
      <div className="flex-between mt-32 mb-16">
        <div>
          <h2 style={{ margin: "0 0 4px" }}>Generated & Saved Reports</h2>
          <p className="muted" style={{ margin: 0 }}>
            Saved reports generated by the platform administrator (Full CRUD).
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => setShowGenerateModal(true)}>
          + New Report
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="card card-pad center">
          <p className="muted">No saved reports yet.</p>
          <button className="btn btn-primary mt-8" onClick={() => setShowGenerateModal(true)}>
            Generate First Report
          </button>
        </div>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Report Title</th>
                <th>Type</th>
                <th>Audited Period</th>
                <th>Revenue Volume</th>
                <th>Status</th>
                <th>Generated By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.title}</strong>
                    {r.notes && <p className="muted" style={{ margin: "2px 0 0", fontSize: "0.78rem" }}>{r.notes}</p>}
                  </td>
                  <td>
                    <span className="badge badge-pending" style={{ fontSize: "0.75rem" }}>
                      {r.reportType?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="muted" style={{ fontSize: "0.85rem" }}>
                    {r.dateRangeStart || "All"} &rarr; {r.dateRangeEnd || "Present"}
                  </td>
                  <td>
                    <strong>{currency(r.totalRevenue || 0)}</strong>
                    <div className="muted" style={{ fontSize: "0.75rem" }}>{r.totalTransactions || 0} transactions</div>
                  </td>
                  <td>
                    <span className="badge badge-confirmed" style={{ fontSize: "0.75rem" }}>
                      {r.status}
                    </span>
                  </td>
                  <td className="muted" style={{ fontSize: "0.85rem" }}>
                    {r.generatedBy}
                  </td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-outline btn-sm" onClick={() => setSelectedReport(r)}>
                        View
                      </button>
                      <a
                        href={getReportExportUrl(r.id)}
                        download
                        className="btn btn-gold btn-sm"
                        style={{ textDecoration: "none" }}
                      >
                        Export CSV
                      </a>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReport(r)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16
        }}>
          <div className="card card-pad" style={{ width: "100%", maxWidth: 540, background: "white" }}>
            <div className="flex-between mb-16">
              <h2 style={{ margin: 0 }}>Generate Custom Analytical Report</h2>
              <button className="btn btn-outline btn-sm" onClick={() => setShowGenerateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleGenerateSubmit}>
              <div className="field">
                <label>Report Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Executive Sales Audit & Revenue Breakdown"
                  value={generateForm.title}
                  onChange={(e) => setGenerateForm({ ...generateForm, title: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Report Type *</label>
                <select
                  value={generateForm.reportType}
                  onChange={(e) => setGenerateForm({ ...generateForm, reportType: e.target.value })}
                >
                  <option value="SALES_SUMMARY">Sales & Transaction Summary</option>
                  <option value="PROPERTY_PERFORMANCE">Property Inventory & Type Performance</option>
                  <option value="AGENT_METRICS">Agent Conversion & Productivity Metrics</option>
                  <option value="REVENUE_ANALYSIS">Platform Revenue & Financial Flow Analysis</option>
                  <option value="PROMOTION_EFFECTIVENESS">Promotion & Ad Placement ROI</option>
                </select>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Date Range Start</label>
                  <input
                    type="date"
                    value={generateForm.dateRangeStart}
                    onChange={(e) => setGenerateForm({ ...generateForm, dateRangeStart: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Date Range End</label>
                  <input
                    type="date"
                    value={generateForm.dateRangeEnd}
                    onChange={(e) => setGenerateForm({ ...generateForm, dateRangeEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Executive Notes / Analysis Context</label>
                <textarea
                  rows={3}
                  placeholder="Add any contextual observations, goals, or remarks..."
                  value={generateForm.notes}
                  onChange={(e) => setGenerateForm({ ...generateForm, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-12 mt-16" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowGenerateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Compile & Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Report Detail Modal */}
      {selectedReport && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16
        }}>
          <div className="card card-pad" style={{ width: "100%", maxWidth: 600, background: "white" }}>
            <div className="flex-between mb-16">
              <h2 style={{ margin: 0 }}>Report Details (ID: {selectedReport.id})</h2>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedReport(null)}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <strong>Title:</strong> {selectedReport.title}
              </div>
              <div className="flex gap-16">
                <span><strong>Type:</strong> {selectedReport.reportType}</span>
                <span><strong>Status:</strong> {selectedReport.status}</span>
              </div>
              <div>
                <strong>Audited Period:</strong> {selectedReport.dateRangeStart || "All"} to {selectedReport.dateRangeEnd || "Present"}
              </div>
              <div>
                <strong>Revenue Analyzed:</strong> {currency(selectedReport.totalRevenue || 0)}
              </div>
              <div>
                <strong>Generated By:</strong> {selectedReport.generatedBy}
              </div>
              {selectedReport.notes && (
                <div>
                  <strong>Executive Notes:</strong>
                  <p style={{ margin: "4px 0 0", background: "#f8f9fa", padding: 8, borderRadius: 6 }}>
                    {selectedReport.notes}
                  </p>
                </div>
              )}
              {selectedReport.summaryDataJson && (
                <div>
                  <strong>Summary JSON Payload:</strong>
                  <pre style={{ background: "#222", color: "#33ff77", padding: 10, borderRadius: 6, fontSize: "0.75rem", overflowX: "auto" }}>
                    {selectedReport.summaryDataJson}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex gap-12 mt-16" style={{ justifyContent: "flex-end" }}>
              <a
                href={getReportExportUrl(selectedReport.id)}
                download
                className="btn btn-gold btn-sm"
                style={{ textDecoration: "none" }}
              >
                Export CSV
              </a>
              <button className="btn btn-primary btn-sm" onClick={() => setSelectedReport(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
