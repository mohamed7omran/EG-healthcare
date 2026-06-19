"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, User, ArrowLeft, Stethoscope } from "lucide-react";
import { SmartReportEditor } from "@/components/clinical/SmartReportEditor";
import { RagInsightsPanel } from "@/components/clinical/RagInsightsPanel";
import {
  usePatientInsights,
  useMedicalHistoryChat,
  useGenerateReportTemplate,
  useCreateMedicalRecord,
} from "@/hooks/useMedicalHistory";
import { ReportTemplateType } from "@/api/medicalHistory";
import { toast } from "sonner";

export default function AppointmentReportPage() {
  const params = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const { role, appointments, updateAppointment, currentUserId } = useApp();

  const [report, setReport] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [generatingTemplate, setGeneratingTemplate] =
    useState<ReportTemplateType | null>(null);
  const [lastTemplate, setLastTemplate] = useState<ReportTemplateType | null>(
    null,
  );

  const appointmentId = Number(params.appointmentId);

  const appointment = useMemo(
    () => appointments.find((a) => a.appointmentID === appointmentId),
    [appointments, appointmentId],
  );

  const patientID =
    appointment?.patient?.patientID || appointment?.patientId || "";

  const {
    data: insightsData,
    isLoading: isLoadingInsights,
  } = usePatientInsights(patientID, !!patientID && role === "doctor");

  const chatMutation = useMedicalHistoryChat();
  const generateMutation = useGenerateReportTemplate();
  const createRecordMutation = useCreateMedicalRecord();

  if (role !== "doctor") {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">
            This page is available for doctors only.
          </p>
          <Link href="/appointments">
            <Button variant="outline" className="mt-4">
              Back to appointments
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!appointment) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">Appointment not found.</p>
          <Link href="/appointments">
            <Button variant="outline" className="mt-4">
              Back to appointments
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const handleGenerateTemplate = async (template: ReportTemplateType) => {
    setGeneratingTemplate(template);
    setLastTemplate(template);
    try {
      const result = await generateMutation.mutateAsync({
        patientID,
        template,
        clinicalNotes: report.trim() || undefined,
      });
      setReport(result.content);
      toast.success(
        template === "prescription"
          ? "Prescription draft generated"
          : "Report draft generated",
      );
    } catch {
      toast.error(
        "Could not generate draft. Check that LM Studio and ChromaDB are running.",
      );
    } finally {
      setGeneratingTemplate(null);
    }
  };

  const handleAskRag = async (question: string) => {
    const result = await chatMutation.mutateAsync({
      patientID,
      question,
      limit: 5,
    });
    return String(result.answer);
  };

  const handleSaveReport = async () => {
    if (!report.trim()) return;
    setIsSaving(true);

    const recordType =
      lastTemplate === "prescription" ? "prescription" : "diagnosis";

    updateAppointment(
      appointment.appointmentID,
      {
        report: report.trim(),
        status: "Completed",
      },
      {
        onSuccess: async () => {
          try {
            await createRecordMutation.mutateAsync({
              patientID,
              content: report.trim(),
              type: recordType,
              title: `Visit ${format(parseISO(appointment.date), "yyyy-MM-dd")} — ${appointment.type}`,
              visitDate: format(parseISO(appointment.date), "yyyy-MM-dd"),
              doctorName: appointment.doctor.name,
              doctorID: currentUserId,
              summary: report.trim().slice(0, 200),
            });
            toast.success("Report saved and added to patient history");
          } catch {
            toast.warning(
              "Appointment completed, but medical history record could not be saved.",
            );
          }
          setIsSaving(false);
          router.push("/appointments");
        },
        onError: () => {
          setIsSaving(false);
          toast.error("Failed to save report");
        },
      },
    );
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-4">
      {/* Header */}
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
              Clinical Workspace
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Smart report editor & RAG assistant for {appointment.patient.name}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {appointment.patient.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(parseISO(appointment.date), "MMM dd, yyyy")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {appointment.time}
            </span>
            <Badge>{appointment.status}</Badge>
          </div>
        </div>
        <Link href="/appointments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Split screen */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <SmartReportEditor
          report={report}
          onReportChange={setReport}
          onGenerateTemplate={handleGenerateTemplate}
          isGenerating={generateMutation.isPending}
          generatingTemplate={generatingTemplate}
          onSave={handleSaveReport}
          isSaving={isSaving}
          patientName={appointment.patient.name}
        />
        <RagInsightsPanel
          insights={insightsData?.insights ?? []}
          timeline={insightsData?.timeline ?? []}
          isLoadingInsights={isLoadingInsights}
          onAsk={handleAskRag}
          isAsking={chatMutation.isPending}
        />
      </div>
    </div>
  );
}
