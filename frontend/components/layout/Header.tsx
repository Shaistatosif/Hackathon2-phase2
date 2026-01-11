'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
  } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-[#3A3A3A] bg-[#2A2A2A]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-[#FFA500]">Shaista</span>
          <span className="text-2xl font-bold">Todo</span>
        </Link>

        {/* Navigation */}
        {user ? (
          <nav className="flex items-center space-x-6">
            <NavLink href="/dashboard" active={isActive('/dashboard')}>
              Dashboard
            </NavLink>
            <NavLink href="/chat" active={isActive('/chat')}>
              Chat
            </NavLink>
            <NavLink href="/analytics" active={isActive('/analytics')}>
              Analytics
            </NavLink>

            {/* User Menu */}
            <div className="flex items-center space-x-4 border-l border-[#3A3A3A] pl-6">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-[#A1A1A1]">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="rounded-lg border border-[#3A3A3A] px-4 py-2 text-sm font-medium transition-colors hover:bg-[#3A3A3A]"
              >
                Logout
              </button>
            </div>
          </nav>
        ) : (
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
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        active
          ? 'text-[#FFA500]'
          : 'text-[#A1A1A1] hover:text-[#FAFAFA]'
      }`}
    >
      {children}
    </Link>
  );
}
