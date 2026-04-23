import { IsString, IsInt, IsEnum, IsOptional, IsEmail, IsPhoneNumber, IsNumber, IsNotEmpty } from 'class-validator';
import { Gender } from '../entities/patient.entity';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  patientID: string;
  
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsEnum(Gender)
  gender: Gender;

  
  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  avatar: string;

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