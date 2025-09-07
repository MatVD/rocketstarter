import { Target, CheckCircle, Users, Calendar } from "lucide-react";
import { StepGuideline } from "./stepGuidelinesData";

interface GuidelineSectionProps {
  guidelines: StepGuideline;
}

export default function GuidelineSection({
  guidelines,
}: GuidelineSectionProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Objective
          </h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {guidelines.objective}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Key Tasks
          </h4>
        </div>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          {guidelines.tasks.map((task, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h4 className="font-semibold text-gray-900 dark:text-white">Team</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {guidelines.team}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Duration
          </h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {guidelines.duration}
        </p>
      </div>
    </div>
  );
}
