'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth, useRequireAuth } from '@/hooks/useAuth';

export default function AnalyticsPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const { user, logout } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[#A1A1A1]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C]">
      <Header user={user} onLogout={logout} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:ml-64">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-sm text-[#A1A1A1]">
              Track your productivity and task completion
            </p>
          </div>

          {/* Analytics placeholder */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Stats cards */}
            <StatCard
              title="Total Tasks"
              value="--"
              description="All time"
              icon="📋"
            />
            <StatCard
              title="Completed"
              value="--"
              description="This week"
              icon="✅"
            />
            <StatCard
              title="Completion Rate"
              value="--%"
              description="Average"
              icon="📊"
            />
          </div>

          {/* Coming soon message */}
          <div className="mt-8 rounded-lg border border-[#3A3A3A] bg-[#2A2A2A] p-8 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-xl font-semibold mb-2">Analytics Coming Soon</h2>
            <p className="text-[#A1A1A1] max-w-md mx-auto">
              This feature is in Phase 7. You&apos;ll see detailed productivity insights,
              task completion trends, and AI-powered suggestions.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-lg border border-[#3A3A3A] bg-[#2A2A2A] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#A1A1A1]">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-[#A1A1A1]">{description}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
