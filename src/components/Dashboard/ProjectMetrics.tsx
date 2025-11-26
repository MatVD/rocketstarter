import { Project, Task } from "../../types";
import Card from "../UI/Card";
import { Wallet, Trophy } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  // Calculate unique builders who have completed tasks
  const buildersToReward = new Set(
    tasks.filter((t) => t.status === 3 && t.builder).map((t) => t.builder)
  ).size;

  // Process data for LineChart
  const processChartData = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const normalizeDate = (date: Date | string) => {
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    };

    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const dateStr = normalizeDate(currentDate);

      const createdCount = tasks.filter(
        (t) => t.createdAt && normalizeDate(t.createdAt) <= dateStr
      ).length;

      const completedCount = tasks.filter(
        (t) =>
          t.status === 3 && t.updatedAt && normalizeDate(t.updatedAt) <= dateStr
      ).length;

      data.push({
        date: dateStr,
        day: i,
        remaining: createdCount - completedCount,
        completed: completedCount,
      });
    }
    return data;
  };

  const chartData = processChartData();

  // Generate mock data for bank history (simulated transaction history)
  const generateBankChartData = () => {
    const data = [];
    const currentBank = project.bank;
    const now = new Date();

    // Generate last 7 days of bank balance (simulated)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const variation = Math.random() * 0.15 - 0.05; // -5% to +10% variation
      const historicalBalance = currentBank * (1 + variation * (i / 6));

      data.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        balance: Math.round(historicalBalance),
        date: date.toISOString().split("T")[0],
      });
    }
    // Ensure last point is exact current balance
    data[data.length - 1].balance = Math.round(currentBank);
    return data;
  };

  // Generate rewards history data based on completed tasks over time
  const generateRewardsChartData = () => {
    const data = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Count unique builders with completed tasks up to this date
      const buildersUpToDate = new Set(
        tasks
          .filter((t) => {
            if (t.status !== 3 || !t.builder || !t.updatedAt) return false;
            const taskDate = new Date(t.updatedAt).toISOString().split("T")[0];
            return taskDate <= dateStr;
          })
          .map((t) => t.builder)
      ).size;

      data.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        builders: buildersUpToDate,
        date: dateStr,
      });
    }
    return data;
  };

  const bankChartData = generateBankChartData();
  const rewardsChartData = generateRewardsChartData();

  interface CustomTooltipProps {
    active?: boolean;
    payload?: {
      name: string;
      value: number;
      color: string;
      payload: { date: string };
    }[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const date = new Date(payload[0].payload.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-xs">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {formattedDate}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300 capitalize">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Task Overview with Chart */}
      <Card className="p-6 md:col-span-2 flex flex-col justify-between" hover>
        <div className="flex items-center justify-between mb-4">
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

          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Remaining
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Completed
              </span>
            </div>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                interval={2}
              />
              <YAxis domain={[0, totalTasks + 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="remaining"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                name="Remaining"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                name="Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bank */}
      <Card className="p-6 flex flex-col justify-between" hover>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Wallet className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Project Bank
            </p>
          </div>
        </div>
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            ${Math.round(project.bank).toLocaleString()}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Available funds
          </p>
        </div>
        <div className="h-20 w-full -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bankChartData}>
              <defs>
                <linearGradient id="bankGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-xs">
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${payload[0].value?.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-[10px]">
                          {payload[0].payload.day}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#bankGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Rewards */}
      <Card className="p-6 flex flex-col justify-between" hover>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Pending Rewards
            </p>
          </div>
        </div>
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {buildersToReward}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Builders to reward
          </p>
        </div>
        <div className="h-20 w-full -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rewardsChartData}>
              <defs>
                <linearGradient
                  id="rewardsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-xs">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payload[0].value} builders
                        </p>
                        <p className="text-gray-500 text-[10px]">
                          {payload[0].payload.day}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="builders"
                stroke="#eab308"
                strokeWidth={2}
                fill="url(#rewardsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
