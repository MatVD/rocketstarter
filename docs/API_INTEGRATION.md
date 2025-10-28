# Frontend-Backend API Alignment Documentation

## ✅ Statut de l'intégration

Toutes les routes API backend sont maintenant correctement implémentées dans le frontend.

## 📁 Structure des fichiers API

```
src/api/
├── client.ts         # Configuration Axios + Intercepteurs + Health checks
├── index.ts          # Réexportation de toutes les fonctions API
├── projects.ts       # Routes /api/v1/projects
├── tasks.ts          # Routes /api/v1/tasks
├── users.ts          # Routes /api/v1/users
├── steps.ts          # Routes /api/v1/steps
└── categories.ts     # Routes /api/v1/categories
```

## 🔧 Routes implémentées

### Routes de santé ✅

```typescript
import { checkBackendHealth, checkDatabaseConnection, getApiInfo } from "@/api";

// GET /health
const health = await checkBackendHealth();

// GET /db-test
const dbStatus = await checkDatabaseConnection();

// GET /api/v1
const apiInfo = await getApiInfo();
```

### Routes Users ✅

```typescript
import {
  getUsers,
  getUserByAddress,
  createUser,
  updateUser,
  deleteUser,
} from "@/api";

// GET /api/v1/users
const users = await getUsers();

// GET /api/v1/users/:address
const user = await getUserByAddress("0x123...");

// POST /api/v1/users
const newUser = await createUser({
  name: "John Doe",
  email: "john@example.com",
  walletAddress: "0x123...",
});

// PUT /api/v1/users/:address
const updatedUser = await updateUser("0x123...", {
  name: "Jane Doe",
});

// DELETE /api/v1/users/:address
await deleteUser("0x123...");
```

### Routes Projects ✅

```typescript
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "@/api";

// GET /api/v1/projects
const projects = await getProjects();

// GET /api/v1/projects/:id
const project = await getProject("1");

// POST /api/v1/projects
const newProject = await createProject({
  name: "My Project",
  description: "Project description",
  ownerAddress: "0x123...",
});

// PUT /api/v1/projects/:id
const updatedProject = await updateProject("1", {
  name: "Updated Name",
});

// DELETE /api/v1/projects/:id
await deleteProject("1");
```

### Routes Tasks ✅

```typescript
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignTaskToSelf,
  releaseTask,
  requestReview,
  approveTask,
} from "@/api";

// GET /api/v1/tasks
const tasks = await getTasks();

// GET /api/v1/tasks/:id
const task = await getTask("1");

// POST /api/v1/tasks
const newTask = await createTask({
  title: "New Task",
  projectId: 1,
  priority: 1,
  status: 0,
});

// PUT /api/v1/tasks/:id
const updatedTask = await updateTask("1", {
  status: 1,
});

// DELETE /api/v1/tasks/:id
await deleteTask("1");

// Workflow actions
await assignTaskToSelf("1", "0x123...");
await releaseTask("1");
await requestReview("1");
await approveTask("1");
```

### Routes Steps ✅

```typescript
import {
  getSteps,
  getMySteps,
  getStepsByProject,
  getStep,
  createStep,
  updateStep,
  updateStepStatus,
  deleteStep,
} from "@/api";

// GET /api/v1/steps
const allSteps = await getSteps();

// GET /api/v1/steps/my
const mySteps = await getMySteps();

// GET /api/v1/steps/project/:projectId
const projectSteps = await getStepsByProject("1");

// GET /api/v1/steps/:id
const step = await getStep("1");

// POST /api/v1/steps
const newStep = await createStep({
  title: "Requirements",
  description: "Gather requirements",
  projectId: 1,
  order: 1,
  status: 0,
});

// PUT /api/v1/steps/:id
const updatedStep = await updateStep("1", {
  status: 1,
});

// Convenience method for status updates
await updateStepStatus("1", "in-progress");

// DELETE /api/v1/steps/:id
await deleteStep("1");
```

### Routes Categories ✅

```typescript
import {
  getCategories,
  getTaskCategories,
  addCategoryToTask,
  removeCategoryFromTask,
} from "@/api";

// GET /api/v1/categories
const categories = await getCategories();

// GET /api/v1/tasks/:id/categories
const taskCategories = await getTaskCategories("1");

// POST /api/v1/tasks/:id/categories
await addCategoryToTask("1", 5);

// DELETE /api/v1/tasks/:id/categories/:categoryId
await removeCategoryFromTask("1", 5);
```

## 🔐 Authentification

L'authentification est gérée automatiquement via l'intercepteur Axios qui ajoute l'adresse du wallet dans le header `x-user-address`.

### Configuration de l'adresse utilisateur

```typescript
import { setUserAddress } from "@/api";

// Lors de la connexion du wallet
setUserAddress("0x123...");

// Lors de la déconnexion
setUserAddress(null);
```

L'adresse est :

- Stockée dans `localStorage`
- Ajoutée automatiquement à chaque requête API
- Utilisée par le backend pour l'authentification et l'autorisation

## 📊 Transformations de données

### Mapping des priorités (Tasks)

```typescript
Frontend: 0 | 1 | 2 | 3;
Backend: 0 | 1 | 2 | 3;
Labels: "low" | "medium" | "high" | "urgent";
```

### Mapping des statuts (Tasks)

```typescript
Frontend: "todo" | "inprogress" | "inreview" | "done";
Backend: 0 | 1 | 2 | 3;
```

### Mapping des statuts (Steps)

```typescript
Frontend: "todo" | "in-progress" | "completed";
Backend: 0 | 1 | 2;
```

### Conversion des IDs

Tous les IDs numériques du backend sont convertis en strings pour le frontend :

```typescript
Backend:  { id: 123, projectId: 456 }
Frontend: { id: "123", projectId: "456" }
```

## 🛠️ Configuration

### Variable d'environnement

```env
# .env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Configuration Axios (src/api/client.ts)

- **Base URL**: `/api/v1`
- **Timeout**: 10 secondes
- **Credentials**: Inclus (`withCredentials: true`)
- **Headers**: `Content-Type: application/json`

### Intercepteurs

**Request Interceptor**:

- Ajoute automatiquement `x-user-address` depuis localStorage

**Response Interceptor**:

- Gère les erreurs 401 (Unauthorized)
- Gère les erreurs 500+ (Server errors)
- Gère les erreurs de connexion (ECONNREFUSED)

## 🔍 Gestion des erreurs

Toutes les fonctions API peuvent lever des erreurs. Utilisez try/catch :

```typescript
try {
  const projects = await getProjects();
} catch (error) {
  if (error.response?.status === 401) {
    // Utilisateur non authentifié
  } else if (error.response?.status === 404) {
    // Ressource non trouvée
  } else {
    // Autre erreur
  }
}
```

## 📝 Types TypeScript

Tous les types sont définis dans `src/types/index.ts` :

- **User, ApiUser**: Types pour les utilisateurs
- **Project, ApiProject**: Types pour les projets
- **Task, ApiTask**: Types pour les tâches
- **Step, ApiStep**: Types pour les étapes
- **Category, ApiCategory**: Types pour les catégories
- **CreateXxxRequest, UpdateXxxRequest**: Types pour les requêtes

## ✨ Bonnes pratiques appliquées

1. **Séparation des responsabilités** : Chaque ressource a son propre fichier
2. **Typage strict** : Tous les appels API sont typés avec TypeScript
3. **Transformation de données** : Conversion systématique Backend ↔ Frontend
4. **Gestion d'erreurs centralisée** : Intercepteurs pour les erreurs communes
5. **Authentification automatique** : Header `x-user-address` ajouté automatiquement
6. **Configuration via environnement** : URL de l'API configurable
7. **Méthodes convenience** : Fonctions helper pour les workflows courants
8. **Documentation complète** : Chaque fonction est commentée

## 🚀 Prochaines étapes recommandées

1. **Tests unitaires** : Ajouter des tests pour chaque fonction API
2. **React Query** : Considérer l'utilisation de React Query pour le cache et la synchronisation
3. **Optimistic updates** : Implémenter des mises à jour optimistes pour une meilleure UX
4. **Error boundaries** : Ajouter des Error Boundaries React pour gérer les erreurs
5. **Loading states** : Créer des hooks personnalisés avec états de chargement
6. **Retry logic** : Ajouter une logique de retry pour les requêtes échouées

## 📦 Dépendances requises

```json
{
  "axios": "^1.x.x"
}
```

---

**Date de mise à jour** : 8 octobre 2025
**Version de l'API** : v1
**Statut** : ✅ Production ready
