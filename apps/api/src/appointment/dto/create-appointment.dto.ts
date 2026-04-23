import { IsInt, IsEnum, IsNotEmpty, IsDateString, IsString } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  doctorID: String;

  @IsNotEmpty()
  @IsString()
  patientID: String;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  time: string;

  @IsNotEmpty()
  type: string;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}