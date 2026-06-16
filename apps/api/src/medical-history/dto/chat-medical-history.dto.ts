import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class ChatMedicalHistoryDto {
  @IsString()
  @IsNotEmpty()
  patientID: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(20)
  limit?: number = 5;
}
