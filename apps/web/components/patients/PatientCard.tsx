import { Patient } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const patientId = patient.patientID ?? patient.id ?? "";
  const medicalSummaryText =
    typeof patient.medicalSummary === "string"
      ? patient.medicalSummary
      : patient.medicalHistory || "No medical summary available.";

  return (
    <div className="medical-card-hover group">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border-2 border-primary/10">
          <AvatarImage src={patient.avatar} alt={patient.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {patient.name}
            </h3>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {patient.age} years old
            </Badge>
            <Badge variant="secondary" className="text-xs capitalize">
              {patient.gender}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-secondary/50 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <FileText className="h-4 w-4 text-primary" />
          Medical Summary
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {medicalSummaryText}
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <Link href={`/Patients/${patientId}`}>
          <Button variant="ghost" size="sm" className="group/btn">
            View Full Profile
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
