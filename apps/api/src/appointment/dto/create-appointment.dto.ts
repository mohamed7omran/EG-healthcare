import {
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsString,
  IsOptional,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  doctorID: string;

  @IsNotEmpty()
  @IsString()
  patientID: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  time: string;

  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  report?: string;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
