# STRATA: Performance Intelligence Platform

> *"A record of becoming, not a tracker of tasks."*

![STRATA Architecture](https://via.placeholder.com/1200x400/0D0D0E/E8A23A?text=STRATA+Performance+Intelligence)

STRATA is a production-grade, enterprise performance management interface designed to fundamentally shift how organizations track employee achievement. Instead of treating performance reviews as a chaotic, once-a-year administrative burden, STRATA treats them as a living, continuous sedimentary record. It merges behavioral psychology, elegant UI/UX design, and robust front-end engineering to create an experience that feels organic, human, and professional.

---

## 📖 The Core Philosophy: Geological Strata

In most organizations, performance reviews are highly stressful events characterized by recency bias and subjective summarization. A year of hard work is often condensed into a single numeric rating, losing all context of the struggle, the pivots, and the nuanced achievements.

STRATA is built on the concept of **geological strata**. Every quarter, employees check in and add their metrics alongside qualitative "Context Notes." Over time, these check-ins form layers of a stratum. 
- **Deep, solid layers** represent exceptional execution and milestone achievements.
- **Lighter, thinner layers** highlight areas of growth, challenging quarters, or foundational work that has yet to yield numerical success.

By visualizing performance as sedimentary layers, STRATA ensures that the context behind a number—the "why"—is permanently filed, never overwritten, and never summarized away. 

---

## ✨ Comprehensive Feature Breakdown

STRATA is divided into four primary modules, each catering to a distinct user persona (Employee, Manager, HR Admin).

### 1. The Goal Canvas (Employee View)
The foundation of the year. Employees define what they want to be known for.
- **Intention Statement:** A qualitative opening statement priming the manager on the employee's overarching goal for the year.
- **Thrust Areas:** Goals are categorized into strategic buckets (e.g., *Product Excellence*, *Team Leadership*, *Process Improvement*).
- **Weightage Allocation:** Employees must distribute exactly 100% weight across their goals. The system dynamically prevents submission if a goal is underweight (<10%) or if the total does not equal exactly 100%.
- **Multiple Measurement Types:** Support for various Units of Measurement (UoM) including `numeric_max` (higher is better), `numeric_min` (lower is better), `timeline` (milestone-based), and `zero_based` (target zero incidents).

### 2. The Manager Lens (Manager View)
A focused environment for leaders to review, shape, and approve their team's intentions.
- **Pending Approvals:** Managers view their team's submitted canvases through a dedicated, streamlined lens.
- **Return with Context:** If a canvas needs adjustment, the manager cannot simply reject it. They are required to attach a mandatory context note to guide the employee's revisions, fostering continuous dialogue.
- **Quiet Acknowledgments:** When an action occurs (like an approval), the employee receives a sleek, non-intrusive notification acknowledging that they were "read, not just processed."

### 3. Quarterly Check-ins & My Strata (Core Dashboard)
The dashboard where employees update their progress throughout the year.
- **Real-time Stratum Generation:** Each check-in visually grows the employee's stratum. The interface uses Framer Motion to smoothly animate the physical "sediment" of their progress.
- **Context Preservation:** Employees write "What the numbers don't capture" for each quarter. This is archived permanently.
- **Sparkline Trajectory:** A beautiful, responsive Recharts area graph maps the employee's score trajectory over multiple quarters.

### 4. The Map Room (Admin & Analytics)
A birds-eye view of the organization's terrain for HR Business Partners and Executives.
- **Strata Intelligence Engine:** A simulated AI integration that analyzes an employee's context notes alongside their quantitative scores to provide out-of-the-box behavioral and performance recommendations. For example, it can detect if high execution scores correlate with burnout indicators in the context notes.
- **Team Heatmaps:** Deep visual analytics mapping individual competency across multiple quarters against the team average.
- **Competency Radar Charts:** Spider charts visualizing a team member's specific strengths in thrust areas compared to the organization's baseline.

---

## 🛠 Technical Architecture & Stack

STRATA is engineered using modern, production-ready frontend technologies, prioritizing performance, accessibility, and dynamic aesthetics.

### Core Stack
* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) - Utilizing Server Components and modern routing paradigms for optimal performance.
* **Language:** [TypeScript](https://www.typescriptlang.org/) - Strict typing across all data models (`GoalSheet`, `QuarterlyUpdate`, `PreMeetingBrief`) to ensure UI stability.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) paired with highly customized Vanilla CSS Variables. 
* **Animation:** [Framer Motion](https://www.framer.com/motion/) - Powers the cinematic layer ceremonies, hover states, and dynamic chart loading.
* **Data Visualization:** [Recharts](https://recharts.org/) - Fully responsive, customized SVG charts (Radar, Area, Bar) integrated seamlessly with the design token system.

### Persistent State Engine (Zustand)
STRATA does not rely on a static mock file. It utilizes a fully functional, browser-based database using **Zustand** coupled with `persist` middleware (saving to `localStorage`). 
This means you can run through an entire performance cycle locally:
1. An employee creates a Canvas.
2. The Manager sees it in their pending queue and approves it.
3. The Employee submits a Q3 check-in.
4. The Analytics dashboard updates in real-time.
All state is preserved across page reloads, acting as a complete localized backend.

### Advanced Design System & Theming
STRATA features a completely adaptive Light and Dark mode engine.
- **Dark Mode:** Utilizes deep, rich slates (`#0D0D0E`), elevated surfaces, and glowing amber accents (`#E8A23A`) to create a focused, premium cinematic feel.
- **Light Mode (Parchment):** Transitions to a soft, organic aesthetic using sand (`#F5F0E8`) and clay (`#7A5C3E`) tones, mimicking the feel of physical, high-quality archival paper.
- **Semantic Tokens:** Every component is built using semantic CSS variables (e.g., `var(--surface-0)`, `var(--text-primary)`, `var(--brand-amber)`) rather than hardcoded hex values, ensuring perfect contrast and accessibility regardless of the active theme.

---

## 🚀 Getting Started

To run STRATA locally and experience the platform, follow these steps:

### Prerequisites
- Node.js 18.x or higher
- npm or yarn or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/starta.git
   cd starta
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Experience the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser. 
   *Tip: Use the landing page to switch between different personas (Employee, Manager, Admin) to see how the dashboard dynamically adapts its views and data access.*

---

## 📂 Directory Structure

```text
strata/
├── app/
│   ├── (app)/
│   │   ├── analytics/        # AI Insights & Recharts Dashboards
│   │   ├── canvas/           # Goal setting and Weightage allocator
│   │   ├── check-in/         # Quarterly updates and scoring
│   │   ├── lens/             # Manager views and approvals
│   │   ├── map-room/         # Admin overview and org terrain
│   │   └── my-strata/        # The primary employee dashboard
│   ├── login/                # Persona switcher and landing page
│   ├── globals.css           # Core design token system
│   └── layout.tsx            # Root layout and theme provider
├── components/
│   ├── strata/               # Bespoke performance components
│   │   ├── LayerCeremony.tsx # Full-screen animation for submissions
│   │   ├── StratumBar.tsx    # Visualizes the sedimentary layers
│   │   ├── GoalCard.tsx      # Interactive goal representation
│   │   └── ...
│   └── ui/                   # Reusable base UI elements
├── lib/
│   ├── data/
│   │   └── seed.ts           # Initial bootstrapping data
│   ├── store/
│   │   ├── useDataStore.ts   # Persistent Zustand DB engine
│   │   ├── useGoalStore.ts   # Ephemeral draft state for canvas creation
│   │   └── useUserStore.ts   # Persona and auth state
│   ├── utils/
│   │   └── scoring.ts        # The math engine converting updates to depth
│   └── types.ts              # Global TypeScript interfaces
└── public/                   # Static assets
```

---

## 🛡 Security & Extensibility

While STRATA currently operates via a robust client-side storage engine, its architecture is decoupled and perfectly primed for backend integration.
- The `useDataStore.ts` file acts as the primary data boundary. To migrate to a production database (like Supabase, PostgreSQL, or MongoDB), developers simply need to swap the Zustand mutations with async API calls, leaving the entire UI and business logic layer completely intact.

---

## 📜 License

This project is intended for internal enterprise demonstration and is currently proprietary. All rights reserved.
