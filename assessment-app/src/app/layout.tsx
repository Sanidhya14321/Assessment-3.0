
import type { Metadata } from 'next';
import "../app/global.css"
import { Toaster } from "@/components/ui/toaster";
import { ThemeSwitcher } from '@/components/layout/theme-switcher';

export const metadata: Metadata = {
  title: 'EduAssess - Assess Your Skills',
  description: 'Platform for Computer Science Skill Assessments',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        {children}
        <Toaster />
        <ThemeSwitcher />
      </body>
    </html>
  );
}

    