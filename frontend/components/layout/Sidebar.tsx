'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📋' },
  { href: '/chat', label: 'AI Chat', icon: '🤖' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
];

const taskFilters = [
  { label: 'All Tasks', filter: 'all', count: 0 },
  { label: 'Pending', filter: 'pending', count: 0 },
  { label: 'In Progress', filter: 'in_progress', count: 0 },
  { label: 'Completed', filter: 'completed', count: 0 },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r border-[#3A3A3A] bg-[#2A2A2A] transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-4">
          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#FFA500]/10 text-[#FFA500]'
                    : 'text-[#A1A1A1] hover:bg-[#3A3A3A] hover:text-[#FAFAFA]'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-[#3A3A3A]" />

          {/* Task Filters */}
          <div className="flex-1">
            <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#A1A1A1]">
              Task Filters
            </h3>
            <nav className="space-y-1">
              {taskFilters.map((item) => (
                <button
                  key={item.filter}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-[#A1A1A1] transition-colors hover:bg-[#3A3A3A] hover:text-[#FAFAFA]"
                >
                  <span>{item.label}</span>
                  <span className="rounded-full bg-[#3A3A3A] px-2 py-0.5 text-xs">
                    {item.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="mt-auto border-t border-[#3A3A3A] pt-4">
            <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-[#FFA500] px-4 py-2 text-sm font-medium text-[#1C1C1C] transition-colors hover:bg-[#FF8C00]">
              <span>+</span>
              <span>New Task</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
