import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, StatusDot, MonoValue } from '../components/UI';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// Mock data
const encryptionData = [
  { day: 'Mon', records: 120 }, { day: 'Tue', records: 245 },
  { day: 'Wed', records: 180 }, { day: 'Thu', records: 320 },
  { day: 'Fri', records: 290 }, { day: 'Sat', records: 150 },
  { day: 'Sun', records: 410 },
];

const computeData = [
  { name: 'avg_age', count: 34 }, { name: 'disease_freq', count: 28 },
  { name: 'risk_score', count: 19 }, { name: 'bp_avg', count: 15 },
];

const diseaseData = [
  { name: 'Diabetes', value: 32, color: '#20c8a0' },
  { name: 'Hypertension', value: 27, color: '#0ea5e9' },
  { name: 'Cardiac', value: 18, color: '#8b5cf6' },
  { name: 'Respiratory', value: 13, color: '#f59e0b' },
  { name: 'Other', value: 10, color: '#4d6660' },
];

const recentActivity = [
  { id: 'req_0912', type: 'COMPUTE', func: 'average_age', user: 'analyst', status: 'completed', time: '2m ago' },
  { id: 'enc_0841', type: 'ENCRYPT', func: '47 records', user: 'dataowner', status: 'completed', time: '15m ago' },
  { id: 'mpc_0803', type: 'MPC', func: 'sum across 3 nodes', user: 'admin', status: 'active', time: '23m ago' },
  { id: 'req_0754', type: 'COMPUTE', func: 'disease_frequency', user: 'analyst', status: 'completed', time: '41m ago' },
  { id: 'key_0700', type: 'KEYGEN', func: 'risk_score_key', user: 'admin', status: 'completed', time: '1h ago' },
];

const TYPE_COLORS = {
  COMPUTE: '#8b5cf6', ENCRYPT: '#20c8a0', MPC: '#0ea5e9', KEYGEN: '#f59e0b',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
        borderRadius: 8, padding: '8px 12px',
      }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600 }}>
          {payload[0].value}
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { label: 'Encrypted Records', value: '8,472', delta: '+47 today', color: '#20c8a0', icon: '⊕' },
    { label: 'Compute Requests', value: '1,241', delta: '+12 today', color: '#8b5cf6', icon: '∑' },
    { label: 'Active MPC Sessions', value: '3', delta: 'live', color: '#0ea5e9', icon: '⋈', live: true },
    { label: 'Function Keys Issued', value: '89', delta: '+2 today', color: '#f59e0b', icon: '⌗' },
  ];

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', marginBottom: 4 }}>
              System Overview
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.name}</span>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusDot status="active" />
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              SYSTEM OPERATIONAL
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <Card key={s.label} style={{ animation: `fadeInUp ${0.3 + i * 0.08}s ease` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 20, opacity: 0.8 }}>{s.icon}</span>
              {s.live ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <StatusDot status="active" />
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: '#20c8a0' }}>LIVE</span>
                </div>
              ) : (
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#20c8a0', background: 'rgba(32,200,160,0.08)', padding: '2px 6px', borderRadius: 99 }}>
                  {s.delta}
                </span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: s.color, marginBottom: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Encryption Activity */}
        <Card style={{ animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Encryption Activity</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Records encrypted per day</div>
            </div>
            <Badge variant="default">7-day</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={encryptionData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#20c8a0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#20c8a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#4d6660', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4d6660', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="records" stroke="#20c8a0" strokeWidth={2} fill="url(#grad1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Disease Distribution */}
        <Card style={{ animation: 'fadeInUp 0.55s ease' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Disease Distribution</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Encrypted prevalence data</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={diseaseData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {diseaseData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {diseaseData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.color }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Compute Requests */}
        <Card style={{ animation: 'fadeInUp 0.6s ease' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Computation Types</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Requests by function type</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={computeData} barSize={24}>
              <XAxis dataKey="name" tick={{ fill: '#4d6660', fontSize: 9, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4d6660', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activity */}
        <Card style={{ animation: 'fadeInUp 0.65s ease' }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Activity</div>
            <StatusDot status="active" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentActivity.map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              }}>
                <span style={{
                  fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 6px',
                  borderRadius: 4, background: `${TYPE_COLORS[item.type]}15`,
                  color: TYPE_COLORS[item.type], border: `1px solid ${TYPE_COLORS[item.type]}25`,
                  whiteSpace: 'nowrap',
                }}>
                  {item.type}
                </span>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.func}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.user}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <StatusDot status={item.status === 'active' ? 'active' : item.status === 'completed' ? 'idle' : 'pending'} />
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
