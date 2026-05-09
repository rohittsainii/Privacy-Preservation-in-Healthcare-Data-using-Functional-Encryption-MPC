import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, StatusDot } from '../components/UI';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';



// ============================================
// STATIC CHART DATA
// ============================================

const computeData = [
  { name: 'avg_age', count: 34 },
  { name: 'disease_freq', count: 28 },
  { name: 'risk_score', count: 19 },
  { name: 'bp_avg', count: 15 },
];

const diseaseData = [
  { name: 'Diabetes', value: 32, color: '#20c8a0' },
  { name: 'Hypertension', value: 27, color: '#0ea5e9' },
  { name: 'Cardiac', value: 18, color: '#8b5cf6' },
  { name: 'Respiratory', value: 13, color: '#f59e0b' },
  { name: 'Other', value: 10, color: '#4d6660' },
];



const TYPE_COLORS = {

  COMPUTE: '#8b5cf6',
  ENCRYPT: '#20c8a0',
  MPC: '#0ea5e9',
  KEYGEN: '#f59e0b',

};


// ============================================
// TOOLTIP
// ============================================

const CustomTooltip = ({
  active,
  payload,
  label
}) => {

  if (active && payload?.length) {

    return (

      <div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          padding: '8px 12px',
        }}
      >

        <div
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: 13,
            color: 'var(--accent-primary)',
            fontWeight: 600
          }}
        >
          {payload[0].value}
        </div>

      </div>
    );
  }

  return null;
};


// ============================================
// DASHBOARD
// ============================================

export default function DashboardPage() {

  const { user } = useAuth();

  const [tick, setTick] = useState(0);

  const [realStats, setRealStats] = useState({

    totalRecords: 0,
    todayEncryptions: 0,
    activeMPCSessions: 0,
    totalComputations: 0

  });

  const [analytics, setAnalytics] = useState({

    encryptionData: [],
    recentActivity: []

  });



  // ==========================================
  // FETCH STATS
  // ==========================================

  useEffect(() => {

    fetchStats();

    const t = setInterval(() => {

      setTick(v => v + 1);

      fetchStats();

    }, 3000);

    return () => clearInterval(t);

  }, []);



  const fetchStats = async () => {

    try {

      // ======================================
      // STATS
      // ======================================

      const response = await fetch(
        'http://localhost:3000/api/stats'
      );

      const data = await response.json();

      if (data.success) {

        setRealStats(data.stats);
      }


      // ======================================
      // ANALYTICS
      // ======================================

      const analyticsResponse =
        await fetch(
          'http://localhost:3000/api/dashboard-analytics'
        );

      const analyticsData =
        await analyticsResponse.json();

      if (analyticsData.success) {

        setAnalytics(
          analyticsData.analytics
        );
      }

    } catch (err) {

      console.error(err);
    }
  };



  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  const stats = [

    {
      label: 'Encrypted Records',
      value: realStats.totalRecords,
      delta: `${realStats.todayEncryptions} today`,
      color: '#20c8a0',
      icon: '⊕'
    },

    {
      label: 'FE Computations',
      value: realStats.totalComputations,
      delta: 'secure queries',
      color: '#8b5cf6',
      icon: '∑'
    },

    {
      label: 'MPC Aggregations',
      value: realStats.activeMPCSessions,
      delta: 'simulated',
      color: '#0ea5e9',
      icon: '⋈',
      live: true
    },

    {
      label: 'Function Keys Issued',
      value: '89',
      delta: '+2 today',
      color: '#f59e0b',
      icon: '⌗'
    }

  ];



  return (

    <div
      style={{
        padding: '28px 32px',
        maxWidth: 1200,
        margin: '0 auto'
      }}
    >

      {/* HEADER */}

      <div
        style={{
          marginBottom: 28
        }}
      >

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >

          <div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 22,
                color: 'var(--text-primary)',
                marginBottom: 4
              }}
            >
              System Overview
            </h1>

            <p
              style={{
                fontSize: 12,
                color: 'var(--text-secondary)'
              }}
            >
              Welcome back,
              {' '}
              <span
                style={{
                  color: 'var(--accent-primary)'
                }}
              >
                {user?.name}
              </span>
            </p>

          </div>


          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >

            <StatusDot status="active" />

            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)'
              }}
            >
              SYSTEM OPERATIONAL
            </span>

          </div>

        </div>
      </div>



      {/* STATS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24
        }}
      >

        {stats.map((s) => (

          <Card key={s.label}>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 12
              }}
            >

              <span
                style={{
                  fontSize: 20
                }}
              >
                {s.icon}
              </span>

              <span
                style={{
                  fontSize: 10,
                  color: '#20c8a0'
                }}
              >
                {s.delta}
              </span>

            </div>


            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: s.color
              }}
            >
              {s.value}
            </div>

            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)'
              }}
            >
              {s.label}
            </div>

          </Card>
        ))}
      </div>



      {/* CHARTS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 16,
          marginBottom: 24
        }}
      >

        {/* ENCRYPTION ACTIVITY */}

        <Card>

          <div style={{ marginBottom: 16 }}>

            <div
              style={{
                fontSize: 13,
                fontWeight: 600
              }}
            >
              Encryption Activity
            </div>

          </div>

          <ResponsiveContainer
            width="100%"
            height={180}
          >

            <AreaChart
              data={analytics.encryptionData}
            >

              <defs>

                <linearGradient
                  id="grad1"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#20c8a0"
                    stopOpacity={0.2}
                  />

                  <stop
                    offset="95%"
                    stopColor="#20c8a0"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <XAxis dataKey="day" />
              <YAxis />

              <Tooltip
                content={<CustomTooltip />}
              />

              <Area
                type="monotone"
                dataKey="records"
                stroke="#20c8a0"
                fill="url(#grad1)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </Card>



        {/* DISEASE DISTRIBUTION */}

        <Card>

  <div style={{ marginBottom: 16 }}>

    <div
      style={{
        fontSize: 13,
        fontWeight: 600
      }}
    >
      Disease Distribution
    </div>

  </div>

  <ResponsiveContainer
    width="100%"
    height={180}
  >

    <PieChart>

      <Pie
        data={diseaseData}
        cx="50%"
        cy="50%"
        innerRadius={40}
        outerRadius={65}
        paddingAngle={3}
        dataKey="value"
      >

        {diseaseData.map((entry, i) => (

          <Cell
            key={i}
            fill={entry.color}
          />

        ))}

      </Pie>

      <Tooltip />

    </PieChart>

  </ResponsiveContainer>


  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 8
    }}
  >

    {diseaseData.map(d => (

      <div
        key={d.name}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}
      >

        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: d.color
          }}
        />

        <span
          style={{
            fontSize: 10,
            color: 'var(--text-muted)'
          }}
        >
          {d.name}
        </span>

      </div>

    ))}

  </div>

</Card>

      </div>



      {/* RECENT ACTIVITY */}

      <Card>

        <div
          style={{
            marginBottom: 16,
            fontWeight: 600
          }}
        >
          Recent Activity
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}
        >

          {analytics.recentActivity.map(item => (

            <div
              key={item.id}
              style={{
                padding: '10px',
                borderRadius: 8,
                background: 'var(--bg-elevated)'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >

                <span
                  style={{
                    color:
                      TYPE_COLORS[item.type]
                  }}
                >
                  {item.type}
                </span>

                <span
                  style={{
                    fontSize: 10
                  }}
                >
                  {item.time}
                </span>

              </div>

              <div
                style={{
                  marginTop: 4
                }}
              >
                {item.func}
              </div>

            </div>

          ))}

        </div>

      </Card>

    </div>
  );
}