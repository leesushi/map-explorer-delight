import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Map Explorer Delight',
  description: 'Explore custom overlays and walking directions on Google Maps.',
  icons: {
    icon: '/maps.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
