"use client";

import { useApp } from "@/context/AppContext";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { PatientCard } from "@/components/patients/PatientCard";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Stethoscope,
  Activity,
  ArrowRight,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { mockPatients } from "@/data/mockData";
import { useDoctors } from "@/hooks/useDoctors";

function PatientDashboard() {
  const { data: doctors = [], isLoading, isError } = useDoctors();

  const { appointments } = useApp();
  const upcomingAppointments = appointments
    .filter((apt) => apt.status === "scheduled")
    .slice(0, 3);

  const stats = [
    {
      label: "Upcoming Appointments",
      value: appointments.filter((a) => a.status === "scheduled").length,
      icon: Calendar,
      color: "text-info",
    },
    {
      label: "Completed Visits",
      value: appointments.filter((a) => a.status === "completed").length,
      icon: Activity,
      color: "text-success",
    },
    {
      label: "Available Doctors",
      value: doctors.length,
      icon: Stethoscope,
      color: "text-primary",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="mb-8 rounded-2xl gradient-hero p-8 text-primary-foreground">
        <h1 className="font-display text-3xl font-bold">
          Your Health, Our Priority
        </h1>
        <p className="mt-2 max-w-xl text-primary-foreground/80">
          Book appointments with top healthcare professionals and manage your
          health journey all in one place.
        </p>
        <Link href="/Doctors">
          <Button className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Search className="mr-2 h-4 w-4" />
            Find a Doctor
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-secondary`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Upcoming Appointments
          </h2>
          <Link href="/appointments">
            <Button variant="ghost" size="sm" className="group">
              View All
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        {upcomingAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">
                No upcoming appointments
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Book an appointment with one of our doctors to get started.
              </p>
              <Link href="/Doctors">
                <Button className="mt-4 gradient-primary border-0">
                  Find a Doctor
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Featured Doctors */}
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : isError || doctors.length === 0 ? (
        <div>error</div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Featured Doctors
            </h2>
            <Link href="/Doctors">
              <Button variant="ghost" size="sm" className="group">
                View All
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doctors.slice(0, 3).map((doctor) => (
              <Card
                key={doctor.doctorID}
                className="group hover:shadow-elevated transition-shadow"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-primary/10"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {doctor.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {doctor.specialty}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function DoctorDashboard() {
  const { appointments } = useApp();
  const todayAppointments = appointments
    .filter((apt) => apt.status === "scheduled")
    .slice(0, 5);

  const stats = [
    {
      label: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      color: "text-info",
    },
    {
      label: "Total Patients",
      value: mockPatients.length,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Completed Today",
      value: appointments.filter((a) => a.status === "completed").length,
      icon: TrendingUp,
      color: "text-success",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="mb-8 rounded-2xl gradient-hero p-8 text-primary-foreground">
        <h1 className="font-display text-3xl font-bold">Doctor Dashboard</h1>
        <p className="mt-2 max-w-xl text-primary-foreground/80">
          Manage your appointments, patients, and access AI-powered medical
          analysis tools.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-secondary`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Appointments */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Today's Appointments
            </h2>
            <Link href="/appointments">
              <Button variant="ghost" size="sm" className="group">
                View All
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {todayAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} showPatient />
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              My Patients
            </h2>
            <Link href="/Patients">
              <Button variant="ghost" size="sm" className="group">
                View All
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {mockPatients.slice(0, 2).map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Dashboard() {
  const { role, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return role === "patient" ? <PatientDashboard /> : <DoctorDashboard />;
}
