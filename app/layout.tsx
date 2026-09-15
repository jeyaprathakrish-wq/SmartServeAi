import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'SmartServe AI', description: 'QR restaurant ordering, kitchen operations, and restaurant management.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
