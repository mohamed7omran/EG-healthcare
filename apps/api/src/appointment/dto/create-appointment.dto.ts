import { IsInt, IsEnum, IsNotEmpty, IsDateString } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsInt()
  doctorID: number;

  @IsInt()
  patientID: number;

  @IsDateString()
  date: string;

  @IsNotEmpty()
  time: string;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
