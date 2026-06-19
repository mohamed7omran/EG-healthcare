# Setup Guide — EG-healthcare

## Requirements

- Node.js ≥ 20
- npm ≥ 10
- PostgreSQL ≥ 14
- Firebase account (Authentication + FCM)
- (Optional) LM Studio + ChromaDB for the RAG Agent

---

## 1. PostgreSQL

```sql
CREATE DATABASE eghealthcare;
```

TypeORM uses `synchronize: true` in development — tables are created automatically when the API starts.

---

## 2. Environment Variables — Backend

Copy the template and edit it:

```bash
cp apps/api/.env.example apps/api/.env
```

| Variable | Description |
|----------|-------------|
| `DB_TYPE` | `postgres` |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5432` |
| `DB_USER` | PostgreSQL username |
| `DB_PASS` | Password |
| `DB_NAME` | `eghealthcare` |
| `GEMINI_API_KEY` | Google Gemini API key |
| `FIREBASE_PROJECT_ID` | From Service Account JSON |
| `FIREBASE_PRIVATE_KEY` | Private key (with `\n`) |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-...@....iam.gserviceaccount.com` |
| `FIREBASE_*` | Remaining Service Account fields (optional) |
| `PORT` | API port (default `8000`) |

> **Note:** Firebase Admin is initialized lazily on the first notification send — after NestJS loads `.env`.

---

## 3. Firebase — Frontend

Edit `apps/web/lib/firebase.ts` with your project settings from Firebase Console:

- Authentication → Email/Password + Google
- Project Settings → Web app config

---

## 4. Firebase — Backend (FCM)

1. Firebase Console → Project Settings → Service Accounts  
2. Generate new private key → JSON  
3. Copy values into `.env` (do not commit the file to Git)

---

## 5. RAG Stack (Optional)

### LM Studio

1. Install LM Studio and run the Local Server on port **1234**
2. Models currently used in `rag.service.ts`:
   - Embeddings: `text-embedding-nomic-embed-text-v1.5`
   - Chat: `qwen/qwen3-8b`

### ChromaDB

```bash
chroma run --host 0.0.0.0 --port 8001
```

Collection: `patient_knowledge_base`  
URL: `http://localhost:8001`

If Chroma/LM Studio is unavailable, the API **does not crash** — RAG is skipped with a warning in the logs.

---

## 6. Running the Project

```bash
# From project root
npm install
npm run dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:8000 |
| Chroma | http://localhost:8001 |

---

## 7. First User

1. Open http://localhost:3000/register  
2. Choose **Patient** or **Doctor** role  
3. Registration creates:
   - Firebase account
   - `POST /users` (role + uid)
   - `POST /patients` or `POST /doctors` depending on role

> Signing in only (without `/register`) **does not** create a patient/doctor record — this causes the `Patient not found` error when booking.

---

## 8. CORS

The API allows `http://localhost:3000` only (configured in `main.ts`).
