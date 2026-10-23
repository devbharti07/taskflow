# TaskFlow Pro — Modern Task Management & Productivity SaaS

TaskFlow Pro is a full-featured, visually polished To-Do and task management web application crafted with **React 19**, **Vite**, **Lucide Icons**, **Recharts**, and **Custom CSS3**. Built to simulate a production-grade productivity SaaS application, it features dynamic analytics, category grouping, priority tags, full dark/light theme support, automated unit tests, and persistent local storage.

---

## 🌟 Key Features

### 1. Dashboard Overview
- **Dynamic Greetings**: Welcoming headline that dynamically adapts to the current time of day (*Good morning*, *Good afternoon*, *Good evening*).
- **Metric Cards**: Dynamic statistics calculating **Total Tasks**, **Completed Tasks**, **Pending Tasks**, and **Overdue Tasks**.
- **Interactive Visualizations**:
  - **Weekly Productivity Bar Chart** powered by Recharts (tasks created vs. completed across the last 7 days).
  - **Category Distribution Donut Chart** visualizing focus areas.
- **Priority Widgets**:
  - Live tasks due today with direct completion checkboxes.
  - Upcoming deadlines with chronological badging.

### 2. Complete Task Operations
- **Comprehensive Fields**:
  - Title (validated, required, prevents empty/whitespace-only input).
  - Description (optional detailed notes).
  - Category (`College`, `Personal`, `Work`, `Study`, `Projects`, `Other`).
  - Priority (`High`, `Medium`, `Low`).
  - Due Date & Due Time with 12h/24h conversion and countdown badges.
  - Starred / Important status toggle.
  - Created, Updated, and Completed timestamps.
- **Micro-Interactions**: Smooth card completion animations and celebratory confetti particle burst.
- **Confirmation Guards**: Modal confirmation protection before permanent task deletion.

### 3. "My Tasks" Management Page
- **Quick Status Tabs**: All, Pending, Completed, Important, and Overdue.
- **Real-Time Search**: Instant fuzzy matching across titles and descriptions.
- **Multi-Facet Filters**: Filter simultaneously by Category, Priority, Completion Status, and Due Date Presets.
- **Flexible Sorting**: Sort by Newest, Oldest, Due Date (Soonest), Priority (High to Low), or Alphabetically.
- **Dual View Modes**: Switch between **Grid View** and **List View** with one click.
- **Clear Filters**: One-click reset button when filters are active.

### 4. Dedicated Agenda & Views
- **Today's Agenda**: Dedicated view separating tasks due today into Pending and Completed.
- **Upcoming Schedule**: Chronologically grouped tasks (*Tomorrow*, *Later This Week*, *Next Week*, *Later*).
- **Important**: Dedicated view for starred, high-priority tasks.
- **Completed Archive**: History of finished tasks with completion timestamps and options to restore or bulk clear.
- **Category Portals**: Category summary cards displaying live task counts with single-click filtered drill-down.

### 5. Settings, Theming & Data Portability
- **Light & Dark Mode**: Persistent theme switch leveraging CSS custom properties (`data-theme="dark"`).
- **Default Task Creation Preferences**: Set default category, priority, and preferred view mode.
- **Export Data**: Export all stored tasks into a structured, downloadable `.json` file.
- **Validated JSON Import**: Import tasks with JSON schema validation, error feedback, and choice between **Merge** and **Replace** modes.
- **Sample Data Loader**: Pre-populated with realistic college, study, work, and personal tasks.
- **Clear All Data**: Safe reset with confirmation dialog.
- **Keyboard Shortcut**: `Ctrl+K` (or `Cmd+K`) opens task creation from anywhere without intercepting text inputs.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite |
| **Routing** | React Router DOM v7 |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Date Math** | date-fns v4 |
| **Animations & Confetti**| Custom CSS3 Keyframes + Canvas Confetti |
| **Styling** | Custom Modular CSS Design System (CSS Variables) |
| **Persistence** | LocalStorage API |
| **Testing** | Vitest |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm (version 9+)

### Installation
```bash
# Clone or navigate to the project directory
cd taskflow

# Install dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Automated Unit Tests
```bash
npm test
```
Executes all unit tests covering task statistics, search filtering, category distribution, date calculations, and JSON import/export validation.

### Creating a Production Build
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

---

## 📂 Project Structure

```
taskflow/
├── src/
│   ├── assets/              # Icons and assets
│   ├── components/
│   │   ├── common/          # Reusable UI (Button, Input, Select, Modal, Toast)
│   │   ├── dashboard/       # StatCard, ProductivityChart, CategoryChart
│   │   ├── layout/          # Sidebar, Header, MobileNavigation
│   │   └── tasks/           # TaskCard, TaskList, TaskForm, TaskModal, TaskFilters, EmptyState
│   ├── context/
│   │   └── TaskContext.jsx  # Global Task & App State Provider
│   ├── hooks/
│   │   ├── useTasks.js      # Task management hook
│   │   └── useTheme.js      # Persistent theme toggle hook
│   ├── pages/
│   │   ├── Dashboard.jsx    # Overview metrics, charts & schedule
│   │   ├── AllTasks.jsx     # Full task management, filters, and views
│   │   ├── Today.jsx        # Today's agenda
│   │   ├── Upcoming.jsx     # Chronologically grouped schedule
│   │   ├── Important.jsx    # Starred tasks
│   │   ├── Completed.jsx    # Completed tasks archive
│   │   ├── Categories.jsx   # Category drill-downs
│   │   └── Settings.jsx     # Themes, defaults, import/export
│   ├── services/
│   │   └── taskStorage.js   # LocalStorage layer & sample data generator
│   ├── styles/
│   │   ├── variables.css    # Colors, fonts, shadows, transitions (Light & Dark)
│   │   ├── global.css       # Typography, accessibility focus rings, animations
│   │   ├── layout.css       # Responsive grid/flex layouts & mobile drawer
│   │   └── components.css   # Cards, forms, badges, modals, toasts
│   ├── utils/
│   │   ├── dateUtils.js     # date-fns utilities & relative formatters
│   │   ├── exportImport.js  # JSON export and import validator
│   │   └── taskUtils.js     # Task statistics, filtering, and sorting
│   ├── App.jsx              # Main router & layout shell
│   └── main.jsx             # React DOM entrypoint
├── index.html               # Semantic HTML5 shell with Inter font
└── package.json             # Scripts & dependencies
```

---

## ♿ Accessibility & Usability
- Accessible semantic HTML5 elements (`<header>`, `<nav>`, `<aside>`, `<main>`, `<article>`).
- Visible `:focus-visible` focus rings for keyboard navigation.
- Accessible modal dialogs with `role="dialog"`, `aria-modal="true"`, and `Escape` key listeners.
- Color contrast meets WCAG AA standards in both Light and Dark themes.
- Form inputs have paired `<label>` tags and dedicated `aria-invalid` / `aria-describedby` error states.
- Priorities and categories are communicated through distinct labels, shapes, and badges—never colour alone.
- Respects `prefers-reduced-motion` settings.
