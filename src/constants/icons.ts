/**
 * Icon constants and mappings for the icon system
 */

import {
  CheckCircle,
  Clock,
  Circle,
  Check,
  Target,
  Users,
  Calendar,
  User,
  GripVertical,
  Edit,
  Trash2,
  Plus,
  Save,
  Settings,
  Hammer,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Route,
  BookTemplate,
  Coins,
  Image,
  Pencil,
} from "lucide-react";

/**
 * Icon size variants
 */
export const ICON_SIZES = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
} as const;

/**
 * Icon registry mapping string names to components
 */
export const ICON_REGISTRY = {
  // Status icons
  completed: CheckCircle,
  "in-progress": Clock,
  todo: Circle,
  check: Check,

  // UI icons
  target: Target,
  users: Users,
  calendar: Calendar,
  user: User,
  grip: GripVertical,
  edit: Edit,
  trash: Trash2,
  plus: Plus,
  save: Save,
  settings: Settings,
  hammer: Hammer,

  // Navigation icons
  "arrow-right": ArrowRight,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,

  // Dashboard icons
  "trending-up": TrendingUp,
  route: Route,

  // Template icons
  "book-template": BookTemplate,
  coins: Coins,
  image: Image,

  // Action icons
  pencil: Pencil,
} as const;

export type IconName = keyof typeof ICON_REGISTRY;
export type IconSize = keyof typeof ICON_SIZES;

/**
 * Template icon mapping
 */
export const TEMPLATE_ICONS: Record<string, IconName> = {
  coins: "coins",
  image: "image",
  users: "users",
} as const;

/**
 * Action icon utilities
 */
export const ACTION_ICONS = {
  add: "plus",
  edit: "edit",
  delete: "trash",
  save: "save",
  settings: "settings",
} as const;

/**
 * Navigation icon utilities
 */
export const NAVIGATION_ICONS = {
  next: "arrow-right",
  expand: "chevron-down",
  collapse: "chevron-up",
  forward: "chevron-right",
} as const;
