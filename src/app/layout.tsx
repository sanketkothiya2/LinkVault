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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('linkvault_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-background text-foreground antialiased selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-200"
      >
        {children}
      </body>
    </html>
  );
}
