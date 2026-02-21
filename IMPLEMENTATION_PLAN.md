# JobFlow Implementation Plan

## Phase 1: Core Architecture & Setup
- **Framework:** Next.js 14 with React 18, utilizing the Pages router.
- **Styling:** Vanilla CSS with custom Tailwind-like utility classes and CSS variables for a comprehensive design styling.
- **Authentication:** Simulated OTP form with context-based login state.
- **Global State Context (`AppContext.js`):** Centralized state for user data, jobs, saved jobs, generated recruiters, message templates, analytics, and tracking progress.

## Phase 2: Landing Page Overhaul (Premium UI)
- **Aesthetic Direction:** Shift toward an AI startup vibe utilizing deep dark themes (`#070d1a` background), glassmorphism styling (`backdrop-filter`), abstract gradients, and grid overlays.
- **Copywriting:** Replaced highly technical jargon ("scraping", "crawling") with clean, service-oriented terminology ("Live Sync", "Account Aggregation", "Company Insights").
- **Co-Founders Section:** Add the executive team explicitly featuring Aditya Pareek, Sumit Goyal, and Chirag Ameta.
- **Billing & Pricing Modules:** Designed a seamless tier list mapping a Hybrid SaaS model with integrated simulation of a payment gateway (e.g., Stripe) using the custom `PaymentModal` component.

## Phase 3: Application Views & Modules
- **Layout Component:** Global layout with a responsive sidebar and a top bar featuring notifications and an avatar dropdown. Handles navigation between modules.
- **Live Job Sync Engine (`pages/job-scraper/index.js`):** Create an intuitive engine to mock fetching comprehensive job batches (powered by a generated synthetic script locally returning huge datasets for realistic UX). Includes progress loading bars and search capabilities.
- **Recruiter Enrichment Phase (`pages/recruiter-enrichment/index.js`):** Build a data ingestion view to process mocked hiring manager objects from job details. Include confidence meters and dummy profile extraction UI.
- **Outreach Creator Phase (`pages/outreach-creator/index.js`):** A side-by-side composer and template picker. Add mock AI improvement functionality for the drafted emails and LinkedIn messages before sending.
- **Dashboard & Tracking Views (`pages/dashboard` & `pages/tracking`):** Render SVG circular progress charts (`ProgressRing`) and Recharts charts (`BarChart`, `LineChart`) to depict job seeking funnels and reply rates. Make mock data dynamic by connecting it to `AppContext`.

## Phase 4: Refinement and Bug Fixing
- **Z-Index Layering:** Adjust topbar `relative z-[100]` properties so notification panels appear above sticky grids correctly.
- **Mock Fallback Handling:** Correctly inject defensive JS null checks (`job?.company`) while parsing data down to generated mock recruiters to prevent React hydration errors.
