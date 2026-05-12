import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stafflyt Status',
  description: 'Real-time monitoring of Stafflyt services and infrastructure',
  icons: {
    icon: 'https://www.stafflyt.com/stafflyt-favicon.svg',
    apple: 'https://www.stafflyt.com/stafflyt.svg',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className="font-sans antialiased bg-gradient-to-b from-slate-50 via-white to-sky-50/30 min-h-screen">
        {children}
      </body>
    </html>
  );
}
