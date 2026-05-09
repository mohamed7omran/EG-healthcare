import { format, parseISO } from "date-fns";
import { Appointment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Stethoscope, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AppointmentCardProps {
  appointment: Appointment;
  showPatient?: boolean;
}

export function AppointmentCard({
  appointment,
  showPatient = false,
}: AppointmentCardProps) {
  const { updateAppointment, role } = useApp();

  const statusColors = {
    Pending: "bg-info/10 text-info border-info/20",
    Completed: "bg-success/10 text-success border-success/20",
    Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const handleCancel = () => {
    updateAppointment(appointment.appointmentID, { status: "Cancelled" });
  };

  const handleComplete = () => {
    updateAppointment(appointment.appointmentID, { status: "Completed" });
  };

  return (
    <div className="medical-card group animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              role === "patient" ? "bg-primary/10" : "bg-accent",
            )}
          >
            {showPatient ? (
              <User className="h-6 w-6 text-primary" />
            ) : (
              <Stethoscope className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              {showPatient
                ? appointment.patient.name
                : `Dr. ${appointment.doctor.name}`}
            </h4>
            <p className="text-sm text-muted-foreground">{appointment.type}</p>
          </div>
        </div>
        <Badge
          className={cn(
            "border",
            statusColors[appointment.status as keyof typeof statusColors],
          )}
        >
          {(appointment.status as string).charAt(0).toUpperCase() +
            (appointment.status as string).slice(1)}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(parseISO(appointment.date), "MMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{appointment.time}</span>
        </div>
      </div>

      {appointment.status === "Pending" && (
        <div className="mt-4 flex gap-2 pt-4 border-t border-border">
          {role === "doctor" && (
            <>
              <Link href={`/appointments/${appointment.appointmentID}/report`}>
                <Button size="sm" className="gradient-primary border-0">
                  Write Report
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={handleComplete}
                className="gradient-primary border-0"
              >
                Mark Complete
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        </div>
      )}

      {appointment.report && (
        <div className="mt-4 pt-4 border-t border-border">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Medical Report</DialogTitle>
                <DialogDescription>
                  {showPatient
                    ? `Patient: ${appointment.patient.name}`
                    : `Doctor: ${appointment.doctor.name}`}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm whitespace-pre-wrap text-foreground">
                {appointment.report}
              </p>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
