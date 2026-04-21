import { IsString, IsInt, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { Gender } from '../entities/patient.entity';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

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
