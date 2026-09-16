# Haven — Property Sales System Frontend

React frontend for the **Web-based Property Sales System** (SE2030 group project),
built to sit in front of the Spring Boot + MySQL backend shown in the architecture
diagram: **React → Spring Boot → MySQL**.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173. No backend is required to try it out — see
**Demo mode** below.

## Demo mode (no backend yet)

Since the Spring Boot API isn't built yet, `src/data/mockData.js` simulates the
database with in-memory sample data (listings, users, offers, appointments,
payments, reviews). The whole app runs against this mock layer so it can be
developed, demoed, and tested independently of the backend.

Log in with any of these demo accounts (any password works):

| Role | Email |
|---|---|
| Buyer | amara.buyer@example.com |
| Seller | nadeesha.seller@example.com |
| Agent | ruwan.agent@example.com |
| Admin | admin@haven.lk |

**Swapping in the real backend:** once the Spring Boot REST API exists, replace
the imports from `src/data/mockData.js` in each page with real `fetch()` /
`axios` calls to the corresponding endpoints (e.g. `GET /api/listings`,
`POST /api/offers`), and swap `AuthContext`'s mock `login()` for a real
`POST /api/auth/login` call. No page structure needs to change — only the
data-fetching layer.

## Project structure

```
src/
  main.jsx              entry point
  App.jsx                all routes
  index.css              design tokens + global styles
  context/
    AuthContext.jsx       mock role-based auth
  data/
    mockData.js            in-memory data standing in for the backend
  components/
    Navbar.jsx, Footer.jsx, ListingCard.jsx, StarRating.jsx, ProtectedRoute.jsx
  pages/
    Home.jsx                     Browse & Search Listings
    ListingDetail.jsx             Property detail, reviews, entry points
    Login.jsx / Register.jsx      Auth
    MyListings.jsx                 } Property Listing Management
    AddEditListing.jsx             }  (Member 1)
    Reviews.jsx                    } Reviews, Ratings & Notifications
    (review display in ListingDetail) }  (Member 2)
    Appointments.jsx                Appointment Scheduling (Member 3)
    Offers.jsx                      Sales & Offer Management (Member 4)
    ReportsAnalytics.jsx            Reports & Analytics Dashboard (Member 5)
    Profile.jsx, Payments.jsx,      User, Admin & Payment Management
    AdminDashboard.jsx                (Member 6)
```

## Design system

Colors, fonts, and component styles are defined as CSS custom properties in
`src/index.css`, carried over from the project's report/slide branding:

- **Navy** `#1b3946` — primary
- **Gold** `#c9a227` — accent
- **Cream** `#faf9f6` — background
- **Sage** `#5c7a6b` — success / secondary accent
- Headings: Cambria (serif) · Body: Inter (sans-serif)

## Tech stack

- React 18 + React Router 6
- Vite (build tool)
- Recharts (Reports & Analytics charts)
- Plain CSS (no framework) — see `src/index.css`

## Next steps for the team

1. Build the Spring Boot backend per the six modules above.
2. Replace `mockData.js` reads with real API calls.
3. Add real image upload (Add/Edit Listing currently simulates this).
4. Add a real payment gateway integration (sandbox/test mode) in `Payments.jsx`.
5. Add real authentication (JWT or session-based) in `AuthContext.jsx`.
