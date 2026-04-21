import { IsString, IsInt, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { Gender } from '../entities/patient.entity';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  medicalSummary?: {
    bloodType?: string;
    allergies?: string;
    lastVisit?: string;
    nextAppointment?: string;
  };

  @IsOptional()
  patientStats?: {
    totalVisits?: number;
    completed?: number;
    upcoming?: number;
  };

  @IsOptional()
  @IsString()
  currentCondition?: string;

  @IsOptional()
  @IsString()
  medications?: string;
}
