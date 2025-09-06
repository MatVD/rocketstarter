import { Step, Template, Project } from '../types';

export const mockProject: Project = {
  name: "Mon Projet Web3",
  progress: 65,
  environment: 'testnet'
};

export const completedSteps: Step[] = [
  {
    id: '1',
    title: 'Configuration initiale',
    description: 'Paramétrage de base du projet',
    status: 'completed',
    completed: true
  },
  {
    id: '2',
    title: 'Choix du template',
    description: 'Sélection du template ERC-20',
    status: 'completed',
    completed: true
  },
  {
    id: '3',
    title: 'Configuration smart contract',
    description: 'Paramètres du token de fidélité',
    status: 'completed',
    completed: true
  }
];

export const nextActions: Step[] = [
  {
    id: '4',
    title: 'Tests sur testnet',
    description: 'Déploiement et tests du contrat',
    status: 'in-progress',
    completed: false
  },
  {
    id: '5',
    title: 'Interface utilisateur',
    description: 'Création de l\'interface Web3',
    status: 'todo',
    completed: false
  }
];

export const flowSteps: Step[] = [
  {
    id: '1',
    title: 'Analyse des besoins',
    description: 'Définir les objectifs Web3',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Choix de l\'architecture',
    description: 'Sélectionner blockchain et outils',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Smart contracts',
    description: 'Développement des contrats',
    status: 'in-progress'
  },
  {
    id: '4',
    title: 'Tests & audit',
    description: 'Validation de la sécurité',
    status: 'todo'
  },
  {
    id: '5',
    title: 'Déploiement',
    description: 'Mise en production',
    status: 'todo'
  }
];

export const templates: Template[] = [
  {
            View Documentation
    title: 'ERC-20 fidélité',
    title: 'Smart Contracts',
    description: 'Contract development',
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: 'Simple NFT Drop',
    description: 'NFT collection with public mint, whitelist and IPFS metadata',
    title: 'Testing & Audit',
    difficulty: 'Intermediate'
  },
  {
    id: '3',
    title: 'DAO + Multi-sig Treasury',
    description: 'Decentralized organization with governance and secure treasury',
    description: 'Production release',
    difficulty: 'Advanced'
  }
];
    title: 'ERC-20 Loyalty',
    description: 'Loyalty token to reward your customers with exchangeable points',