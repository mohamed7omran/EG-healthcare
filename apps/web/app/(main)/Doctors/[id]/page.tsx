"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { mockDoctors } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingModal } from "@/components/doctors/BookingModal";
import {
  ArrowLeft,
  Star,
  Clock,
  Award,
  Calendar,
  MessageSquare,
  User,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useDoctor } from "@/hooks/useDoctors";

export default function DoctorProfile() {
  const params = useParams();
  const id = params?.id as string;
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { data: doctor, isLoading, isError } = useDoctor(id);
  const availableDays = doctor?.availability?.map((a) => a.day) || [];
  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading doctor profile...</p>
      </div>
    );
  }
  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
          <User className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-foreground">
            Doctor not found
          </h3>
          <Link href="/Doctors">
            <Button className="mt-4" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Doctors
            </Button>
          </Link>
        </div>
    );
  }

  const reviews = doctor.reviews || [];
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : doctor?.rating?.toFixed(1);

  return (
    <>
      {/* Back Button */}
      <Link href="/Doctors" className="inline-block mb-6">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Doctors
        </Button>
      </Link>

      {/* Doctor Header */}
      <div className="mb-8 medical-card">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar className="h-28 w-28 border-4 border-primary/10">
            <AvatarImage src={doctor.avatar} alt={doctor.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
              {doctor.name
                .split(" ")
                .slice(1)
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {doctor.name}
            </h1>
            <p className="text-lg text-primary font-medium mt-1">
              {doctor.specialty}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                {doctor.experience} experience
              </Badge>
              <Badge className="bg-warning/10 text-warning border-warning/20 flex items-center gap-1">
                <Star className="h-3 w-3 fill-warning" />
                {averageRating} ({reviews.length} reviews)
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="gradient-primary border-0"
              onClick={() => setIsBookingOpen(true)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* About Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <User className="h-5 w-5 text-primary" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {doctor.bio}
            </p>
            <Separator className="my-6" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Specialty
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {doctor.specialty}
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Experience
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {doctor.experience}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2 font-display">
      <Clock className="h-5 w-5 text-primary" /> Availability
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
      const daySchedule = doctor.availability?.find((a) => a.day === day);
      const isAvailable = !!daySchedule;

      return (
        <div
          key={day}
          className={`flex flex-col gap-2 rounded-lg p-3 transition-colors ${
            isAvailable ? "bg-success/10 border border-success/20" : "bg-secondary/50 border border-transparent"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{day}</span>
            <Badge 
              variant={isAvailable ? "default" : "secondary"} 
              className={isAvailable ? "bg-success hover:bg-success" : ""}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
          
          {/* إظهار الساعات في حال كان الطبيب متاحاً في هذا اليوم */}
          {isAvailable && (
            <div className="flex items-center text-sm text-success font-semibold">
              <Clock className="mr-1 h-3.5 w-3.5" />
              <span>{daySchedule.from} - {daySchedule.to}</span>
            </div>
          )}
        </div>
      );
    })}
  </CardContent>
</Card>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Patient Reviews ({reviews.length})
        </h2>
        {reviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {review.patientName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                      {review.date &&
                        format(new Date(review.date), "MMM d, yyyy")
                      }
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-warning text-warning"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">
                No reviews yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to leave a review for this doctor.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        doctor={doctor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}
