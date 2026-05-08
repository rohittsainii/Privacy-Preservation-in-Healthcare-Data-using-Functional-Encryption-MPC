import React from 'react';

export function RecordsPage() {

  const [records, setRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {

    fetchRecords();

  }, []);

  const fetchRecords = async () => {

    try {

      const response = await fetch(
        'http://localhost:5000/api/records'
      );

      const data = await response.json();

      if (data.success) {

        setRecords(data.records);

      } else {

        setError('Failed to fetch records');
      }

    } catch (err) {

      console.error(err);

      setError('Backend connection failed');

    } finally {

      setLoading(false);
    }
  };



  return (

    <div
      style={{
        minHeight: '100vh',
        background: '#020817',
        color: 'white',
        padding: '40px'
      }}
    >

      <h1
        style={{
          fontSize: '42px',
          marginBottom: '10px'
        }}
      >
        Encrypted Healthcare Records
      </h1>

      <p
        style={{
          color: '#94a3b8',
          marginBottom: '40px'
        }}
      >
      </p>


      {loading && (

        <div style={{ color: '#22d3ee' }}>
          Loading records...
        </div>
      )}


      {error && (

        <div
          style={{
            background: '#450a0a',
            border: '1px solid red',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
            color: '#f87171'
          }}
        >
          {error}
        </div>
      )}


      <div
        style={{
          display: 'grid',
          gap: '20px'
        }}
      >

        {records.map((record) => (

          <div
            key={record._id}
            style={{
              background: '#0f172a',
              border: '1px solid #164e63',
              borderRadius: '18px',
              padding: '24px'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}
            >

              <div>

                <h2
                  style={{
                    color: '#22d3ee',
                    fontSize: '22px'
                  }}
                >
                  {record.record_id}
                </h2>

                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: '14px'
                  }}
                >
                  Patient ID:
                  {record.patient_id}
                </div>

              </div>


              <div
                style={{
                  color: '#4ade80'
                }}
              >
                Encrypted ✓
              </div>

            </div>


            <div
              style={{
                display: 'grid',
                gap: '14px'
              }}
            >

              <div>
                <strong>Encrypted Age:</strong>
                <div>{record.encrypted_age}</div>
              </div>

              <div>
                <strong>Encrypted Gender:</strong>
                <div>{record.encrypted_gender}</div>
              </div>

              <div>
                <strong>Encrypted Disease:</strong>
                <div>{record.encrypted_disease}</div>
              </div>

              <div>
                <strong>Encrypted Blood Pressure:</strong>
                <div>{record.encrypted_blood_pressure}</div>
              </div>

              <div>
                <strong>Encrypted Risk Score:</strong>
                <div>{record.encrypted_risk_score}</div>
              </div>

            </div>


            <div
              style={{
                marginTop: '18px',
                fontSize: '12px',
                color: '#64748b'
              }}
            >
              Stored At:
              {' '}
              {new Date(record.timestamp)
                .toLocaleString()}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}


export function ResultsPage() {

  return (

    <div
      style={{
        minHeight: '100vh',
        background: '#020817',
        color: 'white',
        padding: '40px'
      }}
    >

      <h1 style={{ fontSize: '40px' }}>
        Results Page
      </h1>

    </div>
  );
}


export function KeysPage() {

  return (

    <div
      style={{
        minHeight: '100vh',
        background: '#020817',
        color: 'white',
        padding: '40px'
      }}
    >

      <h1 style={{ fontSize: '40px' }}>
        Keys Page
      </h1>

    </div>
  );
}