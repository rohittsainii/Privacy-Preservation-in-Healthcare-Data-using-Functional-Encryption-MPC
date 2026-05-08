import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Alert } from '../components/UI';

const DEMO_ACCOUNTS = [
  { username: 'admin', password: 'admin123', role: 'Administrator', color: '#f59e0b' },
  { username: 'dataowner', password: 'owner123', role: 'Data Owner', color: '#0ea5e9' },
  { username: 'analyst', password: 'analyst123', role: 'Research Analyst', color: '#8b5cf6' },
  { username: 'officer', password: 'officer123', role: 'Privacy Officer', color: '#20c8a0' },
];

export default function LoginPage() {
  const { login, loginError, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate auth
    const ok = login(form.username, form.password);
    setLoading(false);
    if (ok) navigate('/dashboard');
  };

  const fillDemo = (acct) => {
    setForm({ username: acct.username, password: acct.password });
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-void)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(var(--accent-primary) 1px, transparent 1px),
                          linear-gradient(90deg, var(--accent-primary) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '15%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(32,200,160,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '15%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
      }} />

      <div style={{
        width: '100%', maxWidth: 400, padding: 24,
        animation: 'fadeInUp 0.6s ease',
        position: 'relative', zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #20c8a0, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#020408',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 0 40px rgba(32,200,160,0.25)',
          }}>
            M
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26,
            color: 'var(--text-primary)', marginBottom: 6,
          }}>
            MedVault
          </h1>
          <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            PRIVACY PRESERVATION PLATFORM
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)', padding: 28,
          boxShadow: 'var(--shadow-card), var(--shadow-glow)',
        }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 20, letterSpacing: '0.06em' }}>
            SECURE AUTHENTICATION REQUIRED
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Username"
              id="username"
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Enter username"
              autoComplete="username"
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {loginError && (
              <Alert type="error">{loginError}</Alert>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loading || !form.username || !form.password}
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            >
              {loading ? (
                <>
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(2,4,8,0.2)', borderTop: '2px solid #020408', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Authenticating...
                </>
              ) : 'Access System'}
            </Button>
          </form>
        </div>

        {/* Demo accounts */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em' }}>
            — DEMO ACCESS —
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {DEMO_ACCOUNTS.map(acct => (
              <button
                key={acct.username}
                onClick={() => fillDemo(acct)}
                style={{
                  background: `${acct.color}08`, border: `1px solid ${acct.color}25`,
                  borderRadius: 'var(--radius-md)', padding: '8px 10px',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${acct.color}50`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${acct.color}25`}
              >
                <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: acct.color, marginBottom: 2, letterSpacing: '0.06em' }}>
                  {acct.role.toUpperCase()}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{acct.username}</div>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', marginTop: 20, fontFamily: 'var(--font-mono)' }}>
          UPES · Dept. of Informatics · FE + MPC v1.0
        </p>
      </div>
    </div>
  );
}
