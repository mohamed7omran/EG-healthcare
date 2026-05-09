"use client";

import { useState } from "react";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { BookingModal } from "@/components/doctors/BookingModal";
import { Doctor } from "@/types";
import { useDoctors } from "@/hooks/useDoctors";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Loader2, AlertCircle } from "lucide-react";

export default function Doctors() {
  const { data: doctors = [], isLoading, isError, error } = useDoctors();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const specialties = [
    "All Specialties",
    ...Array.from(new Set(doctors.map((d) => d.specialty))),
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading doctors...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center text-destructive">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>Error loading doctors.</p>
        <p className="text-sm text-muted-foreground">
          {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Find a Doctor
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse our network of qualified healthcare professionals
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or specialty..."
            className="pl-10"
          />
        </div>
        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredDoctors.length} doctor
          {filteredDoctors.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Doctor List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.doctorID}
            doctor={doctor}
            onBookAppointment={handleBookAppointment}
          />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-foreground">
            No doctors found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </>
  );
}
