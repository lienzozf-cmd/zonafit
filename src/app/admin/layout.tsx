import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - ZONA FIT GT',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
