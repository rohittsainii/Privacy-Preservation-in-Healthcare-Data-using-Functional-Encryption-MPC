# Privacy Preservation in Healthcare Data using Functional Encryption & MPC

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x%2B-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A privacy-preserving healthcare data analytics platform that enables secure computation on encrypted medical records using **Functional Encryption (FE)** and **Secure Multi-Party Computation (MPC)**. This system allows healthcare researchers to perform statistical analysis without ever accessing raw patient data, ensuring HIPAA compliance and cryptographic privacy guarantees.

---

## Project Overview

This project demonstrates how advanced cryptographic techniques can unlock the value of collaborative healthcare data analysis while maintaining rigorous privacy protections. Healthcare organizations can compute aggregate statistics (average age, disease prevalence, risk scores) across multiple institutions without exposing individual patient records.

### Key Features

- **Functional Encryption** — Compute specific functions on encrypted data without decryption
- **Secure Multi-Party Computation** — Collaborative analytics across multiple parties via Shamir's Secret Sharing
- **Privacy-Preserving Statistics** — Average, sum, count, and frequency analysis
- **HIPAA Compliant** — No raw patient data exposure
- **REST API** — Node.js/Express backend with MongoDB storage and audit logging
- **React Dashboard** — Vite-powered React 19 web interface

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              React.js Frontend (Vite, port 5173)            │
│         Data Upload, Computation Requests, Results           │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST
┌───────────────────────▼─────────────────────────────────────┐
│           Node.js Backend — Express (port 5000)              │
│   /api/encrypt  /api/compute  /api/records  /api/stats       │
│   /api/audit-logs  /api/results  /api/health                 │
└──────┬──────────────────────────┬───────────────────────────┘
       │ HTTP                     │ Mongoose
       │                          │
┌──────▼─────────────────┐  ┌─────▼──────────────────────────┐
│ Python Crypto API      │  │      MongoDB Database          │
│ Flask (port 5001)      │  │  • Audit logs                  │
│ • FE Module            │  │  • Encrypted patient records   │
│ • MPC Module           │  │  • Computation results         │
│ • AES Security Layer   │  │                                │
└────────────────────────┘  └────────────────────────────────┘
```

The three services are launched together by `start_project.sh` (Linux/macOS) or `start_project.bat` (Windows).

---

## Quick Start

### Prerequisites

- **Operating System:** Ubuntu 22.04 LTS (or WSL2 on Windows)
- **Python:** 3.10 or higher
- **Node.js:** 20.x or higher
- **MongoDB:** 7.0 or higher

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Devansh42-cyber/Privacy-Preservation-in-Healthcare-Data-using-Functional-Encryption-MPC.git
cd Privacy-Preservation-in-Healthcare-Data-using-Functional-Encryption-MPC
```

#### 2. Setup Python Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install flask  # required by crypto_api.py
```

#### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

#### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

#### 5. Start MongoDB

```bash
sudo service mongodb start
```

#### 6. (Optional) Configure Environment Variables

Create `backend/.env` to override defaults:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare_privacy
```

#### 7. Generate Synthetic Dataset

```bash
source venv/bin/activate
python dataset_generator.py
```

This produces `healthcare_dataset.csv` for testing.

#### 8. Start All Services

```bash
./start_project.sh
```

On Windows:

```bat
start_project.bat
```

This launches the backend (5000), the Python crypto API (5001), and the frontend (5173) in parallel.

- Frontend dashboard: http://localhost:5173
- Backend API: http://localhost:5000
- Crypto API: http://localhost:5001

---

## Project Structure

```
Privacy-Preservation-in-Healthcare-Data-using-Functional-Encryption-MPC/
├── crypto_core/                 # Python cryptographic modules
│   ├── fe_module/
│   │   ├── fe_core.py           # Functional Encryption primitives
│   │   ├── aggregation.py       # Aggregation functions over ciphertexts
│   │   └── __init__.py
│   ├── mpc_module/
│   │   ├── mpc_core.py          # MPC orchestration
│   │   ├── shamir.py            # Shamir's Secret Sharing
│   │   └── __init__.py
│   ├── security/
│   │   └── aes.py               # AES helpers used by the Flask API
│   ├── utils/
│   │   ├── dataset_utils.py
│   │   ├── generate_dataset.py
│   │   └── __init__.py
│   └── tests/
│       └── test_full_pipeline.py
│
├── backend/                     # Node.js Express backend
│   ├── models/
│   │   └── AuditLog.js
│   ├── uploads/                 # CSV upload destination (multer)
│   ├── server.js                # All routes live here
│   └── package.json
│
├── frontend/                    # React 19 + Vite dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── crypto_api.py                # Flask bridge between backend and crypto_core
├── dataset_generator.py         # Synthetic CSV generator
├── start_project.sh             # Launches backend + crypto API + frontend
├── start_project.bat            # Windows equivalent
├── requirements.txt             # Python dependencies
├── package.json                 # Root tooling (prettier, csv parsing)
├── LICENSE
└── README.md
```

---

## Key Components

### Functional Encryption Module

Implements Inner Product Functional Encryption, allowing computation of specific linear functions on encrypted healthcare data.

```python
from crypto_core.fe_module.fe_core import Setup, KeyGen, Encrypt, Decrypt

MPK, MSK = Setup(vector_dimension=5)

patient_vector = [45, 0, 2, 130, 65]  # [age, gender, disease_id, bp, risk]
ciphertext = Encrypt(MPK, patient_vector)

function_vector = [1, 0, 0, 0, 0]      # extract age component
function_key = KeyGen(MSK, function_vector)

result = Decrypt(function_key, ciphertext)  # → 45
```

### Secure Multi-Party Computation

Enables multiple healthcare institutions to jointly compute statistics without revealing individual datasets. Built on Shamir's Secret Sharing (`crypto_core/mpc_module/shamir.py`).

```python
from crypto_core.mpc_module.mpc_core import secure_sum

# Each hospital contributes a local count; only the aggregate is revealed.
total = secure_sum([local_count])
```

---

## Security & Privacy

### Cryptographic Guarantees

- **Functional Encryption:** only authorized function outputs are revealed; plaintext stays hidden
- **Secret Sharing:** semi-honest security via Shamir's Secret Sharing
- **No Single Point of Failure:** trust distributed across multiple parties
- **Threshold Security:** requires t-of-n parties to reconstruct secrets

### Compliance

- HIPAA-compatible: no raw PHI storage or exposure
- Data minimization: only function-specific results disclosed
- Purpose limitation: function keys restrict computation types
- Audit trail: every computation request is logged via `models/AuditLog.js`

### Security Assumptions

- Semi-honest adversary model (parties follow the protocol but may try to infer extra information)
- Secure transport (TLS/HTTPS) is expected in production deployments
- Cryptographic keys must be stored and rotated securely

---

## User Roles

1. **Healthcare Data Owner** — uploads encrypted patient datasets, manages local encryption keys.
2. **Research Analyst** — requests function-specific computation keys, submits privacy-preserving queries.
3. **System Administrator** — manages master encryption keys, configures MPC sessions, monitors health.
4. **Privacy Officer** — reviews audit logs, verifies compliance, monitors access patterns.

---

## Testing

```bash
# Python tests
source venv/bin/activate
pytest crypto_core/tests/ -v
```

The backend currently has no automated test suite (`npm test` is a placeholder).

---

## API Reference

All backend routes are defined in `backend/server.js`.

### Health Check

```http
GET /api/health
```

### Encrypt a Patient Record

```http
POST /api/encrypt
Content-Type: application/json

{
  "patient_id": "P001",
  "age": 45,
  "gender": "Male",
  "disease": "Diabetes",
  "blood_pressure": 130,
  "risk_score": 65
}
```

### Run a Computation

```http
POST /api/compute
Content-Type: application/json

{
  "function_type": "average_age",
  "filter": { "disease": "Diabetes" }
}
```

### Other Endpoints

| Method | Path              | Purpose                              |
|--------|-------------------|--------------------------------------|
| GET    | `/api/records`    | List encrypted patient records       |
| GET    | `/api/stats`      | Aggregate dataset statistics         |
| GET    | `/api/audit-logs` | Retrieve audit trail                 |
| GET    | `/api/results`    | List past computation results        |

The Python crypto API (`crypto_api.py`) currently exposes a single `POST /encrypt` route on port 5001 used by the backend for AES encryption helpers.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- **Python:** PEP 8
- **JavaScript / JSX:** Prettier (config in `.prettierrc`); ESLint for the frontend
- **Commits:** clear, descriptive messages

---

## Troubleshooting

**MongoDB connection refused** — start the MongoDB service:

```bash
sudo service mongodb start
```

**`crypto_api.py` won't start** — make sure `flask` is installed in the active virtualenv:

```bash
source venv/bin/activate
pip install flask
```

**Port already in use** — the defaults are 5000 (backend), 5001 (crypto API), 5173 (frontend). Override the backend with `PORT` in `backend/.env`; Vite picks the next free port automatically.

---

## Academic References

1. Boneh, D., Sahai, A., & Waters, B. (2011). *Functional Encryption: Definitions and Challenges*. Theory of Cryptography Conference (TCC).
2. Shamir, A. (1979). *How to Share a Secret*. Communications of the ACM, 22(11), 612–613.
3. Yao, A. C. (1982). *Protocols for Secure Computations*. Proceedings of FOCS, 160–164.
4. Agrawal, S., Libert, B., & Stehlé, D. (2016). *Fully Secure Functional Encryption for Inner Products*. CRYPTO 2016.

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## Team

**University of Petroleum & Energy Studies**
Department of Computer Science & Engineering

- Rohit Saini (500125218)
- KM Anjali (500119189)
- Devansh Baluni (500119907)
- Bhumi Saraswat (500123867)

**Supervisor:** Rahat Naz
**Academic Year:** 2025-2026

---

## Acknowledgments

- MPyC framework by Berry Schoenmakers
- TenSEAL library by OpenMined
- UPES faculty for guidance and support
