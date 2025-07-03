// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import {authOptions} from '@/lib/auth'
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper';
import { ThemeProviderWrapper } from '@/components/providers/ThemeProviderWrapper';

import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Powered Resume Screening & Interview Scheduler',
  description: 'Streamline your hiring process with AI',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProviderWrapper session={session}>
          <ThemeProviderWrapper
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster/>
          </ThemeProviderWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}