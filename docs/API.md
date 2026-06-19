# REST API Reference — EG-healthcare

**Base URL:** `http://localhost:8000`  
**Content-Type:** `application/json` (unless stated otherwise)

---

## Users — `/users`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/users` | Create user |
| `GET` | `/users` | List all users |
| `GET` | `/users/:id` | Get user by Firebase uid |
| `PATCH` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete user |
| `POST` | `/users/save-fcm-token/:id` | Save FCM token |

### POST /users

```json
{
  "userID": "firebase-uid",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "patient",
  "fcmToken": "optional-fcm-token"
}
```

---

## Patients — `/patients`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/patients` | Create patient |
| `GET` | `/patients` | List all patients |
| `GET` | `/patients/:id` | Get patient by patientID |
| `PATCH` | `/patients/:id` | Update patient |
| `DELETE` | `/patients/:id` | Delete patient |

### POST /patients

```json
{
  "patientID": "firebase-uid",
  "name": "Ahmed Ali",
  "age": 28,
  "gender": "Male",
  "phoneNumber": "01012345678",
  "email": "ahmed@example.com",
  "address": "Cairo, Egypt"
}
```

---

## Doctors — `/doctors`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/doctors` | Create doctor |
| `GET` | `/doctors` | List all doctors |
| `GET` | `/doctors/:id` | Get doctor by doctorID |
| `PATCH` | `/doctors/:id` | Update doctor |
| `DELETE` | `/doctors/:id` | Delete doctor |

### POST /doctors

```json
{
  "doctorID": "firebase-uid",
  "name": "Dr. Sara",
  "age": 40,
  "gender": "Female",
  "phoneNumber": "01098765432",
  "email": "sara@clinic.com",
  "address": "Giza",
  "specialty": "Cardiology",
  "experience": "10 years",
  "bio": "Consultant Cardiologist"
}
```

---

## Appointments — `/appointments`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/appointments` | Create appointment |
| `GET` | `/appointments` | List all appointments |
| `GET` | `/appointments?patientID=` | Appointments by patient |
| `GET` | `/appointments?doctorID=` | Appointments by doctor |
| `GET` | `/appointments/doctors/:id/patients` | Patients who visited a doctor |
| `GET` | `/appointments/:id` | Single appointment |
| `PATCH` | `/appointments/:id` | Update (status, report, etc.) |
| `DELETE` | `/appointments/:id` | Delete appointment |

### POST /appointments

```json
{
  "patientID": "patient-firebase-uid",
  "doctorID": "doctor-firebase-uid",
  "date": "2026-06-15T00:00:00.000Z",
  "time": "10:00 AM",
  "type": "Consultation",
  "status": "Pending"
}
```

**Status values:** `Pending` | `Scheduled` | `Completed` | `Cancelled`

**Common errors:**

| Code | Message | Cause |
|------|---------|-------|
| 404 | `Patient not found` | No row in `patient` with that `patientID` |
| 404 | `Doctor not found` | No doctor record |
| 404 | `user not found` | No User record for the doctor (FCM notification) |

---

## Medical History — `/medical-history`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/medical-history` | Add medical record |
| `POST` | `/medical-history/search` | Semantic search (RAG + fallback) |
| `POST` | `/medical-history/chat` | **Ask the RAG Agent** |
| `GET` | `/medical-history/patient/:id` | All records for a patient |
| `GET` | `/medical-history/:id` | Single record |
| `PATCH` | `/medical-history/:id` | Update record |
| `DELETE` | `/medical-history/:id` | Soft delete (`isActive=false`) |

### POST /medical-history

```json
{
  "patientID": "patient-uid",
  "content": "Diagnosis: hypertension. Treatment: ...",
  "type": "diagnosis",
  "title": "Visit 2026-06-01",
  "summary": "Elevated blood pressure",
  "visitDate": "2026-06-01",
  "doctorName": "Dr. Sara",
  "doctorID": "doctor-uid",
  "metadata": { "department": "cardiology" }
}
```

**type:** `diagnosis` | `prescription` | `lab_report` | `procedure` | `note` | `other`

### POST /medical-history/chat — RAG Agent

```json
{
  "patientID": "patient-uid",
  "question": "Does the patient have any drug allergies?",
  "limit": 5
}
```

**Response:**

```json
{
  "answer": "LLM answer text...",
  "contextSources": [
    {
      "content": "...",
      "metadata": { "patientID": "...", "recordId": "..." }
    }
  ]
}
```

### POST /medical-history/search

```json
{
  "patientID": "patient-uid",
  "query": "blood pressure",
  "limit": 5
}
```

---

## RAG (Legacy) — `/rag`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/rag/feed` | Add text to vector store |
| `GET` | `/rag/ask?question=` | General question without patient filter |

---

## AI Chat — `/ai`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/ai/chat` | General Gemini chat |

```json
{ "message": "What are the symptoms of influenza?" }
```

```json
{ "reply": "..." }
```

---

## AI Analysis — `/ai-analysis`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/ai-analysis/xray` | Analyze X-ray image (multipart) |

**Form field:** `file` (image buffer)

---

## Health Check

| Method | Path | Response |
|--------|------|----------|
| `GET` | `/` | `Hello World!` |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 404 | Not found |
| 503 | RAG / LM Studio unavailable |
