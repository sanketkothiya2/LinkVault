import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LinkVault - Personal Resource Library & Productivity Workspace',
  description: 'Collect what inspires you, Build what you dream. Save websites, tutorials, 3D websites, manage tasks, and achieve goals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-[#090D16] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200"
      >
        {children}
      </body>
    </html>
  );
}
