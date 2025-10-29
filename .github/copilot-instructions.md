# RocketStarter AI Coding Instructions

## Developer Profile

I am a senior fullstack developer. I follow modern web development best practices (clean architecture, SOLID, DRY, accessibility, security, performance).

## Project Overview

RocketStarter is a Web3 project management platform built with React 18 + TypeScript + Vite, designed for Web2-to-Web3 transitions. It features a flexible, customizable workflow system where users can define their own steps and manage tasks within each step. The platform includes integrated Web3 tooling via Wagmi/RainbowKit and comes with example workflows (like the 5-step: Requirements → Architecture → Smart Contracts → Tests & Audit → Deployment).

## Architecture Patterns

### Application Structure

- **Multi-page application** with React Router (BrowserRouter)
- **State management**: Zustand for global state (projects, steps, tasks, users)
- **Data flow**: API calls via stores, local component state for UI-only concerns
- **Page structure**: `App.tsx` (routing) → pages (Dashboard, Build, ProjectList, etc.) → components
- **Routes**: Role-based navigation (Builder → `/projects`, Owner → `/dashboard`)

### Component Hierarchy

```
App.tsx (routing with React Router)
├── AppLayout/ (wrapper with Sidebar, Header, Outlet)
├── pages/
│   ├── Onboarding (authentication)
│   ├── Dashboard (owner project overview)
│   ├── ProjectList (builder view)
│   ├── Build (kanban/task management)
│   └── BuilderProjectView (builder-specific project view)
└── components/
    ├── Build/ (KanbanBoard, TaskTable, StepNavigation, StepDetails)
    ├── Dashboard/ (StepCard, ProjectProgress, StepByStep)
    └── UI/ (Card, ProgressBar, Toast, TaskCard - reusable components)
```

### Critical Patterns

**Step-Task Association**: Tasks belong to specific workflow steps via `stepId`. This flexible association allows for custom workflows:

```typescript
const currentStepTasks = tasks.filter((task) => task.stepId === currentStep.id);
```

**Dynamic Step Management**: Steps can be added, modified, or removed. Templates provide pre-built step collections, but users can create custom workflows.

**Navigation Pattern**: Use React Router's `useNavigate` hook for programmatic navigation:

```typescript
// Navigate to specific project build view
const navigate = useNavigate();
navigate(`/build/${projectId}`);

// Navigate with step selection via store
const { setActiveStepId } = useStepStore();
setActiveStepId(stepId);
navigate(`/build/${projectId}`);
```

**State Management with Zustand**: Access global state via hooks from stores:

```typescript
// Example: Accessing projects from store
import { useProjectStore } from '../store/project.store';

const { projects, fetchProjects, selectedProject } = useProjectStore();

useEffect(() => {
  fetchProjects();
}, [fetchProjects]);
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

- **User**: User profile with wallet address and role (Builder/Owner)
- **Project**: Project entity with owner, status, and progress tracking
- **Step**: Workflow steps with status tracking (todo/inprogress/done) and auto-calculated progress
- **Task**: Associated with stepId and projectId, numeric status field (0=todo, 1=inprogress, 2=inreview, 3=done)
- **Category**: Task categorization (optional many-to-many)

### API Request/Response Types

Each entity has corresponding request types:
- **CreateProjectRequest** / **UpdateProjectRequest**
- **CreateStepRequest** / **UpdateStepRequest** 
- **CreateTaskRequest** / **UpdateTaskRequest**
- **CreateUserRequest** / **UpdateUserRequest**

These define what you **send** to the API (subset of fields), while the main types represent what you **receive**.

### Zustand Stores (src/store/)

- **useProjectStore**: Projects management only
- **useStepStore**: Steps management with active step tracking
- **useTaskStore**: Tasks management with workflow actions
- **useUserStore**: Users list and authentication state

Each store follows this pattern:
- State: data arrays, selected items, loading/error states
- Actions: CRUD operations (fetch, create, update, delete)
- Utility methods: refetch, setters for selected items

### Data Source

**Backend API** via axios client (`src/api/client.ts`):
- Base URL configured in environment variables
- Authentication via `x-user-address` header (wallet address)
- Response format: `{ success: boolean, data: T, message?: string }`

## Development Workflows

### Build Commands

- `npm run dev` - Vite dev server (port 5173)
- `npm run build` - Production build
- `npm run lint` - ESLint with TypeScript rules
- No test scripts currently configured

### Adding New Features

1. **New components**: Follow existing folder structure (feature/ComponentName/)
2. **New pages**: Add to pages/ directory, add route in App.tsx `<Routes>` section
3. **State changes**: 
   - Global data (projects, tasks, steps) → Add to existing Zustand stores
   - API entities → Create corresponding store
   - UI-only state (modals, filters) → Local `useState` in component
4. **API integration**: Add endpoint functions in `src/api/`, use in store actions
5. **Styling**: Use Tailwind classes, reference colors.ts for consistency

### Working with Stores

**Pattern**: Fetch data on component mount, access via destructuring

```typescript
// In component
import { useProjectStore } from '../store/project.store';

const MyComponent = () => {
  const { projects, fetchProjects, projectsLoading, projectsError } = useProjectStore();
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  if (projectsLoading) return <div>Loading...</div>;
  if (projectsError) return <div>Error: {projectsError}</div>;
  
  return <div>{projects.map(p => ...)}</div>;
};
```

**Store actions return values** for optimistic updates:
- Create/update methods return the entity or null on error
- Delete methods return boolean success
- Use returned values to show toasts or handle errors locally

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

- `src/App.tsx` - React Router configuration and role-based routing
- `src/store/` - Zustand stores for global state management
- `src/api/` - Backend API integration with typed requests/responses
- `src/types/index.ts` - Complete TypeScript type definitions
- `src/components/Build/KanbanBoard.tsx` - Complex drag & drop implementation
- `src/hooks/useAuth.ts` - Authentication logic with wallet integration
- `src/constants/colors.ts` - Centralized theming
- `src/main.tsx` - Web3 provider setup pattern (RainbowKit + Wagmi)
