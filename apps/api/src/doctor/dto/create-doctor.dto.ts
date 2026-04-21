import { IsString, IsOptional } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

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
