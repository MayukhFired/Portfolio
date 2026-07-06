import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mayukh Ghosh — Freelance Developer',
  description:
    'Full-stack freelance developer specializing in React, Supabase, C, and TypeScript. Building fast, beautiful, production-grade software.',
  keywords: ['freelance developer', 'React', 'Supabase', 'C', 'TypeScript', 'Docker', 'SQL', 'full-stack'],
  openGraph: {
    title: 'Mayukh Ghosh — Freelance Developer',
    description: 'Full-stack developer building products that feel alive.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" style={{ cursor: 'none' }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
