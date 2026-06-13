"use client";

import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { useApp } from "@/context/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Appointments() {
  const { role, appointments, isAppointmentsLoading } = useApp();

  const scheduledAppointments = appointments.filter(
    (a) => a.status === "Pending" || a.status === "Scheduled",
  );

  const completedAppointments = appointments.filter(
    (a) => a.status === "Completed",
  );

  const cancelledAppointments = appointments.filter(
    (a) => a.status === "Cancelled",
  );

  const showPatient = role === "doctor";

  if (isAppointmentsLoading) return <p>Loading...</p>;

  const EmptyState = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: any;
    title: string;
    description: string;
  }) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Icon className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          {role === "patient" ? "My Appointments" : "Appointments"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage and track all your{" "}
          {role === "patient"
            ? "medical appointments"
            : "scheduled appointments"}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
              <Clock className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {scheduledAppointments.length}
              </p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {completedAppointments.length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {cancelledAppointments.length}
              </p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="scheduled" className="gap-2">
            <Clock className="h-4 w-4" />
            Scheduled ({scheduledAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Completed ({completedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-2">
            <XCircle className="h-4 w-4" />
            Cancelled ({cancelledAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          {scheduledAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {scheduledAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.appointmentID}
                  appointment={apt}
                  showPatient={showPatient}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No scheduled appointments"
              description="You don't have any upcoming appointments."
            />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.appointmentID}
                  appointment={apt}
                  showPatient={showPatient}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="No completed appointments"
              description="Your completed appointments will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cancelledAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.appointmentID}
                  appointment={apt}
                  showPatient={showPatient}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={XCircle}
              title="No cancelled appointments"
              description="Your cancelled appointments will appear here."
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
