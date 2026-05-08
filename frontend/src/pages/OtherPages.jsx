import React, { useState } from 'react';
import { Card, Badge, MonoValue, Select, Input, Button } from '../components/UI';

/* ── RECORDS PAGE ── */
const RECORDS = Array.from({ length: 20 }, (_, i) => ({
  record_id: `rec_${(Date.now() - i * 10000).toString(36).toUpperCase().slice(0, 8)}`,
  patient_id: `P${1000 + i}`,
  encrypted_age: `${Math.floor(Math.random() * 9e11 + 1e11)}...`,
  encrypted_disease: `${Math.floor(Math.random() * 9e11 + 1e11)}...`,
  encrypted_bp: `${Math.floor(Math.random() * 9e11 + 1e11)}...`,
  encrypted_risk: `${Math.floor(Math.random() * 9e11 + 1e11)}...`,
  timestamp: new Date(Date.now() - i * 1000 * 60 * 15).toISOString(),
}));

export function RecordsPage() {
  const [search, setSearch] = useState('');
  const filtered = RECORDS.filter(r =>
    r.record_id.toLowerCase().includes(search.toLowerCase()) ||
    r.patient_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Encrypted Records</h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>All patient records stored in encrypted form. Raw data is never accessible.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search record or patient ID..." label="Search" />
        </div>
        <Badge variant="default" style={{ padding: '8px 14px', marginBottom: 2 }}>{filtered.length} records</Badge>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', animation: 'fadeInUp 0.45s ease' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Record ID', 'Patient ID', 'Enc. Age', 'Enc. Disease', 'Enc. BP', 'Enc. Risk', 'Stored At'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.06em', fontWeight: 400 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.record_id} style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 16px' }}><MonoValue style={{ fontSize: 10 }}>{r.record_id}</MonoValue></td>
                  <td style={{ padding: '10px 16px' }}><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.patient_id}</span></td>
                  {[r.encrypted_age, r.encrypted_disease, r.encrypted_bp, r.encrypted_risk].map((v, j) => (
                    <td key={j} style={{ padding: '10px 16px' }}>
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{v}</span>
                    </td>
                  ))}
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(r.timestamp).toLocaleString()}
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

/* ── RESULTS PAGE ── */
const RESULTS = [
  { id: 'comp_8A2F', fn: 'average_age', value: '52.3 years', user: 'analyst', records: 1247, time: '2h ago' },
  { id: 'comp_7B1E', fn: 'disease_frequency', value: 'Diabetes: 287, Hypertension: 224...', user: 'analyst', records: 1247, time: '4h ago' },
  { id: 'comp_6C3D', fn: 'average_risk_score', value: '61.7', user: 'analyst', records: 1247, time: '1d ago' },
  { id: 'mpc_4A9B', fn: 'sum_disease_count (MPC)', value: 'Diabetes: 1247, Hypertension: 892', user: 'admin', records: 7872, time: '2d ago' },
  { id: 'comp_3F8A', fn: 'blood_pressure_avg', value: '128.4 mmHg', user: 'analyst', records: 892, time: '3d ago' },
];

export function ResultsPage() {
  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Computation Results</h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Aggregate outputs from FE and MPC computations. No individual patient data is ever included.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {RESULTS.map((r, i) => (
          <Card key={r.id} style={{ animation: `fadeInUp ${0.3 + i * 0.07}s ease` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MonoValue style={{ fontSize: 10 }}>{r.id}</MonoValue>
                  <Badge variant={r.fn.includes('MPC') ? 'blue' : 'purple'}>{r.fn.includes('MPC') ? 'MPC' : 'FE'}</Badge>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{r.fn}</div>
                <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--accent-primary)' }}>{r.value}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{r.records.toLocaleString()} records</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>by {r.user}</div>
                <Badge variant="muted">{r.time}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── KEY MANAGEMENT PAGE ── */
const KEYS = [
  { id: 'fk_001', type: 'average_age', issued_to: 'analyst', vector: '[1,0,0,0,0]', status: 'active', expires: '2026-03-01', created: '2026-02-18' },
  { id: 'fk_002', type: 'disease_frequency', issued_to: 'analyst', vector: '[0,0,1,0,0]', status: 'active', expires: '2026-03-01', created: '2026-02-18' },
  { id: 'fk_003', type: 'risk_score', issued_to: 'analyst', vector: '[0,0,0,0,1]', status: 'expired', expires: '2026-02-10', created: '2026-02-03' },
  { id: 'mpk_001', type: 'master_public_key', issued_to: 'system', vector: 'dimension=5', status: 'active', expires: 'never', created: '2026-02-01' },
];

export function KeysPage() {
  const [revoking, setRevoking] = useState(null);

  const handleRevoke = async (id) => {
    setRevoking(id);
    await new Promise(r => setTimeout(r, 800));
    setRevoking(null);
    alert(`Key ${id} revoked.`);
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Key Management</h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Manage master and function-specific encryption keys. Only administrators can access this panel.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {KEYS.map((k, i) => (
          <Card key={k.id} style={{ animation: `fadeInUp ${0.3 + i * 0.08}s ease` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: k.status === 'active' ? 'rgba(245,158,11,0.1)' : 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>
                ⌗
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <MonoValue style={{ fontSize: 12 }}>{k.id}</MonoValue>
                  <Badge variant={k.status === 'active' ? 'warning' : 'muted'}>{k.status}</Badge>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Function: <span style={{ color: 'var(--text-secondary)' }}>{k.type}</span>
                  &nbsp;·&nbsp; Vector: <MonoValue style={{ fontSize: 11 }}>{k.vector}</MonoValue>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Issued to: {k.issued_to} · Created: {k.created} · Expires: {k.expires}
                </div>
              </div>
              {k.status === 'active' && k.type !== 'master_public_key' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRevoke(k.id)}
                  disabled={revoking === k.id}
                >
                  {revoking === k.id ? 'Revoking...' : 'Revoke'}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
