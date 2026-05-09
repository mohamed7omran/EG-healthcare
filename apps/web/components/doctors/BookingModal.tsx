import { useState } from "react";
import { format, addDays, startOfToday } from "date-fns";
import { Doctor } from "@/types";
import { useApp } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppointmentsData } from "@/hooks/useAppointments";

interface BookingModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

export function BookingModal({ doctor, isOpen, onClose }: BookingModalProps) {
  const { createAppointment, isCreating } = useAppointmentsData();
  const { currentUserId } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"date" | "time" | "confirm" | "success">(
    "date",
  );

  const handleConfirmBooking = () => {
    if (!doctor || !selectedDate || !selectedTime || !currentUserId) return;

    const payload = {
      patientID: currentUserId,
      doctorID: doctor.doctorID,
      date: selectedDate.toISOString(),
      time: selectedTime,
      type: "Consultation",
      status: "Pending",
    };

    createAppointment(payload, {
      onSuccess: () => {
        setStep("success");
      },
    });
  };
  const handleClose = () => {
    setStep("date");
    setSelectedDate(undefined);
    setSelectedTime(null);
    onClose();
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display">
            {step === "success" ? "Booking Confirmed!" : "Book Appointment"}
          </DialogTitle>
          <DialogDescription>
            {step === "success"
              ? "Your appointment has been scheduled successfully."
              : `Schedule an appointment with ${doctor.name}`}
          </DialogDescription>
        </DialogHeader>

        {/* Doctor Info */}
        {step !== "success" && (
          <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
            <Avatar className="h-14 w-14 border-2 border-primary/10">
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground">{doctor.name}</h4>
              <p className="text-sm text-muted-foreground">
                {doctor.specialty}
              </p>
            </div>
          </div>
        )}

        {/* Step: Date Selection */}
        {step === "date" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Select a date</p>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) =>
                  date < startOfToday() || date > addDays(startOfToday(), 30)
                }
                className="rounded-lg border"
              />
            </div>
            <Button
              onClick={() => setStep("time")}
              disabled={!selectedDate}
              className="w-full gradient-primary border-0"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step: Time Selection */}
        {step === "time" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Select a time
              </p>
              <Badge variant="secondary">
                {selectedDate && format(selectedDate, "MMM dd, yyyy")}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                    selectedTime === time
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent",
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {time}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("date")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep("confirm")}
                disabled={!selectedTime}
                className="flex-1 gradient-primary border-0"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step: Confirmation */}
        {step === "confirm" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary/50 p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-medium">
                  {selectedDate && format(selectedDate, "EEEE, MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="text-sm font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-sm font-medium">Consultation</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("time")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirmBooking}
                disabled={isCreating}
                className="flex-1 gradient-primary border-0"
              >
                {isCreating ? "Booking..." : "Confirm Booking"}{" "}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="space-y-6 py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Appointment Booked!
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedDate && format(selectedDate, "EEEE, MMM dd, yyyy")} at{" "}
                {selectedTime}
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full gradient-primary border-0"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
