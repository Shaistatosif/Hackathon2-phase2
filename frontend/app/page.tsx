'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-[#3A3A3A] bg-[#2A2A2A]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#FFA500]">Todo</span>
            <span className="text-2xl font-bold">App</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-[#3A3A3A]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[#FFA500] px-4 py-2 text-sm font-medium text-[#1C1C1C] transition-colors hover:bg-[#FF8C00]"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Manage Tasks with{' '}
          <span className="text-[#FFA500]">AI Power</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-[#A1A1A1]">
          Your intelligent task manager that understands natural language.
          Create, organize, and complete tasks using our AI chatbot with
          Hinglish support.
        </p>
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link
            href="/register"
            className="rounded-lg bg-[#FFA500] px-8 py-3 text-lg font-medium text-[#1C1C1C] transition-colors hover:bg-[#FF8C00]"
          >
            Start Free
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-[#3A3A3A] px-8 py-3 text-lg font-medium transition-colors hover:bg-[#2A2A2A]"
          >
            Sign In
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="AI Chatbot"
            description="Talk to our AI in English or Hinglish. Just say 'Add task: Buy groceries' and it's done!"
            icon="🤖"
          />
          <FeatureCard
            title="Smart Reminders"
            description="Never miss a deadline. AI-powered reminders keep you on track."
            icon="⏰"
          />
          <FeatureCard
            title="Real-time Sync"
            description="Your tasks sync instantly across all devices."
            icon="🔄"
          />
          <FeatureCard
            title="Priority Management"
            description="Organize tasks by priority, due date, and tags."
            icon="📊"
          />
          <FeatureCard
            title="Recurring Tasks"
            description="Set up daily, weekly, or monthly recurring tasks."
            icon="🔁"
          />
          <FeatureCard
            title="Analytics"
            description="Track your productivity with insightful analytics."
            icon="📈"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3A3A3A] bg-[#2A2A2A] py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-[#A1A1A1]">
          <p>&copy; 2026 Todo App. AI-Powered Task Management.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-lg border border-[#3A3A3A] bg-[#2A2A2A] p-6 text-left transition-colors hover:border-[#FFA500]">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-[#A1A1A1]">{description}</p>
    </div>
  );
}
