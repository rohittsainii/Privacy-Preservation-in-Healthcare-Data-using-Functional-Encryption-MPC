import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Badge, Alert, MonoValue, Spinner, StatusDot } from '../components/UI';

const INSTITUTIONS = [
  { id: 'inst_A', name: 'AIIMS Delhi', records: 2847, status: 'ready' },
  { id: 'inst_B', name: 'PGI Chandigarh', records: 1923, status: 'ready' },
  { id: 'inst_C', name: 'KEM Mumbai', records: 3102, status: 'ready' },
  { id: 'inst_D', name: 'Apollo Chennai', records: 1654, status: 'offline' },
];

const STEPS_TEMPLATE = [
  { id: 1, label: 'Initialize MPC session', desc: 'Establishing secure channel between parties' },
  { id: 2, label: 'Generate secret shares', desc: "Splitting each party's data using Shamir's Secret Sharing" },
  { id: 3, label: 'Distribute shares', desc: 'Broadcasting shares to computation nodes' },
  { id: 4, label: 'Secure aggregation', desc: 'Running MPC protocol on distributed shares' },
  { id: 5, label: 'Reconstruct result', desc: 'Combining partial results — raw data never exposed' },
];

export default function MPCPage() {
  const [selected, setSelected] = useState(['inst_A', 'inst_B', 'inst_C']);
  const [fnType, setFnType] = useState('sum_disease_count');
  const [threshold, setThreshold] = useState('2');
  const [running, setRunning] = useState(false);
  const [stepIdx, setStepIdx] = useState(-1);
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState('');

  const toggleInstitution = (id) => {
    if (INSTITUTIONS.find(i => i.id === id)?.status === 'offline') return;
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    setResult(null);
    setStepIdx(-1);
  };

  const handleRun = async () => {
    if (selected.length < 2) return;
    setRunning(true);
    setResult(null);
    const sid = `mpc_${Date.now().toString(36).toUpperCase()}`;
    setSessionId(sid);

    for (let i = 0; i < STEPS_TEMPLATE.length; i++) {
      setStepIdx(i);
      await new Promise(r => setTimeout(r, 1400));
    }

    const totalRecords = selected.reduce((acc, id) => acc + (INSTITUTIONS.find(i => i.id === id)?.records || 0), 0);
    setResult({
      sessionId: sid,
      parties: selected.length,
      totalRecords,
      function: fnType,
      aggregateResult: fnType === 'sum_disease_count'
        ? { diabetes: 1247, hypertension: 892, cardiac: 634 }
        : fnType === 'average_age'
          ? { average: 54.2, std_dev: 16.8 }
          : { average_risk: 63.4, high_risk_count: 2108 },
      threshold: parseInt(threshold),
      timestamp: new Date().toISOString(),
    });
    setRunning(false);
    setStepIdx(STEPS_TEMPLATE.length);
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
          MPC Session Manager
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Coordinate Secure Multi-Party Computation across healthcare institutions using Shamir's Secret Sharing.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ animation: 'fadeInUp 0.45s ease' }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 16, letterSpacing: '0.05em' }}>
              SELECT PARTICIPATING INSTITUTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {INSTITUTIONS.map(inst => {
                const isSelected = selected.includes(inst.id);
                const isOffline = inst.status === 'offline';
                return (
                  <div
                    key={inst.id}
                    onClick={() => toggleInstitution(inst.id)}
                    style={{
                      padding: '12px 14px', borderRadius: 10, cursor: isOffline ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s', opacity: isOffline ? 0.4 : 1,
                      background: isSelected ? 'rgba(14,165,233,0.08)' : 'var(--bg-elevated)',
                      border: isSelected ? '1px solid rgba(14,165,233,0.35)' : '1px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      background: isSelected ? '#0ea5e9' : 'transparent',
                      border: isSelected ? '1px solid #0ea5e9' : '1px solid var(--border-default)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#020408',
                    }}>
                      {isSelected && '✓'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{inst.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {inst.records.toLocaleString()} encrypted records
                      </div>
                    </div>
                    <StatusDot status={isOffline ? 'failed' : 'active'} />
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {selected.length} of {INSTITUTIONS.filter(i => i.status !== 'offline').length} institutions selected ·&nbsp;
                <span style={{ color: '#0ea5e9' }}>
                  {selected.reduce((a, id) => a + (INSTITUTIONS.find(i => i.id === id)?.records || 0), 0).toLocaleString()} total records
                </span>
              </span>
            </div>
          </Card>

          <Card style={{ animation: 'fadeInUp 0.5s ease' }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 14, letterSpacing: '0.05em' }}>
              MPC CONFIGURATION
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Select label="Computation Function" value={fnType} onChange={e => { setFnType(e.target.value); setResult(null); setStepIdx(-1); }}>
                <option value="sum_disease_count">Sum — Disease Count</option>
                <option value="average_age">Average — Patient Age</option>
                <option value="average_risk">Average — Risk Score</option>
              </Select>
              <Select label="Threshold (t-of-n)" value={threshold} onChange={e => setThreshold(e.target.value)}>
                <option value="2">2-of-n (reconstruction threshold)</option>
                <option value="3">3-of-n</option>
              </Select>
              <div style={{ padding: '10px 12px', background: 'rgba(14,165,233,0.06)', borderRadius: 8, border: '1px solid rgba(14,165,233,0.15)' }}>
                <div style={{ fontSize: 10, color: '#0ea5e9', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>SECURITY MODEL</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Semi-honest adversary · Shamir's Secret Sharing · t={threshold} threshold
                </div>
              </div>
            </div>
            <Button
              onClick={handleRun}
              disabled={running || selected.length < 2}
              style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
            >
              {running ? <><Spinner size={14} /><span style={{ color: '#020408' }}>Running MPC Protocol...</span></> : '⋈ Initiate MPC Session'}
            </Button>
            {selected.length < 2 && <div style={{ fontSize: 11, color: 'var(--accent-warning)', textAlign: 'center', marginTop: 8 }}>Select at least 2 institutions</div>}
          </Card>
        </div>

        {/* Right: Progress + Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Protocol Steps */}
          <Card style={{ animation: 'fadeInUp 0.45s ease' }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 16, letterSpacing: '0.05em' }}>
              MPC PROTOCOL EXECUTION
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {STEPS_TEMPLATE.map((step, i) => {
                const done = stepIdx >= step.id;
                const active = stepIdx === i && running;
                return (
                  <div key={step.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? 'rgba(32,200,160,0.2)' : active ? 'rgba(14,165,233,0.2)' : 'var(--bg-elevated)',
                      border: done ? '1px solid rgba(32,200,160,0.4)' : active ? '1px solid rgba(14,165,233,0.4)' : '1px solid var(--border-subtle)',
                      fontSize: 10, fontFamily: 'var(--font-mono)',
                      color: done ? '#20c8a0' : active ? '#0ea5e9' : 'var(--text-muted)',
                    }}>
                      {done ? '✓' : active ? <Spinner size={10} color="#0ea5e9" /> : step.id}
                    </div>
                    <div style={{ flex: 1, opacity: (running && !done && !active) ? 0.35 : 1 }}>
                      <div style={{ fontSize: 12, color: done ? '#20c8a0' : active ? '#0ea5e9' : 'var(--text-secondary)', fontWeight: 500 }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Result */}
          {result && (
            <Card style={{ animation: 'fadeInUp 0.35s ease', borderColor: 'rgba(32,200,160,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#20c8a0', boxShadow: '0 0 6px #20c8a0' }} />
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#20c8a0' }}>MPC RESULT — AGGREGATE ONLY</span>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#0ea5e9' }}>{result.parties}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Parties</div>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#20c8a0' }}>
                    {result.totalRecords.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Records</div>
                </div>
              </div>

              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 8 }}>AGGREGATE RESULT</div>
              <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '12px 14px', marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                {Object.entries(result.aggregateResult).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{v}</span>
                  </div>
                ))}
              </div>

              <Alert type="success">Individual party data was never exposed. Only final aggregate reconstructed.</Alert>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 8 }}>
                SESSION: {result.sessionId} · {result.timestamp}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
