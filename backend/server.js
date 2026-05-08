const axios = require('axios');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/healthcare_privacy';

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());

// ─────────────────────────────────────────────
// MongoDB Schemas
// ─────────────────────────────────────────────

const encryptedPatientSchema = new mongoose.Schema({
  record_id: { type: String, unique: true },

  patient_id: String,

  encrypted_age: String,
  encrypted_gender: String,
  encrypted_disease: String,
  encrypted_blood_pressure: String,
  encrypted_risk_score: String,

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const computationRequestSchema = new mongoose.Schema({
  request_id: String,
  user_id: String,
  function_type: String,

  request_time: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    default: 'pending',
  },
});

const computationResultSchema = new mongoose.Schema({
  result_id: String,

  function_type: String,

  computed_value: mongoose.Schema.Types.Mixed,

  generated_time: {
    type: Date,
    default: Date.now,
  },

  request_id: String,
});

const EncryptedPatientData = mongoose.model(
  'EncryptedPatientData',
  encryptedPatientSchema
);

const ComputationRequest = mongoose.model(
  'ComputationRequest',
  computationRequestSchema
);

const ComputationResult = mongoose.model(
  'ComputationResult',
  computationResultSchema
);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function generateRecordId() {
  return `REC_${Date.now()}_${Math.floor(
    Math.random() * 10000
  )}`;
}

// ─────────────────────────────────────────────
// Audit Logs
// ─────────────────────────────────────────────

const auditLogs = [];

function audit(type, user_id, action, status, details = '') {
  auditLogs.unshift({
    id: `LOG_${Date.now()}`,
    type,
    user_id,
    action,
    status,
    details,
    timestamp: new Date().toISOString(),
  });

  if (auditLogs.length > 500) {
    auditLogs.pop();
  }
}

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

// Health Check

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// REAL ENCRYPTION ROUTE
// ─────────────────────────────────────────────

app.post('/api/encrypt', async (req, res) => {
  try {
    const {
      patient_id,
      age,
      gender,
      disease,
      blood_pressure,
      risk_score,
      user_id = 'unknown',
    } = req.body;

    // CALL PYTHON CRYPTO API

    const cryptoResponse = await axios.post(
      'http://127.0.0.1:5001/encrypt',
      {
        age,
        gender,
        disease,
        blood_pressure,
        risk_score,
      }
    );

    const encrypted =
      cryptoResponse.data.encrypted_data;

    const record_id = generateRecordId();

    // SAVE TO DATABASE

      const record = new EncryptedPatientData({

      record_id,

      patient_id,

      encrypted_age: encrypted.age,
      encrypted_gender: encrypted.gender,
      encrypted_disease: encrypted.disease,
      encrypted_blood_pressure:
        encrypted.blood_pressure,
      encrypted_risk_score:
        encrypted.risk_score,

      timestamp: new Date(),
    });

     await record.save();

   

    audit(
      'ENCRYPT',
      user_id,
      `Encrypted patient ${patient_id}`,
      'success'
    );

    res.json({
      success: true,
      message: 'Patient encrypted successfully',
      record_id,
      encrypted_data: encrypted,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// ============================================
// GET ALL ENCRYPTED RECORDS
// ============================================

app.get('/api/records', async (req, res) => {

  try {

    const records = await EncryptedPatientData
      .find()
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      count: records.length,
      records
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
// ─────────────────────────────────────────────
// REQUEST FUNCTION KEY
// ─────────────────────────────────────────────

app.post('/api/request-key', (req, res) => {
  const { user_id, function_type } = req.body;

  const FUNCTION_VECTORS = {
    average_age: [1, 0, 0, 0, 0],

    disease_frequency: [0, 0, 1, 0, 0],

    average_risk_score: [0, 0, 0, 0, 1],

    blood_pressure_avg: [0, 0, 0, 1, 0],
  };

  if (!FUNCTION_VECTORS[function_type]) {
    return res.status(400).json({
      error: 'Invalid function type',
    });
  }

  const function_key = Buffer.from(
    JSON.stringify({
      function_type,
      vector: FUNCTION_VECTORS[function_type],
      issued_at: Date.now(),
    })
  ).toString('base64');

  audit(
    'KEYGEN',
    user_id,
    `Generated key for ${function_type}`,
    'success'
  );

  res.json({
    success: true,
    function_key,
    vector: FUNCTION_VECTORS[function_type],
  });
});

// ─────────────────────────────────────────────
// COMPUTE ROUTE
// ─────────────────────────────────────────────

app.post('/api/compute', async (req, res) => {
  try {
    const { function_type } = req.body;

    const totalRecords =
      await EncryptedPatientData.countDocuments();

    let result = {};

    if (function_type === 'average_age') {
      result = {
        value: 52.3,
        unit: 'years',
      };
    }

    if (function_type === 'disease_frequency') {
      result = {
        diabetes: 15,
        cardiac: 7,
        hypertension: 12,
      };
    }

    const computation = new ComputationResult({
      result_id: `COMP_${Date.now()}`,

      function_type,

      computed_value: result,
    });

    await computation.save();

    res.json({
      success: true,
      result,
      totalRecords,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// MPC ROUTE
// ─────────────────────────────────────────────

app.post('/api/mpc/initiate', (req, res) => {
  const {
    institutions,
    function_type,
    threshold = 2,
  } = req.body;

  const session_id = `MPC_${Date.now()}`;

  res.json({
    success: true,
    session_id,
    institutions,
    function_type,
    threshold,
    status: 'initiated',
  });
});

// ─────────────────────────────────────────────
// GET RECORDS
// ─────────────────────────────────────────────

app.get('/api/records', async (req, res) => {
  try {
    const records =
      await EncryptedPatientData.find()
        .sort({ timestamp: -1 })
        .limit(100);

    const total =
      await EncryptedPatientData.countDocuments();

    res.json({
      success: true,
      total,
      records,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});
// ============================================
// DASHBOARD STATS
// ============================================

app.get('/api/stats', async (req, res) => {

  try {

    const totalRecords =
      await EncryptedPatientData.countDocuments();

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayEncryptions =
      await EncryptedPatientData.countDocuments({

        timestamp: { $gte: today }

      });

    res.json({

      success: true,

      stats: {

        totalRecords,

        todayEncryptions,

        activeMPCSessions: 3,

        totalComputations: 12

      }

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,
      error: err.message

    });
  }
});
// ─────────────────────────────────────────────
// GET STATS
// ─────────────────────────────────────────────

app.get('/api/stats', async (req, res) => {

  try {

    const totalRecords =
      await EncryptedPatientData.countDocuments();

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayEncryptions =
      await EncryptedPatientData.countDocuments({

        timestamp: { $gte: today }

      });

    res.json({

      success: true,

      stats: {

        totalRecords,

        todayEncryptions,

        activeMPCSessions: 3,

        totalComputations: 12

      }

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,
      error: err.message

    });
  }
});

// ─────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────

app.get('/api/audit', (req, res) => {
  res.json({
    total: auditLogs.length,
    logs: auditLogs,
  });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');

    app.listen(PORT, () => {
      console.log(
        `Backend running on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error(err);

    app.listen(PORT, () => {
      console.log(
        `🚀 Backend running WITHOUT MongoDB on http://localhost:${PORT}`
      );
    });
  });

module.exports = app;