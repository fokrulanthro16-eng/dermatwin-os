import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DermaTwin OS — Autonomous Biometric Skin Engine & Instant eCommerce Formulator',
  description:
    'Production Enterprise Biometric Skin AI and Headless Commerce Formulation System powered by Perfect Corp YouCam S2S API v2.1 and Nebius Token Factory DeepSeek-V4.1-Flash.',
  keywords: [
    'YouCam API',
    'Skin AI',
    'Biometric Skin Analysis',
    'DeepSeek V4.1 Flash',
    'Headless Commerce',
    'eCommerce VTO',
    'DermaTwin OS'
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
