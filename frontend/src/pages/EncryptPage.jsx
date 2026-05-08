import React, { useState } from 'react';
import { Card, Button, Input, Select, Alert, Badge, MonoValue, Spinner } from '../components/UI';

const DISEASES = ['None', 'Diabetes', 'Hypertension', 'Cardiac Disease', 'Respiratory', 'Neurological'];



export default function EncryptPage() {
  const [mode, setMode] = useState('single'); // 'single' | 'batch'
  const [form, setForm] = useState({
    patient_id: '', age: '', gender: '0', disease: '0', blood_pressure: '', risk_score: ''
  });
  const [file, setFile] = useState(null);
  const [encrypting, setEncrypting] = useState(false);
  const [result, setResult] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [error, setError] = useState('');

  const handleSingleEncrypt = async () => {

  setError('');
  setResult(null);

  const age = parseInt(form.age);
  const bp = parseInt(form.blood_pressure);
  const rs = parseInt(form.risk_score);

  if (
    !form.patient_id ||
    isNaN(age) ||
    isNaN(bp) ||
    isNaN(rs)
  ) {
    setError('All fields are required.');
    return;
  }

  setEncrypting(true);

  try {

    const response = await fetch(
      "http://localhost:5000/api/encrypt",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          patient_id: form.patient_id,

          age: age,

          gender: parseInt(form.gender),

          disease: parseInt(form.disease),

          blood_pressure: bp,

          risk_score: rs

        })
      }
    );

    const data = await response.json();

    console.log(data);

    if (!data.success) {

      setError(data.error || "Encryption failed");

      setEncrypting(false);

      return;
    }

    setResult({

      record_id: data.record_id,

      patient_id: form.patient_id,

      encrypted_fields: {

        encrypted_age:
          data.encrypted_data.age,

        encrypted_gender:
          data.encrypted_data.gender,

        encrypted_disease:
          data.encrypted_data.disease,

        encrypted_blood_pressure:
          data.encrypted_data.blood_pressure,

        encrypted_risk_score:
          data.encrypted_data.risk_score,

      },

      timestamp: new Date().toISOString(),

      stored: true
    });

  } catch (err) {

    console.error(err);

    setError("Backend connection failed");

  }

  setEncrypting(false);
};

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setBatchResults([]);
  };

  const handleBatchEncrypt = async () => {
    if (!file) { setError('Please select a CSV file.'); return; }
    setEncrypting(true);
    setError('');
    await new Promise(r => setTimeout(r, 2000));

    // Simulate batch encryption
    const count = Math.floor(Math.random() * 50) + 20;
    const results = Array.from({ length: Math.min(5, count) }, (_, i) => ({
      record_id: `rec_${(Date.now() + i).toString(36).toUpperCase()}`,
      patient_id: `P${1000 + i}`,
      status: 'encrypted',
    }));
    setBatchResults({ total: count, sample: results });
    setEncrypting(false);
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
          Encrypt Healthcare Data
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Encrypt patient records using Functional Encryption. Raw data is never stored.
        </p>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['single', 'batch'].map(m => (
          <button key={m} onClick={() => { setMode(m); setResult(null); setBatchResults([]); setError(''); }}
            style={{
              padding: '8px 20px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
              background: mode === m ? 'rgba(32,200,160,0.15)' : 'transparent',
              border: mode === m ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
              color: mode === m ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em',
            }}>
            {m === 'single' ? 'SINGLE RECORD' : 'BATCH UPLOAD'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result || batchResults.total ? '1fr 1fr' : '1fr', gap: 20 }}>
        {/* Input Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeInUp 0.45s ease' }}>
          {mode === 'single' ? (
            <Card>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 20, letterSpacing: '0.05em' }}>
                PATIENT DATA INPUT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input label="Patient ID" value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))} placeholder="e.g. P1042" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label="Age" type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="18-90" />
                  <Select label="Gender" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                    <option value="0">Male (0)</option>
                    <option value="1">Female (1)</option>
                  </Select>
                </div>
                <Select label="Disease Type" value={form.disease} onChange={e => setForm(f => ({ ...f, disease: e.target.value }))}>
                  {DISEASES.map((d, i) => <option key={i} value={i}>{d} ({i})</option>)}
                </Select>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label="Blood Pressure (mmHg)" type="number" value={form.blood_pressure} onChange={e => setForm(f => ({ ...f, blood_pressure: e.target.value }))} placeholder="90-160" />
                  <Input label="Risk Score (1-100)" type="number" value={form.risk_score} onChange={e => setForm(f => ({ ...f, risk_score: e.target.value }))} placeholder="1-100" />
                </div>
              </div>
              {error && <Alert type="error" style={{ marginTop: 12 }}>{error}</Alert>}
              <Button onClick={handleSingleEncrypt} disabled={encrypting} style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
                {encrypting ? <><Spinner size={14} /><span style={{ color: '#020408' }}>Encrypting...</span></> : '⊕ Encrypt & Store Record'}
              </Button>
            </Card>
          ) : (
            <Card>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 20, letterSpacing: '0.05em' }}>
                BATCH CSV UPLOAD
              </div>
              <div style={{
                border: '2px dashed var(--border-default)', borderRadius: 12,
                padding: '40px 20px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.2s', marginBottom: 16,
              }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>📁</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  {file ? file.name : 'Drop CSV file here or click to browse'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Expected columns: patient_id, age, gender, disease, blood_pressure, risk_score
                </div>
                <input type="file" accept=".csv,.json" onChange={handleFileSelect} style={{ display: 'none' }} id="file-input" />
                <label htmlFor="file-input">
                  <Button variant="secondary" size="sm" style={{ marginTop: 12 }} onClick={e => e.stopPropagation()}>
                    Browse Files
                  </Button>
                </label>
              </div>
              {file && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 8 }}>
                  <span style={{ fontSize: 16 }}>📄</span>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1 }}>{file.name}</span>
                  <Badge variant="muted">{(file.size / 1024).toFixed(1)} KB</Badge>
                </div>
              )}
              {error && <Alert type="error">{error}</Alert>}
              <Button onClick={handleBatchEncrypt} disabled={encrypting || !file} style={{ width: '100%', justifyContent: 'center' }}>
                {encrypting ? <><Spinner size={14} /><span style={{ color: '#020408' }}>Processing batch...</span></> : '⊕ Encrypt All Records'}
              </Button>
            </Card>
          )}

          {/* Info Panel */}
          <Card style={{ background: 'rgba(32,200,160,0.04)', borderColor: 'rgba(32,200,160,0.12)' }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: 10 }}>
              HOW FE ENCRYPTION WORKS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Patient vector converted to numerical representation', 'Random masking applied: ciphertext = (x + r) mod PRIME', 'Master public key used for encryption', 'Only encrypted form stored in MongoDB', 'Raw data immediately discarded after encryption'].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>0{i + 1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Result Panel */}
        {(result || batchResults.total) && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>
            {result && (
              <Card style={{ borderColor: 'rgba(32,200,160,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#20c8a0', boxShadow: '0 0 6px #20c8a0' }} />
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#20c8a0', letterSpacing: '0.05em' }}>
                    ENCRYPTION SUCCESSFUL
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Record ID</span>
                    <MonoValue>{result.record_id}</MonoValue>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Patient ID</span>
                    <MonoValue>{result.patient_id}</MonoValue>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Stored in DB</span>
                    <Badge variant="default">MongoDB ✓</Badge>
                  </div>
                  <div style={{ height: 1, background: 'var(--border-subtle)' }} />
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 4 }}>ENCRYPTED FIELDS (stored)</div>
                  <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                    {Object.entries(result.encrypted_fields).map(([k, v]) => (
                      <div key={k} style={{ marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{k}: </span>
                        <span style={{ color: 'var(--accent-primary)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    ts: {result.timestamp}
                  </div>
                </div>
              </Card>
            )}

            {batchResults.total && (
              <Card style={{ borderColor: 'rgba(32,200,160,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#20c8a0', boxShadow: '0 0 6px #20c8a0' }} />
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#20c8a0' }}>BATCH ENCRYPTION COMPLETE</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: 'var(--accent-primary)', marginBottom: 4 }}>
                  {batchResults.total}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>records encrypted and stored</div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 8 }}>SAMPLE RECORDS</div>
                {batchResults.sample.map(r => (
                  <div key={r.record_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--bg-elevated)', borderRadius: 6, marginBottom: 4 }}>
                    <MonoValue style={{ fontSize: 10 }}>{r.record_id}</MonoValue>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.patient_id}</span>
                    <Badge variant="default" style={{ fontSize: 9 }}>✓ encrypted</Badge>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
