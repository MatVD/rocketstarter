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
    title: 'Analyse besoins',
    description: 'Définir les objectifs Web3',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Choix architecture',
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
    description: 'Validation sécurité',
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
    id: '1',
    title: 'ERC-20 fidélité',
    description: 'Token de fidélité pour récompenser vos clients avec des points échangeables',
    icon: 'coins',
    difficulty: 'Débutant'
  },
  {
    id: '2',
    title: 'Drop NFT simple',
    description: 'Collection NFT avec mint public, whitelist et métadonnées IPFS',
    icon: 'image',
    difficulty: 'Intermédiaire'
  },
  {
    id: '3',
    title: 'DAO + trésor multi-sig',
    description: 'Organisation décentralisée avec gouvernance et trésorerie sécurisée',
    icon: 'users',
    difficulty: 'Avancé'
  }
];