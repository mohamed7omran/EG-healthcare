import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ReportTemplate {
  PRESCRIPTION = 'prescription',
  CLINICAL_NOTE = 'clinical_note',
  FOLLOW_UP = 'follow_up',
}

export class GenerateTemplateDto {
  @IsString()
  @IsNotEmpty()
  patientID: string;

  @IsEnum(ReportTemplate)
  template: ReportTemplate;

  @IsString()
  @IsOptional()
  clinicalNotes?: string;
}
