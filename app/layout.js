import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
   metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com' // Replace with your actual domain
      : 'http://localhost:3000'
  ),
  title: 'MindMaze - Navigate Your Mental Wellness Journey',
  description: 'Interactive mental health maze game with therapeutic levels, AI support, mood tracking, and professional guidance. Transform anxiety into resilience through gamified wellness.',
  keywords: 'mental health, anxiety management, mindfulness games, therapy, wellness, mood tracking, meditation',
  authors: [{ name: 'MindMaze Team' }],
  openGraph: {
    title: 'MindMaze - Navigate Your Mental Wellness Journey',
    description: 'Interactive mental health maze game with therapeutic levels and AI support',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MindMaze - Navigate Your Mental Wellness Journey',
    description: 'Interactive mental health maze game with therapeutic levels and AI support',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right" 
              expand={true} 
              richColors 
              closeButton
              toastOptions={{
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}