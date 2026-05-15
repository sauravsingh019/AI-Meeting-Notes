import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { GlobalBackground } from '@/components/layout/GlobalBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Meeting Notes | Turn Meetings into Action Items',
  description: 'AI-powered meeting notes that automatically transcribe, summarize, and extract action items from your calls.',
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalBackground />
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
