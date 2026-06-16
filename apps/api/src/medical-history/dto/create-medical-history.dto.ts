import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsObject,
} from 'class-validator';

export type MedicalHistoryType =
  | 'diagnosis'
  | 'prescription'
  | 'lab_report'
  | 'procedure'
  | 'note'
  | 'other';

export class CreateMedicalHistoryDto {
  @IsString()
  @IsNotEmpty()
  patientID: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(
    {
      diagnosis: 'diagnosis',
      prescription: 'prescription',
      lab_report: 'lab_report',
      procedure: 'procedure',
      note: 'note',
      other: 'other',
    },
    {
      message:
        'type must be one of: diagnosis, prescription, lab_report, procedure, note, other',
    },
  )
  @IsNotEmpty()
  type: MedicalHistoryType;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsDateString()
  @IsOptional()
  visitDate?: string;

  @IsString()
  @IsOptional()
  doctorName?: string;

  @IsString()
  @IsOptional()
  doctorID?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
