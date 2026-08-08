import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
// Ignore missing type declarations for global CSS imports in this file
// TypeScript may complain about side-effect CSS imports; suppress that here
// @ts-ignore
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ApplyMitra — Online Forms Cafe | All India Form Filling Experts',
  description:
    'ApplyMitra is an online forms cafe where experts fill every form for you — government schemes, exams, jobs, certificates and more across India.',
  keywords: "online cafe, form filling services, applymitra, apply mitra, applymitra.com, apply mitra.com, online form filling, online form filling services, online form filling services in India, online form filling services in India for government schemes, online form filling services in India for exams, online form filling services in India for jobs, online form filling services in India for certificates",
  openGraph: {
    title: 'ApplyMitra — Online Forms Cafe | All India Form Filling Experts',
    description:
      'ApplyMitra is an online forms cafe where experts fill every form for you — government schemes, exams, jobs, certificates and more across India.',
    url: 'https://applymitra.onrender.com',
    siteName: 'ApplyMitra',
    type: 'website',
  },
  };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
