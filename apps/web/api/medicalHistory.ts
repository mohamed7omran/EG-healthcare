import { client } from "@/lib/axios";

export type MedicalHistoryType =
  | "diagnosis"
  | "prescription"
  | "lab_report"
  | "procedure"
  | "note"
  | "other";

export type ReportTemplateType =
  | "prescription"
  | "clinical_note"
  | "follow_up";

export interface MedicalHistoryRecord {
  id: string;
  patientID: string;
  content: string;
  type: MedicalHistoryType;
  title?: string;
  summary?: string;
  visitDate?: string;
  doctorName?: string;
  doctorID?: string;
  createdAt: string;
}

export interface PatientInsight {
  id: string;
  type: string;
  label: string;
  content: string;
}

export interface TimelineEntry {
  id: string;
  type: string;
  title: string;
  summary: string;
  visitDate: string;
  doctorName?: string;
}

export interface ChatResponse {
  answer: string;
  contextSources: Array<{ content: string; metadata: Record<string, unknown> }>;
}

export const getPatientInsights = async (patientID: string) => {
  const { data } = await client.get<{
    insights: PatientInsight[];
    timeline: TimelineEntry[];
  }>(`/medical-history/patient/${patientID}/insights`);
  return data;
};

export const chatWithPatientHistory = async (payload: {
  patientID: string;
  question: string;
  limit?: number;
}) => {
  const { data } = await client.post<ChatResponse>(
    "/medical-history/chat",
    payload,
  );
  return data;
};

export const generateReportTemplate = async (payload: {
  patientID: string;
  template: ReportTemplateType;
  clinicalNotes?: string;
}) => {
  const { data } = await client.post<{ template: string; content: string }>(
    "/medical-history/generate-template",
    payload,
  );
  return data;
};

export const createMedicalRecord = async (payload: {
  patientID: string;
  content: string;
  type: MedicalHistoryType;
  title?: string;
  summary?: string;
  visitDate?: string;
  doctorName?: string;
  doctorID?: string;
}) => {
  const { data } = await client.post<MedicalHistoryRecord>(
    "/medical-history",
    payload,
  );
  return data;
};

export const getPatientMedicalHistory = async (patientID: string) => {
  const { data } = await client.get<MedicalHistoryRecord[]>(
    `/medical-history/patient/${patientID}`,
  );
  return data;
};
