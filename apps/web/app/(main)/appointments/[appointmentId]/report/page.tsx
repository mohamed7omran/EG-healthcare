"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";

export default function AppointmentReportPage() {
  const params = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const { role, appointments, updateAppointment } = useApp();
  const [report, setReport] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const appointmentId = Number(params.appointmentId);

  const appointment = useMemo(
    () => appointments.find((a) => a.appointmentID === appointmentId),
    [appointments, appointmentId],
  );

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

  const handleSaveReport = () => {
    if (!report.trim()) return;
    setIsSaving(true);

    updateAppointment(
      appointment.appointmentID,
      {
        report: report.trim(),
        status: "Completed",
      },
      {
        onSuccess: () => {
          setIsSaving(false);
          router.push("/appointments");
        },
        onError: () => {
          setIsSaving(false);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Write Patient Report
          </h1>
          <p className="mt-2 text-muted-foreground">
            Document findings and complete this consultation.
          </p>
        </div>
        <Link href="/appointments">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{appointment.patient.name}</span>
            <Badge>{appointment.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{appointment.patient.email || "No email available"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(parseISO(appointment.date), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{appointment.time}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="report">Consultation report</Label>
            <Textarea
              id="report"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              rows={10}
              placeholder="Write diagnosis, clinical notes, medications, and follow-up instructions..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Link href="/appointments">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              className="gradient-primary border-0"
              onClick={handleSaveReport}
              disabled={!report.trim() || isSaving}
            >
              {isSaving ? "Saving..." : "Save and complete appointment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
