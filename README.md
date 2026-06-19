# EG-healthcare

An integrated healthcare platform for managing patients, doctors, and appointments, with an AI RAG Agent that helps doctors query patient medical history based on stored records.

## Overview

| Layer | Technology | Default Port |
|-------|------------|--------------|
| Frontend | Next.js 15, React, Tailwind, shadcn/ui | `3000` |
| Backend | NestJS, TypeORM | `8000` |
| Database | PostgreSQL | `5432` |
| Authentication | Firebase Authentication | — |
| RAG / Embeddings | LangChain + LM Studio + ChromaDB | `1234` / `8001` |
| Push Notifications | Firebase Admin (FCM) | — |
| General AI Chat | Google Gemini | — |

## Project Structure (Monorepo)

```
EG-healthcare/
├── apps/
│   ├── api/          # NestJS REST API
│   ├── web/          # Next.js Frontend
│   └── docs/         # Excalidraw diagrams
├── packages/
│   └── types/        # Shared types (if any)
├── chroma/           # Local ChromaDB data
├── docs/             # Project documentation
└── package.json      # Turbo workspaces
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (see docs/SETUP.md)
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env and apps/web/lib/firebase.ts for your Firebase project

# 3. Run PostgreSQL locally

# 4. (Optional for RAG) Start LM Studio on port 1234
# 5. (Optional for RAG) Start ChromaDB:
chroma run --host 0.0.0.0 --port 8001

# 6. Run Frontend + Backend together
npm run dev
```

- Web: http://localhost:3000  
- API: http://localhost:8000  

## Roles

| Role | Description |
|------|-------------|
| `patient` | Book appointments, view records, chat with assistant |
| `doctor` | Manage appointments and patients, add medical records, query RAG Agent |

User ID (`userID`) = Firebase `uid`.  
Patient ID (`patientID`) and Doctor ID (`doctorID`) match the same `uid` created during registration.

## Key Features

- **Sign in / Register** via Firebase (Email/Password + Google)
- **Appointment booking** between patient and doctor with FCM notification to the doctor
- **Medical records** (`MedicalHistory`) with RAG indexing in ChromaDB
- **RAG Agent for doctors** — answers based on records only (hallucination prevention)
- **X-ray analysis** via Gemini (`POST /ai-analysis/xray`)
- **General AI chat** (`POST /ai/chat`)

## Detailed Documentation

| File | Contents |
|------|----------|
| [docs/SETUP.md](docs/SETUP.md) | Environment setup, PostgreSQL, Firebase, LM Studio, Chroma |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, entities, data flows |
| [docs/API.md](docs/API.md) | Full REST API reference |
| [docs/RAG.md](docs/RAG.md) | RAG Agent and medical history system |

## Common Troubleshooting

### `Patient not found` when booking an appointment

Occurs when the user is signed in via Firebase **without** a row in the `patient` table.  
**Fix:** Register via `/register` as a `patient` (creates `/users` + `/patients`), or create the record manually:

```http
POST /patients
Content-Type: application/json

{
  "patientID": "<firebase-uid>",
  "name": "Patient Name",
  "email": "patient@example.com",
  "phoneNumber": "01000000000",
  "age": 30,
  "gender": "Male",
  "address": "Cairo"
}
```

### `Failed to sign in` despite successful Firebase auth

Usually the backend is down or the `/users/:uid` request failed. After recent fixes, redirect to the dashboard still works even if fetching the role from the API fails.

### RAG not working

The API keeps running; RAG is only active when LM Studio (`1234`) and ChromaDB (`8001`) are available.

## Useful Commands

```bash
npm run dev          # Run api + web (Turbo)
npm run start:api    # API only
npm run build        # Build all apps
```

## License

Private — EG-healthcare team.
