
import Papa from 'papaparse';
import React, { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Alert,
  Badge,
  MonoValue,
  Spinner
} from '../components/UI';

const DISEASES = [
  'None',
  'Diabetes',
  'Hypertension',
  'Cardiac Disease',
  'Respiratory',
  'Neurological'
];

export default function EncryptPage() {

  const [mode, setMode] = useState('single');

  const [form, setForm] = useState({
    patient_id: '',
    age: '',
    gender: '0',
    disease: '0',
    blood_pressure: '',
    risk_score: ''
  });

  const [file, setFile] = useState(null);

  const [encrypting, setEncrypting] = useState(false);

  const [result, setResult] = useState(null);

  const [batchResults, setBatchResults] = useState(null);

  const [csvData, setCsvData] = useState([]);

  const [error, setError] = useState('');


  // =====================================================
  // SINGLE ENCRYPT
  // =====================================================

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
        'http://localhost:5000/api/encrypt',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            patient_id: form.patient_id,
            age,
            gender: parseInt(form.gender),
            disease: parseInt(form.disease),
            blood_pressure: bp,
            risk_score: rs
          })
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Encryption failed');
        setEncrypting(false);
        return;
      }

      setResult({
        record_id: data.record_id,
        patient_id: form.patient_id,

        encrypted_fields: {
          encrypted_age: data.encrypted_data.age,
          encrypted_gender: data.encrypted_data.gender,
          encrypted_disease: data.encrypted_data.disease,
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

      setError('Backend connection failed');
    }

    setEncrypting(false);
  };


  // =====================================================
  // FILE SELECT + CSV PARSE
  // =====================================================

  const handleFileSelect = (e) => {

    const f = e.target.files[0];

    if (!f) return;

    setFile(f);

    setBatchResults(null);

    setError('');

    Papa.parse(f, {

      header: true,

      skipEmptyLines: true,

      complete: (results) => {

        console.log('RAW CSV:', results.data);

        const cleaned = results.data
          .map(row => ({
            patient_id: row.patient_id?.trim(),
            age: row.age,
            gender: row.gender,
            disease: row.disease,
            blood_pressure: row.blood_pressure,
            risk_score: row.risk_score
          }))
          .filter(row => row.patient_id);

        console.log('CLEANED CSV:', cleaned);

        setCsvData(cleaned);

        alert(`Loaded ${cleaned.length} records`);
      },

      error: (err) => {

        console.error(err);

        setError('CSV parsing failed');
      }
    });
  };


  // =====================================================
  // BATCH ENCRYPT
  // =====================================================

  const handleBatchEncrypt = async () => {

    console.log('CSV DATA:', csvData);

    if (!csvData.length) {
      alert('CSV data not loaded');
      return;
    }

    try {

      setEncrypting(true);

      let successCount = 0;

      const sampleRecords = [];

      for (const row of csvData) {

        try {

          const response = await fetch(
            'http://localhost:3000/api/encrypt',
            {
              method: 'POST',

              headers: {
                'Content-Type': 'application/json'
              },

              body: JSON.stringify({
                patient_id: row.patient_id,
                age: Number(row.age),
                gender: Number(row.gender),
                disease: Number(row.disease),
                blood_pressure:
                  Number(row.blood_pressure),
                risk_score:
                  Number(row.risk_score),
              })
            }
          );

          const data = await response.json();

          console.log(data);

          if (data.success) {

            successCount++;

            if (sampleRecords.length < 5) {

              sampleRecords.push({
                id: data.record_id,
                patient: row.patient_id
              });
            }
          }

        } catch (err) {

          console.error(
            'Batch row failed:',
            err
          );
        }
      }

      setBatchResults({
        count: successCount,
        records: sampleRecords
      });

      alert(
        `${successCount} records encrypted successfully`
      );

    } catch (err) {

      console.error(err);

      alert('Batch upload failed');

    } finally {

      setEncrypting(false);
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      style={{
        padding: '28px 32px',
        maxWidth: 900,
        margin: '0 auto'
      }}
    >

      <div style={{ marginBottom: 28 }}>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 22,
            marginBottom: 4
          }}
        >
          Encrypt Healthcare Data
        </h1>

        <p
          style={{
            fontSize: 12,
            color: 'var(--text-secondary)'
          }}
        >
          Encrypt patient records using
          Functional Encryption.
        </p>
      </div>


      {/* TOGGLE */}

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24
        }}
      >

        {['single', 'batch'].map(m => (

          <button
            key={m}

            onClick={() => {
              setMode(m);
              setResult(null);
              setBatchResults(null);
              setError('');
            }}

            style={{
              padding: '8px 20px',
              borderRadius: 8,
              cursor: 'pointer',

              background:
                mode === m
                  ? 'rgba(32,200,160,0.15)'
                  : 'transparent',

              border:
                mode === m
                  ? '1px solid var(--accent-primary)'
                  : '1px solid var(--border-default)',

              color:
                mode === m
                  ? 'var(--accent-primary)'
                  : 'var(--text-secondary)',

              fontFamily: 'var(--font-mono)',
              fontSize: 12,
            }}
          >
            {m === 'single'
              ? 'SINGLE RECORD'
              : 'BATCH UPLOAD'}
          </button>
        ))}
      </div>


      {/* BATCH MODE */}

      {mode === 'batch' && (

        <Card>

          <div
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginBottom: 20
            }}
          >
            BATCH CSV UPLOAD
          </div>


          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
          />


          {file && (
            <div
              style={{
                marginTop: 10,
                marginBottom: 10,
                color: 'var(--text-secondary)'
              }}
            >
              {file.name}
            </div>
          )}


          {error && (
            <Alert type="error">
              {error}
            </Alert>
          )}


          <Button
            onClick={handleBatchEncrypt}
            disabled={encrypting}
            style={{
              marginTop: 14,
              width: '100%',
              justifyContent: 'center'
            }}
          >

            {encrypting
              ? 'Processing...'
              : '⊕ Encrypt All Records'}

          </Button>


          {batchResults && (

            <div style={{ marginTop: 24 }}>

              <div
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color:
                    'var(--accent-primary)'
                }}
              >
                {batchResults.count}
              </div>

              <div
                style={{
                  color: 'var(--text-muted)',
                  marginBottom: 16
                }}
              >
                records encrypted and stored
              </div>


              {(batchResults.records || [])
                .map((r, i) => (

                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    padding: '8px 10px',
                    background:
                      'var(--bg-elevated)',
                    borderRadius: 6,
                    marginBottom: 6
                  }}
                >

                  <MonoValue>
                    {r.id}
                  </MonoValue>

                  <span>
                    {r.patient}
                  </span>

                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
