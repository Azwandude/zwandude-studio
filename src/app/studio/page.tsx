'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function StudioPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/studio/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/studio/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-display text-3xl" style={{ color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Background decoration */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(232,56,26,0.04) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-12 h-12 flex items-center justify-center text-white font-bold text-lg mb-4"
            style={{ background: 'var(--accent)', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            ZS
          </div>
          <h1
            className="text-white font-semibold text-lg"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Zwandude Studio
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Admin Access Only
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="p-8 space-y-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
              Email
            </label>
            <input
              id="studio-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-dark"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>
              Password
            </label>
            <div className="relative">
              <input
                id="studio-password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-dark pr-10"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Toggle password visibility"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="text-xs p-3"
              style={{ background: 'rgba(232,56,26,0.1)', border: '1px solid rgba(232,56,26,0.3)', color: '#e8381a' }}
            >
              {error}
            </p>
          )}

          <button
            id="studio-login-btn"
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center mt-2"
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            <LogIn size={16} />
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
