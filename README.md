# Web-based-Property-Sales-System



Viewed walkthrough.md:100-116

Edited walkthrough.md



\### System Check \& Verification Report



Your entire \*\*Web-based Property Sales System\*\* has been started and checked end-to-end. Both the \*\*Spring Boot backend\*\* and the \*\*React frontend\*\* are actively running, connected to \*\*Microsoft SQL Server (SSMS 22)\*\* on `localhost\\SQLEXPRESS`.



\---



\### 1. Active Server Instances



| Component | URL | Status | Description |

|---|---|---|---|

| \*\*Full-Stack Integrated App\*\* | \*\*\[http://localhost:8080](http://localhost:8080)\*\* | `RUNNING` | Spring Boot serving all REST APIs + production React UI bundle |

| \*\*Frontend Dev Server\*\* | \*\*\[http://localhost:5173](http://localhost:5173)\*\* | `RUNNING` | Vite development server with Hot Module Replacement \& API reverse proxy |

| \*\*SQL Server Database\*\* | `localhost\\SQLEXPRESS` (1433) | `CONNECTED` | Database `PropertySalesDB` (11 tables populated with seed data) |



\---



\### 2. End-to-End 4-CRUD Verification Results



An automated test suite (\[test\_crud\_suite.ps1](file:///f:/Yasantha%20Jayasundara/SLIIT%20Docs/Notes/SLIIT/Y2S1/SE/project/web%20based%20property%20sales%20system/test\_crud\_suite.ps1)) was executed directly against the live backend and database. \*\*All 6 group modules passed 100% of Create, Read, Update, and Delete operations\*\*:



```

=================================================================

&#x20;EXECUTING COMPLETE CRUD VERIFICATION SUITE ACROSS ALL 6 PARTS   

=================================================================



>>> \[PART 5] SHAVINDI T.D.P.: PROMOTIONS \& REPORTS CRUD

&#x20;\[C] Created Promo ID: 5 - Code: MONSOON10

&#x20;\[R] Read Promo: Monsoon Special Discount (ACTIVE)

&#x20;\[U] Updated Promo Title: Monsoon Mega Saver 15, Discount: 15%

&#x20;\[V] Promo Validation: Valid=True, Discount=Rs. 7500000.00, Net Price=Rs. 42500000.00

&#x20;\[D] Deleted Test Promo ID: 5

&#x20;\[C] Generated Report ID: 5, Type: SALES\_SUMMARY

&#x20;\[R] Read Report: Quarterly Property Sales Audit (Total Deals: 1)

&#x20;\[U] Updated Report Status: FINALIZED, Notes: Audit Finalized

&#x20;\[R] Exported CSV successfully: 251 bytes received

&#x20;\[R] Analytics Dashboard: Revenue=Rs. 2600000.00, Deals=1

&#x20;\[D] Deleted Test Report ID: 5



>>> \[PART 1] JAYASUNDARA J.M.Y.V.: PROPERTY LISTING CRUD

&#x20;\[C] Created Property ID: 14 - Title: Havelock City Luxury Apartment

&#x20;\[R] Read Property: Havelock City Luxury Apartment - Price: Rs. 68000000.00

&#x20;\[U] Updated Property Price to Rs. 65000000.00

&#x20;\[D] Deleted Test Property ID: 14



>>> \[PART 2] HESHAN I.A.M.: REVIEWS \& NOTIFICATIONS CRUD

&#x20;\[C] Created Review ID: 6 - Rating: 5 stars

&#x20;\[R] Read Review: 'Outstanding property condition and responsive agent.'

&#x20;\[U] Updated Review with Agent Reply: 'Thank you Nimal! It was a pleasure assisting you.'

&#x20;\[D] Deleted Test Review ID: 6

&#x20;\[R] Buyer Notifications retrieved: 8 records



>>> \[PART 3] RANDIL B.R.K.: APPOINTMENT SCHEDULING CRUD

&#x20;\[C] Created Appointment ID: 6 - Date: 2026-10-15 at 14:00

&#x20;\[R] Read Appointment: Ocean View Luxury Villa for Nimal Perera (PENDING)

&#x20;\[U] Rescheduled Appointment to 2026-10-16 15:30 - Status: CONFIRMED

&#x20;\[D] Deleted Test Appointment ID: 6



>>> \[PART 4] HALANGODA R.W.W.M.M.C.: SALES \& OFFER MANAGEMENT CRUD

&#x20;\[C] Created Offer ID: 5 - Amount: Rs. 82000000.00

&#x20;\[R] Read Offer: Property 'Cinnamon Gardens Penthouse' - Status: PENDING

&#x20;\[U] Countered Offer ID: 5 - New Counter Amount: Rs. 83500000.00 (COUNTERED)

&#x20;\[D] Deleted Test Offer ID: 5



>>> \[PART 6] WANNIARACHCHI W.K.A.N.: USERS \& PAYMENTS CRUD

&#x20;\[C] Registered User ID: 9 - Name: Test New Investor (BUYER)

&#x20;\[R] Read User: investor\_test@example.com - Active: ACTIVE

&#x20;\[U] Updated User Name: Test Verified Investor, Phone: 0777777777

&#x20;\[C] Processed Payment ID: 4 - Receipt: RCPT-9298 - Status: COMPLETED

&#x20;\[R] Read Payment: Amount Rs. 500000.00, Status: COMPLETED

&#x20;\[U] Updated Payment Status to: REFUNDED

&#x20;\[D] Deleted Test Payment ID: 4

&#x20;\[D] Deleted Test User ID: 9



=================================================================

&#x20;ALL 6 CRUD MODULES TESTED AND PASSED 100% SUCCESFULLY!          

=================================================================

```



\---



\### 3. Highlights of Shavindi T.D.P.'s Module (Part 5)



1\. \*\*Advertisements \& Promotions Management\*\* (`/promotions`):

&#x20;  - \*\*Create\*\*: Add campaigns with promo code, discount (% or fixed LKR), placement (hero banner, sidebar, featured), dates, and banner image.

&#x20;  - \*\*Read\*\*: Live KPI cards (Active campaigns, total impressions, clicks, average CTR) and active banners on the home page.

&#x20;  - \*\*Update\*\*: Edit campaigns and toggle Pause/Active status.

&#x20;  - \*\*Delete\*\*: Remove promotions with confirmation.

&#x20;  - \*\*Promo Simulator \& Code Validator\*\*: Live discount calculation on checkout/detail pages.



2\. \*\*Reports \& Analytics Management\*\* (`/reports`):

&#x20;  - \*\*Create\*\*: Generate customized analytical reports (`SALES\_SUMMARY`, `PROPERTY\_PERFORMANCE`, `AGENT\_METRICS`, `REVENUE\_ANALYSIS`, `PROMOTION\_EFFECTIVENESS`).

&#x20;  - \*\*Read\*\*: Live interactive charts (`Recharts`) showing revenue trends, property distribution, and agent leaderboards.

&#x20;  - \*\*Update\*\*: Update report status (`DRAFT`, `FINALIZED`, `ARCHIVED`) and executive notes.

&#x20;  - \*\*Delete\*\*: Archive/delete saved reports.

&#x20;  - \*\*CSV Export\*\*: Direct one-click download via `/api/reports/{id}/export`.



\---



\### 4. Demo Login Accounts



| Role | Email | Password |

|---|---|---|

| \*\*Admin\*\* | `admin@propertysales.lk` | `admin123` |

| \*\*Agent / Seller\*\* | `kamal@realtors.lk` | `agent123` |

| \*\*Buyer\*\* | `nimal@example.com` | `buyer123` |

| \*\*Reports \& Promotions (Shavindi T.D.P.)\*\* | `shavindi@propertysales.lk` | `shavindi123` |



For full setup documentation, SSMS 22 connection details, and step-by-step guides, refer to the \[walkthrough.md](file:///C:/Users/Yasantha%20jayasundara/.gemini/antigravity/brain/d30f8365-9664-480a-9964-746f5cea3b31/walkthrough.md) and \[SSMS\_22\_Connection\_Guide.md](file:///f:/Yasantha%20Jayasundara/SLIIT%20Docs/Notes/SLIIT/Y2S1/SE/project/web%20based%20property%20sales%20system/database/SSMS\_22\_Connection\_Guide.md).

