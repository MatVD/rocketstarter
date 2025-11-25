import { Project, Task } from "../../types";
import Card from "../UI/Card";
import { Wallet, Trophy } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="h-40 md:col-span-2 animate-pulse bg-gray-100 dark:bg-gray-800"
          children={null}
        />
        <Card
          className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800"
          children={null}
        />
        <Card
          className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800"
          children={null}
        />
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

  const data = [
    { name: "Completed", value: completedTasks, color: "#22c55e" }, // green-500
    { name: "Remaining", value: remainingTasks, color: "#f97316" }, // orange-500
  ];

  interface CustomTooltipProps {
    active?: boolean;
    payload?: {
      name: string;
      value: number;
    }[];
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm text-xs">
          <p className="font-medium text-gray-900 dark:text-white">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Task Overview with Chart */}
      <Card
        className="p-4 md:col-span-2 flex flex-row items-center justify-between"
        hover
      >
        <div className="flex flex-col justify-between h-full space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Task Overview
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalTasks}{" "}
              <span className="text-sm font-normal text-gray-500">
                Total Tasks
              </span>
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {completedTasks} Completed
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {remainingTasks} Remaining
              </span>
            </div>
          </div>
        </div>

        <div className="h-32 w-32 md:h-40 md:w-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={58}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bank */}
      <Card className="p-4 flex flex-col justify-center space-y-2" hover>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <Wallet className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Project Bank
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            ${Math.round(project.bank).toLocaleString()}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Available funds
          </p>
        </div>
      </Card>

      {/* Rewards */}
      <Card className="p-4 flex flex-col justify-center space-y-2" hover>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Pending Rewards
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {buildersToReward}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Builders to reward
          </p>
        </div>
      </Card>
    </div>
  );
}
