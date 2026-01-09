'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth, useRedirectAuthenticated } from '@/hooks/useAuth';

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const { isLoading: checkingAuth } = useRedirectAuthenticated();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one digit');
      return;
    }

    try {
      await register(email, password, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[#A1A1A1]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="text-3xl font-bold text-[#FFA500]">Todo</span>
            <span className="text-3xl font-bold">App</span>
          </Link>
          <p className="mt-2 text-[#A1A1A1]">Create your account</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-[#3A3A3A] bg-[#2A2A2A] p-8"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#A1A1A1]"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-[#3A3A3A] bg-[#1C1C1C] px-4 py-2 text-[#FAFAFA] placeholder-[#6B7280] focus:border-[#FFA500] focus:outline-none focus:ring-1 focus:ring-[#FFA500]"
              placeholder="Your name"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#A1A1A1]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[#3A3A3A] bg-[#1C1C1C] px-4 py-2 text-[#FAFAFA] placeholder-[#6B7280] focus:border-[#FFA500] focus:outline-none focus:ring-1 focus:ring-[#FFA500]"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#A1A1A1]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#3A3A3A] bg-[#1C1C1C] px-4 py-2 pr-12 text-[#FAFAFA] placeholder-[#6B7280] focus:border-[#FFA500] focus:outline-none focus:ring-1 focus:ring-[#FFA500]"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1A1] hover:text-[#FFA500]"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">
              Must contain uppercase, lowercase, and number
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#A1A1A1]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#3A3A3A] bg-[#1C1C1C] px-4 py-2 pr-12 text-[#FAFAFA] placeholder-[#6B7280] focus:border-[#FFA500] focus:outline-none focus:ring-1 focus:ring-[#FFA500]"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1A1] hover:text-[#FFA500]"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#FFA500] px-4 py-2 font-medium text-[#1C1C1C] transition-colors hover:bg-[#FF8C00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-[#A1A1A1]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#FFA500] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
