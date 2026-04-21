"use client";

import { PatientCard } from "@/components/patients/PatientCard";
import { mockPatients } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users } from "lucide-react";
import { useState } from "react";

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = mockPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          My Patients
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your assigned patients
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockPatients.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Patient List */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-foreground">
            No patients found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </>
  );
}
