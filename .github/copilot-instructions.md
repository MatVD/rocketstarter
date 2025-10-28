# RocketStarter AI Coding Instructions

## Developer Profile

I am a senior fullstack developer. I follow modern web development best practices (clean architecture, SOLID, DRY, accessibility, security, performance).

## Project Overview

RocketStarter is a Web3 project management platform built with React 18 + TypeScript + Vite, designed for Web2-to-Web3 transitions. It features a flexible, customizable workflow system where users can define their own steps and manage tasks within each step. The platform includes integrated Web3 tooling via Wagmi/RainbowKit and comes with example workflows (like the 5-step: Requirements → Architecture → Smart Contracts → Tests & Audit → Deployment).

## Architecture Patterns

### Application Structure

- **Single-page application** with tab-based navigation (no React Router)
- **State management**: Local state with useState, no global state library
- **Data flow**: Props drilling with event handlers passed down from App.tsx
- **Page structure**: `App.tsx` → pages (Dashboard, Build, Templates, Settings) → components

### Component Hierarchy

```
App.tsx (root state: activeTab, activeStepId)
├── Layout/ (Sidebar, Header)
├── pages/ (Dashboard, Build, Templates, Settings)
└── components/
    ├── Build/ (KanbanBoard, TaskTable, StepNavigation, StepDetails)
    ├── Dashboard/ (StepCard)
    ├── Templates/ (TemplateCard)
    └── UI/ (Card, ProgressBar - reusable components)
```

### Critical Patterns

**Step-Task Association**: Tasks belong to specific workflow steps via `stepId`. This flexible association allows for custom workflows:

```typescript
const currentStepTasks = tasks.filter((task) => task.stepId === currentStep.id);
```

**Dynamic Step Management**: Steps can be added, modified, or removed. Templates provide pre-built step collections, but users can create custom workflows.

**Navigation Pattern**: Use callback props for cross-component navigation:

```typescript
// Dashboard → Build with specific step
onNavigateToStep={(stepId: string) => { setActiveStepId(stepId); setActiveTab("build"); }}
```

**Theme Implementation**: Uses Tailwind's `dark:` classes with centralized color constants in `src/constants/colors.ts`. Theme state in `ThemeContext` applies `dark` class to document root.

## Web3 Integration

### Provider Setup (main.tsx)

RainbowKit → Wagmi → TanStack Query wrapping pattern. Configure chains in main.tsx:

```typescript
const wagmiConfig = getDefaultConfig({
  appName: "Rocket Launch",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, sepolia],
});
```

## Data Models & State

### Core Types (src/types/index.ts)

- **Step**: Workflow steps with status tracking
- **Task**: Associated with stepId, flexible status field (accepts any column id)
- **Template**: Pre-built strategy templates with optional steps
- **Project**: Basic project info with progress and environment

### Mock Data Structure (src/data/mockData.ts)

- Example workflow steps (`flowSteps`) - represents one possible workflow configuration
- Template definitions with pre-built step collections and difficulty levels
- Tasks associated with specific steps via `stepId`
- Demonstrates the flexible step-task relationship for custom workflows

## Development Workflows

### Build Commands

- `npm run dev` - Vite dev server (port 5173)
- `npm run build` - Production build
- `npm run lint` - ESLint with TypeScript rules
- No test scripts currently configured

### Adding New Features

1. **New components**: Follow existing folder structure (feature/ComponentName/)
2. **New pages**: Add to pages/ directory, update App.tsx switch statement
3. **State changes**: Consider if state should live in App.tsx or locally
4. **Styling**: Use Tailwind classes, reference colors.ts for consistency

### Component Patterns

- **Animations**: Framer Motion with consistent `initial={{ opacity: 0, y: 20 }}` pattern
- **Icons**: Lucide React icons with consistent sizing (`w-5 h-5` or `w-6 h-6`)
- **Cards**: Use `components/UI/Card.tsx` wrapper for consistent styling
- **Drag & Drop**: @dnd-kit implementation in KanbanBoard with custom sensors

## Styling Conventions

### Theme System

- **Primary colors**: Blue variants (blue-500, blue-600, etc.)
- **Status colors**: Green (success), Orange (warning), Red (error)
- **Dark mode**: Every component must support `dark:` variants
- **Responsive**: Mobile-first with `md:` breakpoints for desktop

### Color Usage

Reference `src/constants/colors.ts` for consistent color applications:

```typescript
// Example: Use status colors for task status indicators
className={`${COLORS.status.success.bg} ${COLORS.status.success.text}`}
```

### Animation Standards

- Page transitions: 0.5s duration
- Hover effects: 0.2s duration
- Use `motion` wrapper for page-level animations, standard hover effects for interactive elements

## Key Files to Understand

- `src/App.tsx` - Main navigation and state management
- `src/data/mockData.ts` - Data structure examples
- `src/components/Build/KanbanBoard.tsx` - Complex drag & drop implementation
- `src/constants/colors.ts` - Centralized theming
- `main.tsx` - Web3 provider setup pattern
