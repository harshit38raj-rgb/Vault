# Vault — Personal Budget Tracker

A responsive, local-first Personal Budget Tracker built with **React 18**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **Recharts**.

---

## ⚡ Key Highlights & Architecture

### 1. Architecture & Data Model (Single Source of Truth)
- **Local-First State & Persistence:** Centralized React Context/Reducer synced to `localStorage` under the versioned key `budget_tracker_v1`.
- **Offline Reliability:** Instant read/write with zero remote telemetry or server round-trips.
- **Account & Mode Switcher:** Instant toggling between **Alex Rivera (Pro User)** and **Guest Explorer (Demo Mode)**.
- **Multi-Currency System:** Dynamic currency formatting powered by `Intl.NumberFormat` supporting `USD`, `INR`, `EUR`, `GBP`, `JPY`, `CAD`, and `AUD`.
- **Data Sovereignty:** Single-click JSON backup export and schema-validated JSON import. Safe reset to default pre-seeded state.
- **Dynamic Derived Calculations:** All KPIs, charts, and budget progress bars derive directly from the active month's `transactions` collection. Includes 22 pre-seeded realistic transactions across the past 3 months.

### 2. Design System & Design Tokens
- **Dark Mode (Default) & Light Mode:**
  - **Dark Canvas:** `#070B14`, **Card Surface:** `#0F1629`, **Border:** `rgba(255,255,255,0.08)`, **Primary Text:** `#F8FAFC`, **Muted Text:** `#94A3B8`.
  - **Light Canvas:** `#F8FAFC`, **Card Surface:** `#FFFFFF`, **Border:** `#E2E8F0`, **Soft Shadow:** `0 4px 20px rgba(15,23,42,0.06)`.
  - **Semantic Accents:**
    - Electric purple: `#8B5CF6` (primary CTAs, savings goals, brand highlights)
    - Lime-green: `#84CC16` (income, positive margins)
    - Amber: `#F59E0B` (80%+ budget alert warning)
    - Coral: `#F43F5E` (expense, 100%+ budget alert)
- **Typography:**
  - Headings & KPI Figures: `Plus Jakarta Sans`
  - Body & Data Tables: `Inter`
  - Strict `tabular-nums` formatting on all financial figures and currency metrics.
- **Restrained Glassmorphism:**
  - `backdrop-blur-md` applied selectively to sticky headers, floating drawers/modals, and the Hero Net Balance card.
  - Solid card surfaces for tables and form inputs for high legibility and contrast.
- **Motion & Accessibility:**
  - Smooth `200ms cubic-bezier(0.16, 1, 0.3, 1)` transitions.
  - Full support for `prefers-reduced-motion`.
  - Full keyboard control (`Esc` dismisses drawers and modals; comprehensive `aria-label`s on icon-only buttons).

---

## 📱 Responsive Layout & Views

1. **Navigation Architecture:**
   - **Desktop (>= 768px):** Fixed 240px left sidebar with quick "+ New Transaction" CTA, brand badge, and user switch footer.
   - **Mobile (< 768px):** Sticky bottom navigation bar, top header with month selector, and a floating action button (`+ Add`).

2. **Top Bar:**
   - Month/Year selector dropdown (filters all dashboard views to the chosen calendar cycle).
   - Theme toggle (Sun / Moon).
   - Currency switcher indicator.
   - User profile / Guest demo badge.

3. **Views:**
   - **Overview:**
     - Hero Net Balance card with month-over-month (MoM) % change and savings efficiency.
     - 3 KPI cards: Total Income, Total Expenses, Savings Rate.
     - Income vs. Expense Area Chart (daily cash flow across month).
     - Spending by Category Donut Chart (Recharts) with color legend and percentages.
     - Budget alert banners for categories at or above 80% (amber) and 100% (coral).
     - 5 most recent transactions with quick jump to full activity log.
   - **Transactions:**
     - Slide-over drawer with strict field validation (amount > 0, valid date, required category).
     - Instant real-time text search (category, note, payment method, amount).
     - Filter by type (`All`, `Income`, `Expense`), category, and time scope (`Current Month`, `All Time`).
     - Column sorting by Date, Amount, or Category.
     - CSV export (`vault_transactions_YYYY-MM.csv`).
     - Delete with non-destructive **Undo Toast**.
     - Responsive rendering: Solid data table on desktop; stacked visual cards on mobile.
   - **Budgets & Goals:**
     - Category budget cards with animated progress bars (shifting to amber at 80% and coral at 100%).
     - Inline limit editing (quick click to edit limit without leaving view).
     - Savings goal cards with target dates, remaining countdown, and quick `+ Contribute` modal.
   - **Analytics:**
     - 6-Month Income vs. Expense comparison bar chart.
     - Top spending categories ranked breakdown.
     - Average daily spend metric and end-of-month projected run-rate.
     - Financial health scorecard (50/30/20 rule, savings rate, cash flow ratio).
   - **Settings:**
     - Primary currency selector (`USD`, `INR`, `EUR`, `GBP`, `JPY`, `CAD`, `AUD`).
     - Demo profile switcher.
     - Export & Import JSON backup.
     - Reset to sample data with interactive confirmation.

---

## 🛠️ Local Development & Scripts

To run the project locally:

```bash
# Navigate to project directory
cd /Users/harshitraj/.gemini/antigravity/scratch/budget-tracker

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```
