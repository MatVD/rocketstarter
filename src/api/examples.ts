/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ========================================
// EXEMPLES D'UTILISATION DE L'API
// ========================================
// Ce fichier contient des exemples de code pour démontrer
// l'utilisation correcte de l'API. Les fonctions ne sont pas
// utilisées directement mais servent de référence.

import { CreateStepRequest, Step } from "../types";
import {
  // Client & Auth
  setUserAddress,
  checkBackendHealth,
  checkDatabaseConnection,
  getApiInfo,

  // Users
  getUsers,
  getUserByAddress,
  createUser,
  updateUser,
  deleteUser,

  // Projects
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,

  // Tasks
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignTaskToSelf,
  releaseTask,
  requestReview,
  approveTask,

  // Steps
  getSteps,
  getMySteps,
  getStepsByProject,
  getStep,
  createStep,
  updateStep,
  updateStepStatus,
  deleteStep,

  // Categories
  getCategories,
  getTaskCategories,
  addCategoryToTask,
  removeCategoryFromTask,
} from "./index";

// ========================================
// 1. CONNEXION & AUTHENTIFICATION
// ========================================

async function handleWalletConnection(address: string) {
  try {
    // Définir l'adresse du wallet pour l'authentification
    setUserAddress(address);

    // Vérifier si l'utilisateur existe
    let user;
    try {
      user = await getUserByAddress(address);
    } catch (error) {
      // Si l'utilisateur n'existe pas, le créer
      user = await createUser({
        name: "New User",
        walletAddress: address,
      });
    }

    console.log("User connected:", user);
    return user;
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

async function handleWalletDisconnection() {
  // Supprimer l'adresse du wallet
  setUserAddress(null);
}

// ========================================
// 2. VÉRIFICATION DE LA SANTÉ DU BACKEND
// ========================================

async function checkBackendStatus() {
  try {
    // Vérifier si l'API est en ligne
    const health = await checkBackendHealth();
    console.log("API Health:", health);

    // Vérifier la connexion à la base de données
    const dbStatus = await checkDatabaseConnection();
    console.log("DB Status:", dbStatus);

    // Obtenir les infos de l'API
    const apiInfo = await getApiInfo();
    console.log("API Info:", apiInfo);

    return { healthy: true };
  } catch (error) {
    console.error("Backend is not available:", error);
    return { healthy: false };
  }
}

// ========================================
// 3. GESTION DES PROJETS
// ========================================

async function createNewProject(ownerAddress: string) {
  try {
    const project = await createProject({
      name: "My Web3 Project",
      description: "A revolutionary DeFi platform",
      ownerAddress,
    });

    console.log("Project created:", project);
    return project;
  } catch (error) {
    console.error("Failed to create project:", error);
  }
}

async function loadProjectDashboard() {
  try {
    // Charger tous les projets
    const projects = await getProjects();

    // Enrichir avec les steps de chaque projet
    const projectsWithSteps = await Promise.all(
      projects.map(async (project) => {
        const steps = await getStepsByProject(project.id);
        return { ...project, steps };
      })
    );

    return projectsWithSteps;
  } catch (error) {
    console.error("Failed to load dashboard:", error);
  }
}

async function updateProjectProgress(projectId: string) {
  try {
    const updated = await updateProject(projectId, {
      name: "Updated Project Name",
    });
    return updated;
  } catch (error) {
    console.error("Failed to update project:", error);
  }
}

// ========================================
// 4. GESTION DES STEPS (WORKFLOW)
// ========================================

async function initializeProjectSteps(projectId: string) {
  try {
    // Créer les étapes du workflow
    const steps: CreateStepRequest[] = [
      {
        title: "Requirements",
        description: "Define project requirements",
        projectId: Number(projectId),
        order: 1,
        status: 0, // todo
      },
      {
        title: "Architecture",
        description: "Design system architecture",
        projectId: Number(projectId),
        order: 2,
        status: 0,
      },
      {
        title: "Smart Contracts",
        description: "Develop smart contracts",
        projectId: Number(projectId),
        order: 3,
        status: 0,
      },
      {
        title: "Tests & Audit",
        description: "Test and audit contracts",
        projectId: Number(projectId),
        order: 4,
        status: 0,
      },
      {
        title: "Deployment",
        description: "Deploy to mainnet",
        projectId: Number(projectId),
        order: 5,
        status: 0,
      },
    ];

    const createdSteps = await Promise.all(
      steps.map((step) => createStep(step))
    );

    console.log("Steps initialized:", createdSteps);
    return createdSteps;
  } catch (error) {
    console.error("Failed to initialize steps:", error);
  }
}

async function completeStep(stepId: string) {
  try {
    // Marquer l'étape comme terminée
    const step = await updateStepStatus(stepId, "completed");
    console.log("Step completed:", step);
    return step;
  } catch (error) {
    console.error("Failed to complete step:", error);
  }
}

async function getMyCurrentWork() {
  try {
    // Récupérer mes étapes
    const mySteps = await getMySteps();

    // Récupérer les tâches de mes étapes
    const tasks = await getTasks();
    const myTasks = tasks.filter((task) =>
      mySteps.some((step) => step.id === task.stepId)
    );

    return { steps: mySteps, tasks: myTasks };
  } catch (error) {
    console.error("Failed to load my work:", error);
  }
}

// ========================================
// 5. GESTION DES TASKS
// ========================================

async function createTaskForStep(stepId: string, projectId: string) {
  try {
    const task = await createTask({
      title: "Implement feature X",
      description: "Build the core functionality",
      projectId: Number(projectId),
      stepId,
      priority: 2, // high
      status: 0, // todo
    });

    console.log("Task created:", task);
    return task;
  } catch (error) {
    console.error("Failed to create task:", error);
  }
}

async function builderTaskWorkflow(taskId: string, builderAddress: string) {
  try {
    // 1. Builder prend la tâche
    let task = await assignTaskToSelf(taskId, builderAddress);
    console.log("Task assigned to builder:", task);

    // 2. Builder travaille sur la tâche...
    // (simulation)

    // 3. Builder demande une review
    task = await requestReview(taskId);
    console.log("Review requested:", task);

    return task;
  } catch (error) {
    console.error("Workflow failed:", error);
  }
}

async function ownerReviewTask(taskId: string, approved: boolean) {
  try {
    if (approved) {
      // Approuver la tâche
      const task = await approveTask(taskId);
      console.log("Task approved:", task);
      return task;
    } else {
      // Rejeter et remettre en "in progress"
      const task = await updateTask(taskId, { status: 1 });
      console.log("Task rejected, needs work:", task);
      return task;
    }
  } catch (error) {
    console.error("Review failed:", error);
  }
}

async function builderReleaseTask(taskId: string) {
  try {
    // Libérer la tâche (la remettre en "todo")
    const task = await releaseTask(taskId);
    console.log("Task released:", task);
    return task;
  } catch (error) {
    console.error("Release failed:", error);
  }
}

// ========================================
// 6. GESTION DES CATÉGORIES
// ========================================

async function categorizeTask(taskId: string) {
  try {
    // Récupérer toutes les catégories disponibles
    const allCategories = await getCategories();
    console.log("Available categories:", allCategories);

    // Ajouter des catégories à la tâche
    const smartContractCategory = allCategories.find(
      (cat) => cat.name === "Smart Contracts"
    );
    if (smartContractCategory) {
      await addCategoryToTask(taskId, smartContractCategory.id);
    }

    const frontendCategory = allCategories.find(
      (cat) => cat.name === "Frontend"
    );
    if (frontendCategory) {
      await addCategoryToTask(taskId, frontendCategory.id);
    }

    // Récupérer les catégories de la tâche
    const taskCategories = await getTaskCategories(taskId);
    console.log("Task categories:", taskCategories);

    return taskCategories;
  } catch (error) {
    console.error("Failed to categorize task:", error);
  }
}

async function removeCategoryFromTaskExample(
  taskId: string,
  categoryId: number
) {
  try {
    await removeCategoryFromTask(taskId, categoryId);
    console.log("Category removed from task");
  } catch (error) {
    console.error("Failed to remove category:", error);
  }
}

// ========================================
// 7. CHARGEMENT D'UNE VUE BUILD COMPLÈTE
// ========================================

async function loadBuildView(projectId: string) {
  try {
    // 1. Charger le projet
    const project = await getProject(projectId);

    // 2. Charger les steps du projet
    const steps = await getStepsByProject(projectId);

    // 3. Charger toutes les tâches
    const allTasks = await getTasks();
    const projectTasks = allTasks.filter(
      (task) => task.projectId === projectId
    );

    // 4. Charger les catégories
    const categories = await getCategories();

    // 5. Enrichir les tâches avec leurs catégories
    const tasksWithCategories = await Promise.all(
      projectTasks.map(async (task) => {
        const taskCats = await getTaskCategories(task.id);
        return { ...task, categories: taskCats };
      })
    );

    return {
      project,
      steps,
      tasks: tasksWithCategories,
      categories,
    };
  } catch (error) {
    console.error("Failed to load build view:", error);
  }
}

// ========================================
// 8. EXEMPLE COMPLET : CRÉATION D'UN PROJET
// ========================================

async function createCompleteProject(ownerAddress: string) {
  try {
    console.log("🚀 Starting project creation...");

    // 1. Créer le projet
    const project = await createProject({
      name: "DeFi Lending Platform",
      description: "Decentralized lending protocol",
      ownerAddress,
    });
    console.log("✅ Project created:", project.id);

    // 2. Initialiser les steps
    const steps = await initializeProjectSteps(project.id);
    console.log("✅ Steps created:", steps?.length || 0);

    // 3. Créer des tâches pour la première étape
    if (steps && steps[0]) {
      const tasks = await Promise.all([
        createTask({
          title: "Define user stories",
          projectId: Number(project.id),
          stepId: steps[0].id,
          priority: 2,
          status: 0,
        }),
        createTask({
          title: "Create wireframes",
          projectId: Number(project.id),
          stepId: steps[0].id,
          priority: 1,
          status: 0,
        }),
        createTask({
          title: "List technical requirements",
          projectId: Number(project.id),
          stepId: steps[0].id,
          priority: 2,
          status: 0,
        }),
      ]);
      console.log("✅ Tasks created:", tasks.length);
    }

    console.log("🎉 Project setup complete!");
    return project;
  } catch (error) {
    console.error("❌ Project creation failed:", error);
    throw error;
  }
}

// ========================================
// 9. HOOK REACT PERSONNALISÉ (EXEMPLE)
// ========================================

import { useState, useEffect } from "react";

function useProjectWithSteps(projectId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await loadBuildView(projectId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId]);

  return { data, loading, error };
}

// Utilisation dans un composant :
// const { data, loading, error } = useProjectWithSteps("1");

// ========================================
// 10. GESTION D'ERREURS AVANCÉE
// ========================================

async function safeApiCall<T>(
  apiFunction: () => Promise<T>,
  errorMessage: string
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await apiFunction();
    return { data };
  } catch (error: any) {
    console.error(errorMessage, error);

    if (error.response?.status === 401) {
      return { error: "Vous n'êtes pas authentifié" };
    } else if (error.response?.status === 403) {
      return { error: "Vous n'avez pas les permissions nécessaires" };
    } else if (error.response?.status === 404) {
      return { error: "Ressource introuvable" };
    } else if (error.code === "ECONNREFUSED") {
      return { error: "Le serveur backend n'est pas disponible" };
    } else {
      return { error: "Une erreur est survenue" };
    }
  }
}

// Utilisation :
// const { data, error } = await safeApiCall(
//   () => getProject("1"),
//   "Failed to load project"
// );

export {
  handleWalletConnection,
  handleWalletDisconnection,
  checkBackendStatus,
  createNewProject,
  loadProjectDashboard,
  initializeProjectSteps,
  completeStep,
  createTaskForStep,
  builderTaskWorkflow,
  ownerReviewTask,
  categorizeTask,
  loadBuildView,
  createCompleteProject,
  useProjectWithSteps,
  safeApiCall,
};
