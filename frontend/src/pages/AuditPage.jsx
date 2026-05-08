import React, { useState, useEffect } from 'react';
import { Card, Badge, MonoValue, Select, Input, Spinner, Alert } from '../components/UI';
import { getAuditLogs } from '../services/api';

const TYPE_CONFIG = {
  ENCRYPT: { color: '#20c8a0', variant: 'default' },
  COMPUTE: { color: '#8b5cf6', variant: 'purple' },
  MPC: { color: '#0ea5e9', variant: 'blue' },
  KEYGEN: { color: '#f59e0b', variant: 'warning' },
  LOGIN: { color: '#4d6660', variant: 'muted' },
  LOGOUT: { color: '#4d6660', variant: 'muted' },
  ACCESS_DENIED: { color: '#ef4444', variant: 'danger' },
};

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAuditLogs()
      .then(res => setLogs(res.data.logs || []))
      .catch(() => setError('Failed to load audit logs from server.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l => {
    if (typeFilter !== 'all' && l.type !== typeFilter) return false;
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (search && !l.user_id?.includes(search) && !l.action?.includes(search) && !l.id?.includes(search)) return false;
    return true;
  });

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    failed: logs.filter(l => l.status === 'failed').length,
    denied: logs.filter(l => l.type === 'ACCESS_DENIED').length,
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spinner />
    </div>
  );

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
      {error && <Alert variant="error" style={{ marginBottom: 16 }}>{error}</Alert>}
      <div style={{ marginBottom: 28, animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
          Audit Logs
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Complete record of system access, computation requests, and key generation events.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Events', value: stats.total, color: 'var(--text-primary)' },
          { label: 'Successful', value: stats.success, color: '#20c8a0' },
          { label: 'Failed', value: stats.failed, color: '#f59e0b' },
          { label: 'Access Denied', value: stats.denied, color: '#ef4444' },
        ].map((s, i) => (
          <Card key={s.label} style={{ padding: '16px 20px', animation: `fadeInUp ${0.3 + i * 0.08}s ease` }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 16, animation: 'fadeInUp 0.5s ease', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Input
              label="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="user, action, log ID..."
            />
          </div>
          <div style={{ width: 160 }}>
            <Select label="Event Type" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              {['ENCRYPT', 'COMPUTE', 'MPC', 'KEYGEN', 'LOGIN', 'LOGOUT', 'ACCESS_DENIED'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div style={{ width: 140 }}>
            <Select label="Status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </Select>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', paddingBottom: 10 }}>
            {filtered.length} results
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ animation: 'fadeInUp 0.55s ease', padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Log ID', 'Type', 'User', 'Action', 'Status', 'IP Address', 'Timestamp'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)', letterSpacing: '0.06em',
                    fontWeight: 400, whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <tr
                  key={log.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.1s',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                >
                  <td style={{ padding: '10px 16px' }}>
                    <MonoValue style={{ fontSize: 10 }}>{log.id}</MonoValue>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <Badge variant={TYPE_CONFIG[log.type]?.variant || 'muted'}>{log.type}</Badge>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{log.user_id}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {log.action}{log.details ? ` · ${log.details}` : ''}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: log.status === 'success' ? '#20c8a0' : '#ef4444',
                      }} />
                      <span style={{ fontSize: 11, color: log.status === 'success' ? '#20c8a0' : '#ef4444' }}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <MonoValue style={{ fontSize: 10 }}>{log.ip}</MonoValue>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
