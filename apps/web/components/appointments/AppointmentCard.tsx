import { format, parseISO } from 'date-fns';
import { Appointment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Stethoscope, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface AppointmentCardProps {
  appointment: Appointment;
  showPatient?: boolean;
}

export function AppointmentCard({ appointment, showPatient = false }: AppointmentCardProps) {
  const { updateAppointment, role } = useApp();

  const statusColors = {
    scheduled: 'bg-info/10 text-info border-info/20',
    completed: 'bg-success/10 text-success border-success/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const handleCancel = () => {
    updateAppointment(appointment.id, { status: 'cancelled' });
  };

  const handleComplete = () => {
    updateAppointment(appointment.id, { status: 'completed' });
  };

  return (
    <div className="medical-card group animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            role === 'patient' ? 'bg-primary/10' : 'bg-accent'
          )}>
            {showPatient ? (
              <User className="h-6 w-6 text-primary" />
            ) : (
              <Stethoscope className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              {showPatient ? appointment.patientName : appointment.doctorName}
            </h4>
            <p className="text-sm text-muted-foreground">{appointment.type}</p>
          </div>
        </div>
        <Badge className={cn('border', statusColors[appointment.status])}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(parseISO(appointment.date), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{appointment.time}</span>
        </div>
      </div>

      {appointment.status === 'scheduled' && (
        <div className="mt-4 flex gap-2 pt-4 border-t border-border">
          {role === 'doctor' && (
            <Button 
              size="sm" 
              onClick={handleComplete}
              className="gradient-primary border-0"
            >
              Mark Complete
            </Button>
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
    </div>
  );
}
