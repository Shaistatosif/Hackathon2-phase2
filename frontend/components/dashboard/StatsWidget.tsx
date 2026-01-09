'use client';

import { CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import type { Task } from '@/types';

interface StatsWidgetProps {
  tasks: Task[];
}

export function StatsWidget({ tasks }: StatsWidgetProps) {
  const stats = calculateStats(tasks);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Tasks"
        value={stats.total}
        icon={<TrendingUp className="w-5 h-5" />}
        color="blue"
      />
      <StatCard
        title="Completed"
        value={stats.completed}
        icon={<CheckCircle className="w-5 h-5" />}
        color="green"
        subtitle={`${stats.completionRate}% done`}
      />
      <StatCard
        title="In Progress"
        value={stats.inProgress}
        icon={<Clock className="w-5 h-5" />}
        color="yellow"
      />
      <StatCard
        title="Overdue"
        value={stats.overdue}
        icon={<AlertTriangle className="w-5 h-5" />}
        color="red"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red';
  subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function calculateStats(tasks: Task[]) {
  const now = new Date();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;

  const overdue = tasks.filter((t) => {
    if (t.status === 'completed' || !t.dueDate) return false;
    return new Date(t.dueDate) < now;
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    inProgress,
    pending,
    overdue,
    completionRate,
  };
}
