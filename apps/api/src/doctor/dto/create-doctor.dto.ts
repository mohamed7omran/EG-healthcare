import { IsString, IsOptional,IsNotEmpty, IsNumber, IsEnum, IsPhoneNumber, IsEmail } from 'class-validator';
import { Gender } from '../entities/doctor.entity';
import { Type } from 'class-transformer';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  doctorID: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsEnum(Gender)
  gender: Gender;
  
@ IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional() 
  @IsString()
  specialty: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  availability?: {
    day?: string;
    from?: string;
    to?: string;
  }[];

  @IsOptional()
  reviews?: {
    id: string;
    patientId: string;
    patientName: string;
    rating: number;
    comment?: string;
    date: Date;
  }[];
}