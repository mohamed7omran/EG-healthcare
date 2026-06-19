# RAG Agent System — EG-healthcare

## Purpose

Enable doctors to ask questions about a **specific patient** and receive answers based **exclusively** on stored medical records — with reduced hallucination risk.

---

## Tech Stack

| Component | Role |
|-----------|------|
| **PostgreSQL** | Source of truth — `medical_history` table |
| **ChromaDB** | Vector store for semantic search |
| **LM Studio** | Embeddings + LLM (OpenAI-compatible API) |
| **LangChain** | Connects Embeddings + Chroma + Chat |

---

## Medical Record Lifecycle

```
1. Doctor/System → POST /medical-history
2. MedicalHistoryService.addMedicalRecord()
   ├── INSERT into PostgreSQL
   └── RagService.addData(text, { patientID, recordId, type, ... })
3. ChromaDB stores embedding + metadata
```

---

## Doctor Query Flow

```
POST /medical-history/chat
  { patientID, question, limit? }

1. Verify patient exists
2. RagService.similaritySearch(question, limit, { patientID })
   → Semantically closest records for this patient only
3. Merge pageContent → context
4. RagService.answerWithContext(question, context)
   → Strict prompt + LLM
5. Return { answer, contextSources }
```

---

## Prompt Engineering (Hallucination Prevention)

From `rag.service.ts` — `answerWithContext()`:

- Answer **only** from "retrieved medical records"
- If insufficient information → fixed message:  
  **"No information is available in the patient's medical record regarding this."**
- Do not invent medical details

---

## Fallback When RAG Is Unavailable

| Operation | Behavior |
|-----------|----------|
| Add record | Saved to PostgreSQL; Chroma failure = log warning only |
| Search `/search` | Fallback: `includes()` on content/title/summary |
| Chat | Requires RAG — 503 if LM Studio/Chroma unavailable |
| API startup | RAG init failure **does not** stop the server |

---

## LM Studio Setup

1. Server → Port **1234**
2. Models:
   - Embeddings: `text-embedding-nomic-embed-text-v1.5`
   - Chat: `qwen/qwen3-8b`
3. Base URL in code: `http://localhost:1234/v1`

---

## ChromaDB Setup

```bash
chroma run --host 0.0.0.0 --port 8001
```

- Collection: `patient_knowledge_base`
- URL: `http://localhost:8001`
- Local data: `./chroma/`

---

## Vector Store Metadata

```json
{
  "patientID": "firebase-uid",
  "type": "diagnosis",
  "visitDate": "2026-06-01",
  "doctorName": "Dr. Sara",
  "recordId": "uuid-from-postgresql",
  "title": "Visit 2026-06-01"
}
```

`patientID` in metadata is used to filter search results per patient.

---

## Related Endpoints

| Endpoint | Usage |
|----------|-------|
| `POST /medical-history` | Add record |
| `POST /medical-history/chat` | **Ask Agent** |
| `POST /medical-history/search` | Search records (RAG + fallback) |
| `GET /medical-history/patient/:id` | Full list without LLM |
| `POST /rag/feed` | Legacy — no PostgreSQL |
| `GET /rag/ask` | Legacy — no patient filter |

---

## Note: Prisma vs TypeORM

The project uses **TypeORM** with the `MedicalHistory` entity — not Prisma `PatientHistory`.  
Table: `medical_history` with `onDelete: CASCADE` on the `Patient` relation.
