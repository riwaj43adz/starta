# STRATA: Performance Intelligence Platform

> *"A record of becoming, not a tracker of tasks."*

STRATA is a production-grade, enterprise performance management interface designed to fundamentally shift how organizations track employee achievement. Instead of treating performance reviews as a chaotic, once-a-year administrative burden, STRATA treats them as a living, continuous sedimentary record.

## Philosophy
STRATA is built on the concept of **geological strata**. Every quarter, employees check in and add their metrics alongside qualitative "Context Notes." Over time, these check-ins form layers of a stratum. Deep, solid colors represent exceptional execution, while lighter, thinner layers highlight areas of growth. 

It ensures that the context behind a number—the "why"—is permanently filed and never summarized away.

## Key Modules

### 1. The Goal Canvas
Employees define what they want to be known for this year. They construct their canvas by allocating a total of 100% weight across multiple thrust areas (e.g., Product Excellence, Team Leadership). The interface strictly enforces weightage validation before submission.

### 2. The Manager Lens (Approvals)
Managers view their team's submitted canvases through a dedicated lens. They can approve the canvas outright or return it for revision, attaching mandatory context notes to guide the employee's adjustments. 

### 3. Quarterly Check-ins & My Strata
The core dashboard where employees update their progress. Each check-in visually grows the employee's stratum. The platform supports various Units of Measurement (UoM) including `numeric_max`, `numeric_min`, `timeline`, and `zero_based`.

### 4. The Map Room (Admin & Analytics)
A birds-eye view of the organization's terrain. 
- **Strata Intelligence:** Features simulated AI integration that analyzes an employee's context notes alongside their scores to provide out-of-the-box behavioral and performance recommendations.
- **Team Heatmaps & Radar Charts:** Deep visual analytics mapping individual competency against team averages.

## Technical Architecture

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Vanilla CSS Variables (Fully Adaptive Light/Dark Mode)
* **Animation:** Framer Motion (for cinematic layer ceremonies and micro-interactions)
* **State Management & Persistence:** Zustand with LocalStorage (ensuring real data flow across modules without a backend)
* **Data Visualization:** Recharts (Radar, Area, Bar charts)

## Running Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Design System
STRATA utilizes a highly custom, semantic design token system mapped in `globals.css`. It heavily leans into organic, parchment-inspired colors in Light Mode, and sleek, high-contrast dark surfaces in Dark Mode. All components seamlessly adapt between the two states without relying on hardcoded hex values.
