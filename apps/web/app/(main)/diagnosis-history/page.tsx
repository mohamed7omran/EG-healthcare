"use client";

import { useApp } from "@/context/AppContext";
import { mockDiagnoses, mockDoctors } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  FileText,
  Calendar,
  Stethoscope,
  Pill,
  ArrowRight,
  Activity,
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  ongoing: "bg-warning/10 text-warning border-warning/20",
  resolved: "bg-success/10 text-success border-success/20",
  "follow-up": "bg-info/10 text-info border-info/20",
};

const statusLabels = {
  ongoing: "Ongoing",
  resolved: "Resolved",
  "follow-up": "Follow-up Required",
};

export default function DiagnosisHistory() {
  const { currentUserId } = useApp();

  const patientDiagnoses = mockDiagnoses.filter(
    (d) => d.patientId === currentUserId,
  );
  const sortedDiagnoses = [...patientDiagnoses].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  const ongoingCount = patientDiagnoses.filter(
    (d) => d.status === "ongoing",
  ).length;
  const resolvedCount = patientDiagnoses.filter(
    (d) => d.status === "resolved",
  ).length;
  const followUpCount = patientDiagnoses.filter(
    (d) => d.status === "follow-up",
  ).length;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Diagnosis History
        </h1>
        <p className="mt-2 text-muted-foreground">
          View your complete medical diagnosis history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ongoing
                </p>
                <p className="text-2xl font-bold text-warning">
                  {ongoingCount}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolved
                </p>
                <p className="text-2xl font-bold text-success">
                  {resolvedCount}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Follow-up
                </p>
                <p className="text-2xl font-bold text-info">{followUpCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-info/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diagnosis List */}
      {sortedDiagnoses.length > 0 ? (
        <div className="space-y-4">
          {sortedDiagnoses.map((diagnosis) => {
            const doctor = mockDoctors.find((d) => d.id === diagnosis.doctorId);
            return (
              <Card key={diagnosis.id} className="medical-card-hover">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-3 lg:w-1/4">
                      <Avatar className="h-12 w-12 border-2 border-primary/10">
                        <AvatarImage
                          src={doctor?.avatar}
                          alt={diagnosis.doctorName}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {diagnosis.doctorName
                            .split(" ")
                            .slice(1)
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/Doctors/${diagnosis.doctorId}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {diagnosis.doctorName}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {doctor?.specialty}
                        </p>
                      </div>
                    </div>

                    {/* Diagnosis Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Stethoscope className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-foreground">
                              {diagnosis.condition}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(diagnosis.date, "MMMM d, yyyy")}
                          </div>
                        </div>
                        <Badge className={statusColors[diagnosis.status]}>
                          {statusLabels[diagnosis.status]}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {diagnosis.description}
                      </p>

                      <div className="rounded-lg bg-secondary/50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">
                            Treatment
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {diagnosis.treatment}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                    <Link href={`/Doctors/${diagnosis.doctorId}`}>
                      <Button variant="ghost" size="sm" className="group">
                        View Doctor
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    {diagnosis.status === "follow-up" && (
                      <Link href="/Doctors">
                        <Button size="sm" className="gradient-primary border-0">
                          Schedule Follow-up
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold text-foreground">
              No diagnosis history
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your diagnosis history will appear here after your consultations.
            </p>
            <Link href="/Doctors" className="mt-4">
              <Button className="gradient-primary border-0">
                Find a Doctor
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </>
  );
}
