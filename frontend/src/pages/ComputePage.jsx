import React, { useState } from 'react';
import { Card, Button, Select, Alert, Badge, MonoValue, Spinner, Input } from '../components/UI';

const FUNCTIONS = [
  { value: 'average_age', label: 'Average Age', desc: 'Compute mean age across encrypted records', icon: '∑', vector: '[1,0,0,0,0]' },
  { value: 'disease_frequency', label: 'Disease Frequency', desc: 'Count occurrences of each disease type', icon: '⊞', vector: '[0,0,1,0,0]' },
  { value: 'average_risk_score', label: 'Avg Risk Score', desc: 'Statistical risk score distribution', icon: '◈', vector: '[0,0,0,0,1]' },
  { value: 'blood_pressure_avg', label: 'Avg Blood Pressure', desc: 'Mean blood pressure across population', icon: '♥', vector: '[0,0,0,1,0]' },
  { value: 'risk_score_by_disease', label: 'Risk by Disease', desc: 'Average risk score per disease group', icon: '⊟', vector: '[0,0,1,0,1]' },
];



export default function ComputePage() {
  const [selectedFn, setSelectedFn] = useState('average_age');
  const [filter, setFilter] = useState({ disease: 'all', age_min: '', age_max: '' });
  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState(null);
  const [keyRequested, setKeyRequested] = useState(false);
  const [requestingKey, setRequestingKey] = useState(false);
  const [computeId, setComputeId] = useState('');

  const fnObj = FUNCTIONS.find(f => f.value === selectedFn);

  const handleRequestKey = async () => {
    setRequestingKey(true);
    await new Promise(r => setTimeout(r, 1000));
    setKeyRequested(true);
    setRequestingKey(false);
  };

  const handleCompute = async () => {

  try {

    setComputing(true);

    setResult(null);

    const response = await fetch(

      'http://localhost:3000/api/compute',

      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          function_type: selectedFn,

          filters: filter

        })

      }
    );



    const data =
      await response.json();



    if (data.success) {

      const id =
        `comp_${Date.now()
          .toString(36)
          .toUpperCase()}`;



      setComputeId(id);



      setResult({

        ...data.result,

        functionType: selectedFn,

        timestamp:
          new Date().toISOString(),

        computeId: id,

        recordCount: 1247

      });

    } else {

      alert(
        'Computation failed'
      );
    }

  } catch (err) {

    console.error(err);

    alert(
      'Backend connection failed'
    );

  } finally {

    setComputing(false);
  }
};

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
          Privacy-Preserving Computation
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Request function-specific keys and run secure computations on encrypted healthcare data.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Function Select */}
          <Card style={{ animation: 'fadeInUp 0.45s ease' }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 16, letterSpacing: '0.05em' }}>
              SELECT COMPUTATION FUNCTION
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FUNCTIONS.map(fn => (
                <div
                  key={fn.value}
                  onClick={() => { setSelectedFn(fn.value); setResult(null); setKeyRequested(false); }}
                  style={{
                    padding: '10px 14px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                    background: selectedFn === fn.value ? 'rgba(139,92,246,0.1)' : 'var(--bg-elevated)',
                    border: selectedFn === fn.value ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{fn.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: selectedFn === fn.value ? '#8b5cf6' : 'var(--text-primary)', fontWeight: 500 }}>
                      {fn.label}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{fn.desc}</div>
                  </div>
                  {selectedFn === fn.value && <span style={{ color: '#8b5cf6', fontSize: 10 }}>●</span>}
                </div>
              ))}
            </div>
          </Card>

          {/* Filters */}
          <Card style={{ animation: 'fadeInUp 0.5s ease' }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 16, letterSpacing: '0.05em' }}>
              FILTER CRITERIA (OPTIONAL)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Select label="Disease Filter" value={filter.disease} onChange={e => setFilter(f => ({ ...f, disease: e.target.value }))}>
                <option value="all">All Diseases</option>
                <option value="0">None</option>
                <option value="1">Diabetes</option>
                <option value="2">Hypertension</option>
                <option value="3">Cardiac Disease</option>
                <option value="4">Respiratory</option>
                <option value="5">Neurological</option>
              </Select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input label="Age Min" type="number" placeholder="18" value={filter.age_min} onChange={e => setFilter(f => ({ ...f, age_min: e.target.value }))} />
                <Input label="Age Max" type="number" placeholder="90" value={filter.age_max} onChange={e => setFilter(f => ({ ...f, age_max: e.target.value }))} />
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Request Key & Compute */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Function Details */}
          <Card style={{ animation: 'fadeInUp 0.45s ease', background: 'rgba(139,92,246,0.04)', borderColor: 'rgba(139,92,246,0.12)' }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#8b5cf6', marginBottom: 12, letterSpacing: '0.05em' }}>
              SELECTED FUNCTION
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              {fnObj?.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{fnObj?.desc}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>FUNCTION VECTOR</div>
                <MonoValue style={{ fontSize: 11 }}>{fnObj?.vector}</MonoValue>
              </div>
            </div>
          </Card>

          {/* Step 1: Request Key */}
          <Card style={{ animation: 'fadeInUp 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: keyRequested ? 'rgba(32,200,160,0.2)' : 'rgba(139,92,246,0.2)',
                fontSize: 10, fontFamily: 'var(--font-mono)', color: keyRequested ? '#20c8a0' : '#8b5cf6',
              }}>
                {keyRequested ? '✓' : '1'}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: keyRequested ? '#20c8a0' : 'var(--text-primary)' }}>
                Request Function Key
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
              A function-specific key is required before computation. The key limits your access to only the requested function.
            </p>
            {keyRequested ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Alert type="success">Function key granted for <strong>{fnObj?.label}</strong></Alert>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>ISSUED KEY (partial)</div>
                  <MonoValue style={{ fontSize: 10, wordBreak: 'break-all' }}>
                    fk_{selectedFn}_aGVhbHRoY2FyZVByaXZhY3k...
                  </MonoValue>
                </div>
              </div>
            ) : (
              <Button onClick={handleRequestKey} disabled={requestingKey} variant="secondary" size="sm">
                {requestingKey ? <><Spinner size={12} /> Requesting...</> : '⌗ Request Function Key'}
              </Button>
            )}
          </Card>

          {/* Step 2: Compute */}
          <Card style={{ animation: 'fadeInUp 0.55s ease', opacity: keyRequested ? 1 : 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: result ? 'rgba(32,200,160,0.2)' : 'rgba(139,92,246,0.2)',
                fontSize: 10, fontFamily: 'var(--font-mono)', color: result ? '#20c8a0' : '#8b5cf6',
              }}>
                {result ? '✓' : '2'}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: result ? '#20c8a0' : 'var(--text-primary)' }}>
                Execute Computation
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
              Runs FE/MPC protocol on encrypted data. Only the aggregate result is revealed.
            </p>
            <Button onClick={handleCompute} disabled={!keyRequested || computing} style={{ width: '100%', justifyContent: 'center' }}>
              {computing ? <><Spinner size={14} /><span style={{ color: '#020408' }}>Computing on encrypted data...</span></> : `∑ Run ${fnObj?.label}`}
            </Button>
          </Card>

          {/* Result */}
          {result && (
            <Card style={{ animation: 'fadeInUp 0.35s ease', borderColor: 'rgba(32,200,160,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#20c8a0', boxShadow: '0 0 6px #20c8a0' }} />
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#20c8a0' }}>COMPUTATION RESULT</span>
              </div>

              {result.value !== null ? (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, color: 'var(--accent-primary)', marginBottom: 2 }}>
                    {result.value}
                    <span style={{ fontSize: 16, color: 'var(--text-muted)', marginLeft: 6 }}>{result.unit}</span>
                  </div>
                  {result.details && (
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                      {Object.entries(result.details).map(([k, v]) => (
                        <div key={k}>
                          <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{k.toUpperCase()}: </span>
                          <MonoValue style={{ fontSize: 11 }}>{v}</MonoValue>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {(result.breakdown || []).map((b, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--bg-elevated)', borderRadius: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.name}</span>
                      <MonoValue>{b.count || b.avg}</MonoValue>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <Badge variant="muted">{result.recordCount} records</Badge>
                <Badge variant="default">No raw data exposed</Badge>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 8 }}>
                ID: {result.computeId} · {result.timestamp}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
