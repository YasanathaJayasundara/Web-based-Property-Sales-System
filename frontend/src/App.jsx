import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyListings from "./pages/MyListings";
import AddEditListing from "./pages/AddEditListing";
import Appointments from "./pages/Appointments";
import Offers from "./pages/Offers";
import Payments from "./pages/Payments";
import Reviews from "./pages/Reviews";
import AdminDashboard from "./pages/AdminDashboard";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import Promotions from "./pages/Promotions";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Property Listing Management (Seller / Agent) */}
              <Route path="/my-listings" element={
                <ProtectedRoute roles={["SELLER", "AGENT"]}><MyListings /></ProtectedRoute>
              } />
              <Route path="/my-listings/new" element={
                <ProtectedRoute roles={["SELLER", "AGENT"]}><AddEditListing /></ProtectedRoute>
              } />
              <Route path="/my-listings/:id/edit" element={
                <ProtectedRoute roles={["SELLER", "AGENT"]}><AddEditListing /></ProtectedRoute>
              } />

              {/* Appointment Scheduling (Buyer / Agent) */}
              <Route path="/appointments" element={
                <ProtectedRoute roles={["BUYER", "AGENT"]}><Appointments /></ProtectedRoute>
              } />
              <Route path="/appointments/new" element={
                <ProtectedRoute roles={["BUYER"]}><Appointments /></ProtectedRoute>
              } />

              {/* Sales & Offer Management (Buyer / Seller) */}
              <Route path="/offers" element={
                <ProtectedRoute roles={["BUYER", "SELLER"]}><Offers /></ProtectedRoute>
              } />
              <Route path="/offers/new" element={
                <ProtectedRoute roles={["BUYER"]}><Offers /></ProtectedRoute>
              } />

              {/* User, Admin & Payment Management */}
              <Route path="/payments" element={
                <ProtectedRoute roles={["BUYER"]}><Payments /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>
              } />

              {/* Reviews, Ratings & Notifications (Buyer) */}
              <Route path="/reviews" element={
                <ProtectedRoute roles={["BUYER"]}><Reviews /></ProtectedRoute>
              } />

              {/* Reports & Analytics Dashboard (Admin) */}
              <Route path="/reports" element={
                <ProtectedRoute roles={["ADMIN"]}><ReportsAnalytics /></ProtectedRoute>
              } />

              {/* Advertisements & Promotions Management (Shavindi T.D.P. - Admin/Agent) */}
              <Route path="/promotions" element={
                <ProtectedRoute roles={["ADMIN", "AGENT"]}><Promotions /></ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
