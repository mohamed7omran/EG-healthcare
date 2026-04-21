"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { mockPatients } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { ArrowLeft, User, FileText, Calendar, Activity } from "lucide-react";

export default function PatientProfile() {
  const params = useParams();
  const id = params?.id as string;
  const { appointments } = useApp();

  const patient = mockPatients.find((p) => p.id === id);
  const patientAppointments = appointments.filter((a) => a.patientId === id);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
          <User className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-foreground">
            Patient not found
          </h3>
          <Link href="/Patients">
            <Button className="mt-4" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Button>
          </Link>
        </div>
    );
  }

  return (
    <>
      {/* Back Button */}
      <Link href="/Patients" className="inline-block mb-6">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
      </Link>

      {/* Patient Header */}
      <div className="mb-8 medical-card">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar className="h-24 w-24 border-4 border-primary/10">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {patient.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{patient.age} years old</Badge>
              <Badge variant="secondary" className="capitalize">
                {patient.gender}
              </Badge>
              <Badge className="bg-success/10 text-success border-success/20">
                Active Patient
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/chat">
              <Button className="gradient-primary border-0">
                Send Message
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Medical Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <FileText className="h-5 w-5 text-primary" />
              Medical Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {patient.medicalSummary}
            </p>
            <Separator className="my-6" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Blood Type
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">A+</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Allergies
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  None Known
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Last Visit
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  Jan 15, 2025
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Next Appointment
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  Jan 27, 2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Activity className="h-5 w-5 text-primary" />
              Patient Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
              <span className="text-sm text-muted-foreground">
                Total Visits
              </span>
              <span className="text-lg font-bold text-foreground">
                {patientAppointments.length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-lg font-bold text-success">
                {
                  patientAppointments.filter((a) => a.status === "completed")
                    .length
                }
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
              <span className="text-sm text-muted-foreground">Upcoming</span>
              <span className="text-lg font-bold text-info">
                {
                  patientAppointments.filter((a) => a.status === "scheduled")
                    .length
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment History */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Appointment History
        </h2>
        {patientAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patientAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} showPatient />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">
                No appointments yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This patient has no appointment history.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
