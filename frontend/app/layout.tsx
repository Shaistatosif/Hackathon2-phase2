import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Todo App - AI Powered Task Management',
  description: 'An AI-powered todo application with Hinglish chatbot support',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#1C1C1C] text-[#FAFAFA] antialiased">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
