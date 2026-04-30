import React from 'react';

/* ── Badge ── */
export function Badge({ children, variant = 'default', style }) {
  const variants = {
    default: { background: 'rgba(32,200,160,0.12)', color: '#20c8a0', border: '1px solid rgba(32,200,160,0.25)' },
    blue: { background: 'rgba(14,165,233,0.12)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.25)' },
    purple: { background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.25)' },
    warning: { background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' },
    danger: { background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' },
    muted: { background: 'rgba(77,102,96,0.2)', color: '#8ba8a0', border: '1px solid rgba(77,102,96,0.3)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 99, fontSize: 11,
      fontFamily: 'var(--font-mono)', fontWeight: 400, letterSpacing: '0.03em',
      ...variants[variant], ...style
    }}>
      {children}
    </span>
  );
}

/* ── Card ── */
export function Card({ children, style, className, onClick }) {
  return (
    <div onClick={onClick} className={className} style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      boxShadow: 'var(--shadow-card)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }}>
      {children}
    </div>
  );
}

/* ── Button ── */
export function Button({ children, variant = 'primary', onClick, disabled, style, type = 'button', size = 'md' }) {
  const sizes = {
    sm: { padding: '6px 14px', fontSize: 12 },
    md: { padding: '10px 20px', fontSize: 13 },
    lg: { padding: '14px 28px', fontSize: 14 },
  };
  const variants = {
    primary: {
      background: 'var(--accent-primary)', color: '#020408',
      border: '1px solid var(--accent-primary)', fontWeight: 600,
    },
    secondary: {
      background: 'transparent', color: 'var(--accent-primary)',
      border: '1px solid var(--border-strong)',
    },
    ghost: {
      background: 'transparent', color: 'var(--text-secondary)',
      border: '1px solid var(--border-subtle)',
    },
    danger: {
      background: 'rgba(239,68,68,0.1)', color: '#ef4444',
      border: '1px solid rgba(239,68,68,0.3)',
    },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)',
        transition: 'all 0.2s', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, letterSpacing: '0.01em',
        ...sizes[size], ...variants[variant], ...style
      }}
    >
      {children}
    </button>
  );
}

/* ── Input ── */
export function Input({ label, id, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={id} style={{
          fontSize: 11, fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase'
        }}>
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        style={{
          background: 'var(--bg-elevated)', border: `1px solid ${error ? 'var(--accent-danger)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-md)', padding: '10px 14px',
          color: 'var(--text-primary)', fontSize: 13, outline: 'none',
          transition: 'border-color 0.2s',
          fontFamily: 'var(--font-body)',
          ...(props.style || {})
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; }}
        onBlur={e => { e.target.style.borderColor = error ? 'var(--accent-danger)' : 'var(--border-default)'; }}
      />
      {error && <span style={{ fontSize: 11, color: 'var(--accent-danger)' }}>{error}</span>}
    </div>
  );
}

/* ── Select ── */
export function Select({ label, id, children, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={id} style={{
          fontSize: 11, fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase'
        }}>
          {label}
        </label>
      )}
      <select
        id={id}
        {...props}
        style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)', padding: '10px 14px',
          color: 'var(--text-primary)', fontSize: 13, outline: 'none',
          fontFamily: 'var(--font-body)', cursor: 'pointer',
        }}
      >
        {children}
      </select>
    </div>
  );
}

/* ── Spinner ── */
export function Spinner({ size = 20, color = 'var(--accent-primary)' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid rgba(32,200,160,0.15)`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  );
}

/* ── StatusDot ── */
export function StatusDot({ status }) {
  const colors = { active: '#20c8a0', pending: '#f59e0b', failed: '#ef4444', idle: '#4d6660' };
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: colors[status] || colors.idle,
      boxShadow: status === 'active' ? `0 0 6px ${colors.active}` : 'none',
      animation: status === 'active' ? 'pulse-glow 2s infinite' : 'none',
    }} />
  );
}

/* ── Divider ── */
export function Divider({ label, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
      {label && <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
    </div>
  );
}

/* ── Toast-style Alert ── */
export function Alert({ type = 'info', children, onClose }) {
  const styles = {
    info: { bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.3)', color: '#0ea5e9' },
    success: { bg: 'rgba(32,200,160,0.1)', border: 'rgba(32,200,160,0.3)', color: '#20c8a0' },
    warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b' },
    error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#ef4444' },
  };
  const s = styles[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 'var(--radius-md)',
      padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10,
      animation: 'fadeInUp 0.3s ease',
    }}>
      <span style={{ color: s.color, fontSize: 12, fontFamily: 'var(--font-mono)', flex: 1 }}>{children}</span>
      {onClose && (
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: s.color,
          cursor: 'pointer', opacity: 0.7, padding: 0, fontSize: 14
        }}>✕</button>
      )}
    </div>
  );
}

/* ── MonoValue ── */
export function MonoValue({ children, style }) {
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-accent)', ...style }}>
      {children}
    </span>
  );
}
