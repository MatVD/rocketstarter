import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  User,
  AlertCircle,
  Tag,
  X,
  Check,
} from "lucide-react";
import { Task, Project } from "../../types";

export interface TaskFilters {
  searchTerm: string;
  myTasks: boolean;
  priority: string[];
  categories: string[];
}

interface TaskFilterProps {
  tasks: Task[];
  project: Project;
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export default function TaskFilter({
  tasks,
  project,
  filters,
  onFiltersChange,
}: TaskFilterProps) {
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const priorityRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        priorityRef.current &&
        !priorityRef.current.contains(event.target as Node)
      ) {
        setPriorityDropdownOpen(false);
      }
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get unique values for filter options
  const uniquePriorities = Array.from(
    new Set(
      tasks
        .map((task) => task.priority)
        .filter(
          (priority): priority is "high" | "medium" | "low" =>
            Boolean(priority) && priority !== ""
        )
    )
  );
  const projectCategories = project.tags || [];

  // Count active filters
  const activeFiltersCount =
    (filters.searchTerm ? 1 : 0) +
    (filters.myTasks ? 1 : 0) +
    filters.priority.length +
    filters.categories.length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchTerm: e.target.value,
    });
  };

  const handleMyTasksToggle = () => {
    onFiltersChange({
      ...filters,
      myTasks: !filters.myTasks,
    });
  };

  const handlePriorityToggle = (priority: string) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];

    onFiltersChange({
      ...filters,
      priority: newPriorities,
    });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: "",
      myTasks: false,
      priority: [],
      categories: [],
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
      case "low":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* My Tasks Filter */}
          <button
            onClick={handleMyTasksToggle}
            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filters.myTasks
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            My Tasks
            {filters.myTasks && <Check className="w-4 h-4 ml-2" />}
          </button>

          {/* Priority Filter */}
          {uniquePriorities.length > 0 && (
            <div className="relative" ref={priorityRef}>
              <button
                onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.priority.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Priority
                {filters.priority.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                    {filters.priority.length}
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform ${
                    priorityDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {priorityDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                >
                  <div className="p-2">
                    {uniquePriorities.map((priority) => (
                      <label
                        key={priority}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.priority.includes(priority)}
                          onChange={() => handlePriorityToggle(priority)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getPriorityColor(
                            priority
                          )}`}
                        >
                          {priority}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Categories Filter */}
          {projectCategories.length > 0 && (
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() =>
                  setCategoriesDropdownOpen(!categoriesDropdownOpen)
                }
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.categories.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <Tag className="w-4 h-4 mr-2" />
                Categories
                {filters.categories.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                    {filters.categories.length}
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform ${
                    categoriesDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {categoriesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                >
                  <div className="p-2">
                    {projectCategories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
