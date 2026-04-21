import { Doctor } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}


export function DoctorCard({ doctor, onBookAppointment }: DoctorCardProps) {
  const rating = doctor.reviews?.length
  ? doctor.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    ) / doctor.reviews.length
  : 0;


  return (
    <div className="medical-card-hover group">
      <div className="flex gap-4">
        {/* Avatar */}
        <Link href={`/Doctors/${doctor.doctorID}`}>
          <Avatar className="h-20 w-20 border-2 border-primary/10 cursor-pointer hover:border-primary/30 transition-colors">
            <AvatarImage src={doctor.avatar} alt={doctor.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/Doctors/${doctor.doctorID}`}>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                  {doctor.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm font-medium text-warning">{rating}</span>
            </div>
          </div>

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{doctor.experience} years exp.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
              {doctor.availability?.slice(0, 3).map((slot) => (
                <Badge key={`${slot.day}-${slot.from}`} variant="secondary" className="text-xs px-2 py-0">
                  {slot.day}
                </Badge>
              ))}

              {doctor.availability && doctor.availability.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  +{doctor.availability.length - 3}
                </Badge>
              )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="mt-4 flex justify-end gap-2">
        <Link href={`/Doctors/${doctor.doctorID}`}>
          <Button variant="ghost" size="sm" className="group/btn">
            View Profile
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
        <Button 
          onClick={() => onBookAppointment(doctor)}
          className="gradient-primary border-0"
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
}
