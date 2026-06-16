import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class SearchMedicalHistoryDto {
  @IsString()
  @IsNotEmpty()
  patientID: string;

  @IsString()
  @IsNotEmpty()
  query: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  limit?: number = 5;
}
