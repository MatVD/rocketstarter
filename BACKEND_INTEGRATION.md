# Backend Integration Setup

This guide helps you integrate the RocketStarter frontend with the backend API.

## 🚀 Quick Start

### 1. Backend Setup

Clone and start the backend server:

```bash
git clone <backend-repo>
cd rocketstarter-back
docker-compose up -d
npm run seed:auto
```

### 2. Verify Backend Connection

Test the health endpoint:

```bash
curl http://localhost:3000/health
# Expected response: {"status":"OK","message":"RocketStarter Backend is running"}
```

### 3. Start Frontend

The frontend is already configured for backend integration:

```bash
npm run dev
```

The app will connect to `http://localhost:3000` automatically.

## 🔧 Integration Features

### ✅ What's Already Implemented

- **API Client**: Axios-based client with automatic authentication
- **React Hooks**: Custom hooks for projects, tasks, and users
- **Backend Context**: Real-time connection monitoring
- **Type Safety**: TypeScript interfaces for all API endpoints
- **Error Handling**: Comprehensive error handling and user feedback
- **CORS Support**: Pre-configured for Vite development server

### 📁 File Structure

```
src/
├── api/
│   ├── client.ts           # Axios configuration
│   ├── projects.ts         # Project API endpoints
│   ├── tasks.ts           # Task API endpoints
│   ├── users.ts           # User API endpoints
│   └── index.ts           # API exports
├── hooks/
│   ├── useProjects.ts     # Project data hooks
│   ├── useTasks.ts        # Task data hooks
│   └── useBackendHealth.ts # Connection monitoring
├── contexts/
│   └── BackendContext.tsx  # Backend connection context
└── pages/
    └── ApiTesting.tsx     # Development testing page
```

## 🧪 Testing the Integration

### In-App Testing

1. Navigate to "API Testing" in the sidebar
2. Test each endpoint with the provided buttons
3. Monitor connection status in the header

### Manual Testing

Open the CORS test page in your browser:

```bash
# Serve the test page locally
python3 -m http.server 8081
# Then open: http://localhost:8081/cors-test.html
```

### API Endpoints

- **Health**: `GET http://localhost:3000/health`
- **Projects**: `GET http://localhost:3000/api/v1/projects`
- **Tasks**: `GET http://localhost:3000/api/v1/tasks`
- **Users**: `GET http://localhost:3000/api/v1/users`

## 🔐 Authentication

The frontend automatically includes wallet addresses in API requests:

```typescript
// Automatically added to all requests when wallet is connected
headers: {
  'x-user-address': '0xYourWalletAddress'
}
```

## 🔄 Data Flow

### Projects

```typescript
// Using the hook
const { projects, loading, error, refetch } = useProjects();

// Creating a project
const { create } = useProjectMutations();
const newProject = await create({
  name: "My Project",
  description: "Project description",
  ownerAddress: userAddress,
});
```

### Tasks

```typescript
// Getting tasks for a project
const { tasks, loading, error } = useTasks(projectId);

// Workflow operations
const { assignToSelf, submitForReview, approve } = useTaskWorkflow();
await assignToSelf(taskId, builderAddress);
```

## 🚫 Common Issues

### CORS Errors

```bash
# Backend not allowing your frontend port
# Add your port to backend .env:
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:YOUR_PORT

# Then restart backend:
docker-compose restart app
```

### Connection Refused

```bash
# Backend not running
docker-compose up -d

# Check logs
docker-compose logs app
```

### Empty Data

```bash
# Re-seed database
npm run seed:docker
```

## 📊 Backend Status Monitoring

The app includes real-time backend monitoring:

- **Header**: Shows connection status
- **Auto-retry**: Checks health every 30 seconds
- **Visual feedback**: Color-coded status indicators

## 🔧 Environment Variables

Create a `.env.local` file if you need custom configuration:

```bash
# Backend URL (default: http://localhost:3000)
VITE_API_BASE_URL=http://localhost:3000

# WalletConnect Project ID (for Web3 features)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 📝 API Documentation

### Task Status Workflow

```typescript
// Status values (backend uses numbers)
0 = "todo";
1 = "in progress";
2 = "in review";
3 = "done";

// Priority values
0 = "low";
1 = "medium";
2 = "high";
3 = "urgent";
```

### Builder Actions

- Assign task: `status: 0 → 1`
- Release task: `status: 1 → 0`
- Request review: `status: 1 → 2`

### Owner Actions

- Approve task: `status: 2 → 3`
- Modify any task
- Delete tasks

## 🔄 Switching Between Mock and Live Data

The app can use both mock data (for development) and live backend data:

```typescript
// To use backend data, the hooks automatically switch when backend is available
const { projects } = useProjects(); // Uses API when connected, falls back to mock

// Force mock data (for development)
const projects = mockProjects;
```

## 🎯 Next Steps

1. **Start backend server**
2. **Connect your wallet** for authentication
3. **Test API endpoints** in the API Testing page
4. **Create projects and tasks** through the UI
5. **Monitor connection status** in the header

The integration is complete and ready to use! 🚀
