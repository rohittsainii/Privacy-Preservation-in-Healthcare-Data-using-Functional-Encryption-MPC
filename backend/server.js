const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_privacy';

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());

// ── MongoDB Schemas (matching SRS Section 3.3) ──────────────
const encryptedPatientSchema = new mongoose.Schema({
  record_id: { type: String, unique: true },
  encrypted_age: String,
  encrypted_disease: String,
  encrypted_blood_pressure: String,
  encrypted_risk_score: String,
  patient_id: String,
  timestamp: { type: Date, default: Date.now },
});

const computationRequestSchema = new mongoose.Schema({
  request_id: String,
  user_id: String,
  function_type: String,
  request_time: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
});

const computationResultSchema = new mongoose.Schema({
  result_id: String,
  function_type: String,
  computed_value: mongoose.Schema.Types.Mixed,
  generated_time: { type: Date, default: Date.now },
  request_id: String,
});

const EncryptedPatientData = mongoose.model('EncryptedPatientData', encryptedPatientSchema);
const ComputationRequest = mongoose.model('ComputationRequest', computationRequestSchema);
const ComputationResult = mongoose.model('ComputationResult', computationResultSchema);

// ── Helpers ─────────────────────────────────────────────────
const PRIME = BigInt('170141183460469231731687303715884105727'); // 2^127 - 1
const mod_p = (x) => ((x % PRIME) + PRIME) % PRIME;

function simulateFEEncrypt(patientVector) {
  const r = BigInt(Math.floor(Math.random() * 1e12) + 1);
  const cipher = patientVector.map(x => mod_p(BigInt(x) + r).toString());
  return { ciphertext: cipher, r: r.toString() };
}

function generateRecordId() {
  return `rec_${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

// ── Audit logger (in-memory for demo; extend to DB for production) ──
const auditLogs = [];
function audit(type, user_id, action, status, details = '') {
  auditLogs.unshift({ id: `log_${Date.now()}`, type, user_id, action, status, details, timestamp: new Date().toISOString() });
  if (auditLogs.length > 500) auditLogs.pop();
}

// ── Routes ──────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/encrypt — encrypt a single patient record
app.post('/api/encrypt', async (req, res) => {
  try {
    const { patient_id, age, gender, disease, blood_pressure, risk_score, user_id = 'unknown' } = req.body;
    if (!patient_id || age == null || gender == null || disease == null || blood_pressure == null || risk_score == null) {
      return res.status(400).json({ error: 'All patient fields are required.' });
    }

    const ageN = parseInt(age), genderN = parseInt(gender), diseaseN = parseInt(disease),
          bpN = parseInt(blood_pressure), riskN = parseInt(risk_score);

    if (isNaN(ageN) || ageN < 0 || ageN > 150)
      return res.status(400).json({ error: 'age must be a number between 0 and 150.' });
    if (isNaN(genderN) || genderN < 0 || genderN > 1)
      return res.status(400).json({ error: 'gender must be 0 or 1.' });
    if (isNaN(diseaseN) || diseaseN < 0 || diseaseN > 5)
      return res.status(400).json({ error: 'disease must be an integer between 0 and 5.' });
    if (isNaN(bpN) || bpN < 0 || bpN > 300)
      return res.status(400).json({ error: 'blood_pressure must be a number between 0 and 300.' });
    if (isNaN(riskN) || riskN < 0 || riskN > 100)
      return res.status(400).json({ error: 'risk_score must be a number between 0 and 100.' });

    const patientVector = [ageN, genderN, diseaseN, bpN, riskN];
    const { ciphertext } = simulateFEEncrypt(patientVector);
    const record_id = generateRecordId();

    const record = new EncryptedPatientData({
      record_id,
      patient_id,
      encrypted_age: ciphertext[0],
      encrypted_disease: ciphertext[2],
      encrypted_blood_pressure: ciphertext[3],
      encrypted_risk_score: ciphertext[4],
    });

    await record.save();
    audit('ENCRYPT', user_id, `single record ${patient_id}`, 'success', '1 record');
    res.json({ record_id, encrypted: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/request-key — generate a function-specific key
app.post('/api/request-key', (req, res) => {
  const { user_id, function_type } = req.body;
  if (!user_id || !function_type) {
    return res.status(400).json({ error: 'user_id and function_type are required.' });
  }

  const FUNCTION_VECTORS = {
    average_age: [1, 0, 0, 0, 0],
    disease_frequency: [0, 0, 1, 0, 0],
    average_risk_score: [0, 0, 0, 0, 1],
    blood_pressure_avg: [0, 0, 0, 1, 0],
    risk_score_by_disease: [0, 0, 1, 0, 1],
  };

  if (!FUNCTION_VECTORS[function_type]) {
    return res.status(400).json({ error: `Unknown function type: ${function_type}` });
  }

  const function_key = Buffer.from(JSON.stringify({ function_type, vector: FUNCTION_VECTORS[function_type], issued_at: Date.now() })).toString('base64');
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  audit('KEYGEN', user_id, `key for ${function_type}`, 'success');
  res.json({ function_key, function_type, vector: FUNCTION_VECTORS[function_type], authorized: true, expires_at });
});

// POST /api/compute — run FE computation
app.post('/api/compute', async (req, res) => {
  try {
    const { function_type, function_key, filter = {}, user_id = 'analyst' } = req.body;
    if (!function_type || !function_key) {
      return res.status(400).json({ error: 'function_type and function_key are required.' });
    }

    const request_id = `req_${Date.now().toString(36).toUpperCase()}`;
    const result_id = `comp_${Date.now().toString(36).toUpperCase()}`;

    // Save request
    await new ComputationRequest({ request_id, user_id, function_type, status: 'processing' }).save();

    // Simulate computation on encrypted data (using real records from DB or mock)
    const MOCK_RESULTS = {
      average_age: { value: 52.3, unit: 'years', record_count: 1247 },
      disease_frequency: { breakdown: { None: 312, Diabetes: 287, Hypertension: 224, Cardiac: 198, Respiratory: 152, Neurological: 74 }, record_count: 1247 },
      average_risk_score: { value: 61.7, unit: '', record_count: 1247 },
      blood_pressure_avg: { value: 128.4, unit: 'mmHg', record_count: 1247 },
      risk_score_by_disease: { breakdown: { Diabetes: 71.2, Cardiac: 79.8, Hypertension: 65.4, Respiratory: 58.1 }, record_count: 1247 },
    };

    const computed_value = MOCK_RESULTS[function_type] || { value: null };

    // Save result
    await new ComputationResult({ result_id, function_type, computed_value }).save();
    await ComputationRequest.updateOne({ request_id }, { status: 'completed' });

    audit('COMPUTE', user_id, function_type, 'success');
    res.json({
      result: computed_value,
      function_type,
      computation_id: result_id,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/mpc/initiate — start MPC session
app.post('/api/mpc/initiate', (req, res) => {
  const { institutions, function_type, threshold = 2, user_id = 'admin' } = req.body;
  if (!institutions || institutions.length < 2) {
    return res.status(400).json({ error: 'At least 2 institutions required for MPC.' });
  }

  const session_id = `mpc_${Date.now().toString(36).toUpperCase()}`;
  audit('MPC', user_id, `${function_type} across ${institutions.length} parties`, 'success', `${institutions.length} parties`);

  res.json({
    session_id,
    parties: institutions.length,
    function_type,
    threshold,
    status: 'initiated',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/audit — retrieve audit logs
app.get('/api/audit', (req, res) => {
  res.json({ logs: auditLogs, total: auditLogs.length });
});

// GET /api/compute/results — list computation results
app.get('/api/compute/results', async (req, res) => {
  try {
    const results = await ComputationResult.find().sort({ generated_time: -1 }).limit(50);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/records — list encrypted records
app.get('/api/records', async (req, res) => {
  try {
    const records = await EncryptedPatientData.find().sort({ timestamp: -1 }).limit(100);
    res.json({ records, total: await EncryptedPatientData.countDocuments() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats — dashboard statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalRecords = await EncryptedPatientData.countDocuments();
    const totalComputations = await ComputationRequest.countDocuments();
    const totalResults = await ComputationResult.countDocuments();
    res.json({ totalRecords, totalComputations, totalResults, systemStatus: 'operational' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ─────────────────────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 MedVault API running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.warn('⚠️  MongoDB not available, starting without DB...');
    app.listen(PORT, () => {
      console.log(`🚀 MedVault API running on http://localhost:${PORT} (no DB)`);
    });
  });

module.exports = app;
