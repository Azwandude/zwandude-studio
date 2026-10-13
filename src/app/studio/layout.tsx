import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Studio — Zwandude Studio',
  robots: { index: false, follow: false },
};

// Admin layout — no public Navbar/Footer, isolated auth context
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div
        className="min-h-screen"
        style={{ background: 'var(--bg-primary)', fontFamily: 'Inter, sans-serif' }}
      >
        {children}
      </div>
    </AuthProvider>
  );
}
