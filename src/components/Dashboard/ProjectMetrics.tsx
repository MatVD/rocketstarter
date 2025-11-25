import { Project, Task } from "../../types";
import Card from "../UI/Card";
import {
  CheckCircle2,
  CircleDashed,
  ListTodo,
  Wallet,
  Trophy,
} from "lucide-react";

interface ProjectMetricsProps {
  project: Project;
  tasks: Task[];
  loading?: boolean;
}

export default function ProjectMetrics({
  project,
  tasks,
  loading,
}: ProjectMetricsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card
            key={i}
            className="h-24 animate-pulse bg-gray-100 dark:bg-gray-800"
            children={null}
          />
        ))}
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 3).length;
  const remainingTasks = tasks.filter((t) => t.status !== 3).length;

  // Calculate unique builders who have completed tasks
  const buildersToReward = new Set(
    tasks.filter((t) => t.status === 3 && t.builder).map((t) => t.builder)
  ).size;

  const metrics = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Remaining",
      value: remainingTasks,
      icon: CircleDashed,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "Bank",
      value: `$${project.bank.toLocaleString()}`,
      icon: Wallet,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Rewards",
      value: buildersToReward,
      subtext: "Builders",
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4 flex items-center space-x-4" hover>
          <div className={`p-3 rounded-lg ${metric.bgColor}`}>
            <metric.icon className={`w-6 h-6 ${metric.color}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {metric.label}
            </p>
            <div className="flex items-baseline space-x-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </h3>
              {metric.subtext && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {metric.subtext}
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
