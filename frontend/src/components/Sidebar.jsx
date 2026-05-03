import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from './UI';

const NAV_ITEMS = {
  data_owner: [
    { path: '/dashboard', label: 'Overview', icon: '⬡' },
    { path: '/encrypt', label: 'Encrypt Data', icon: '⊕' },
    { path: '/records', label: 'Records', icon: '▤' },
  ],
  research_analyst: [
    { path: '/dashboard', label: 'Overview', icon: '⬡' },
    { path: '/compute', label: 'Compute', icon: '∑' },
    { path: '/results', label: 'Results', icon: '◈' },
  ],
  admin: [
    { path: '/dashboard', label: 'Overview', icon: '⬡' },
    { path: '/encrypt', label: 'Encrypt Data', icon: '⊕' },
    { path: '/compute', label: 'Compute', icon: '∑' },
    { path: '/mpc', label: 'MPC Session', icon: '⋈' },
    { path: '/keys', label: 'Key Mgmt', icon: '⌗' },
    { path: '/records', label: 'Records', icon: '▤' },
    { path: '/results', label: 'Results', icon: '◈' },
    { path: '/audit', label: 'Audit Logs', icon: '≡' },
  ],
  privacy_officer: [
    { path: '/dashboard', label: 'Overview', icon: '⬡' },
    { path: '/audit', label: 'Audit Logs', icon: '≡' },
    { path: '/results', label: 'Results', icon: '◈' },
  ],
};

const ROLE_LABELS = {
  data_owner: { label: 'DATA OWNER', color: '#0ea5e9' },
  research_analyst: { label: 'ANALYST', color: '#8b5cf6' },
  admin: { label: 'ADMIN', color: '#f59e0b' },
  privacy_officer: { label: 'OFFICER', color: '#20c8a0' },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const items = NAV_ITEMS[user?.role] || [];
  const roleInfo = ROLE_LABELS[user?.role] || {};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: collapsed ? 64 : 220,
      minHeight: '100vh',
      background: 'var(--bg-base)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      overflow: 'hidden',
      flexShrink: 0,
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 16px' : '24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #20c8a0, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: '#020408',
          }}>
            M
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                MedVault
              </div>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                FE + MPC PLATFORM
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
            AUTHENTICATED AS
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, marginBottom: 4 }}>
            {user?.name}
          </div>
          <span style={{
            fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
            padding: '2px 7px', borderRadius: 99,
            background: `${roleInfo.color}15`,
            color: roleInfo.color, border: `1px solid ${roleInfo.color}30`,
          }}>
            {roleInfo.label}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px 16px' : '9px 12px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none', transition: 'all 0.15s',
              background: isActive ? 'rgba(32,200,160,0.1)' : 'transparent',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
              justifyContent: collapsed ? 'center' : 'flex-start',
            })}
          >
            <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
            {!collapsed && (
              <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            width: '100%', background: 'transparent', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)', padding: '8px', color: 'var(--text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start', gap: 8,
            marginBottom: 6, fontSize: 12, transition: 'all 0.15s',
          }}
        >
          {collapsed ? '→' : '← Collapse'}
        </button>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 'var(--radius-md)', padding: '8px 12px', color: '#ef4444',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 8, fontSize: 12, transition: 'all 0.15s',
          }}
        >
          <span>⏻</span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
