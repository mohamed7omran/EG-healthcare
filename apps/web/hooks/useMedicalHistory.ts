import { useMutation, useQuery } from "@tanstack/react-query";
import {
  chatWithPatientHistory,
  generateReportTemplate,
  getPatientInsights,
  createMedicalRecord,
  ReportTemplateType,
  MedicalHistoryType,
} from "@/api/medicalHistory";

export const usePatientInsights = (patientID: string, enabled = true) =>
  useQuery({
    queryKey: ["patient-insights", patientID],
    queryFn: () => getPatientInsights(patientID),
    enabled: !!patientID && enabled,
    staleTime: 60_000,
    retry: 1,
  });

export const useMedicalHistoryChat = () =>
  useMutation({
    mutationFn: chatWithPatientHistory,
  });

export const useGenerateReportTemplate = () =>
  useMutation({
    mutationFn: (payload: {
      patientID: string;
      template: ReportTemplateType;
      clinicalNotes?: string;
    }) => generateReportTemplate(payload),
  });

export const useCreateMedicalRecord = () =>
  useMutation({
    mutationFn: (payload: {
      patientID: string;
      content: string;
      type: MedicalHistoryType;
      title?: string;
      summary?: string;
      visitDate?: string;
      doctorName?: string;
      doctorID?: string;
    }) => createMedicalRecord(payload),
  });
