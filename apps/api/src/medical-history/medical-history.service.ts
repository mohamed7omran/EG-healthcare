import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MedicalHistory } from './entities/medical-history.entity';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { SearchMedicalHistoryDto } from './dto/search-medical-history.dto';
import { ChatMedicalHistoryDto } from './dto/chat-medical-history.dto';
import {
  GenerateTemplateDto,
  ReportTemplate,
} from './dto/generate-template.dto';
import { RagService } from '../rag/rag.service';
import { Patient } from '../patient/entities/patient.entity';

@Injectable()
export class MedicalHistoryService {
  private readonly logger = new Logger(MedicalHistoryService.name);

  constructor(
    @InjectRepository(MedicalHistory)
    private medicalHistoryRepository: Repository<MedicalHistory>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private ragService: RagService,
  ) {}

  async addMedicalRecord(
    createDto: CreateMedicalHistoryDto,
  ): Promise<MedicalHistory> {
    const patient = await this.patientRepository.findOne({
      where: { patientID: createDto.patientID },
    });
    if (!patient)
      throw new NotFoundException(
        `المريض برقم ${createDto.patientID} غير موجود`,
      );

    const medicalRecord = this.medicalHistoryRepository.create({
      patientID: createDto.patientID,
      content: createDto.content,
      type: createDto.type,
      title: createDto.title,
      summary: createDto.summary,
      visitDate: createDto.visitDate,
      doctorName: createDto.doctorName,
      doctorID: createDto.doctorID,
      metadata: createDto.metadata || {},
    });

    const savedRecord = await this.medicalHistoryRepository.save(medicalRecord);

    try {
      const embeddingMetadata = {
        patientID: createDto.patientID,
        type: createDto.type,
        visitDate: createDto.visitDate,
        doctorName: createDto.doctorName,
        recordId: savedRecord.id,
        title: createDto.title || 'بدون عنوان',
      };

      await this.ragService.addData(
        `[${createDto.type}] ${createDto.title || ''}: ${createDto.content}`,
        embeddingMetadata,
      );
      this.logger.log(
        `تم إضافة سجل طبي جديد للمريض ${createDto.patientID} إلى Vector Store`,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.warn(`فشل إضافة السجل إلى Vector Store: ${errorMessage}`);
    }

    return savedRecord;
  }

  async searchMedicalHistory(
    searchDto: SearchMedicalHistoryDto,
  ): Promise<MedicalHistory[]> {
    const { patientID, query, limit = 5 } = searchDto;

    const patient = await this.patientRepository.findOne({
      where: { patientID },
    });
    if (!patient)
      throw new NotFoundException(`المريض برقم ${patientID} غير موجود`);

    const patientRecords = await this.medicalHistoryRepository.find({
      where: { patientID, isActive: true },
      order: { createdAt: 'DESC' },
    });

    if (patientRecords.length === 0) return [];

    try {
      const docs = await this.ragService.similaritySearch(query, limit, {
        patientID,
      });

      if (docs && docs.length > 0) {
        const ids = docs
          .map((d: any) => d.metadata?.recordId)
          .filter((id: any) => !!id);

        if (ids.length > 0) {
          const records = await this.medicalHistoryRepository.find({
            where: { id: In(ids), isActive: true },
          });

          const orderedRecords = ids
            .map((id) => records.find((r) => r.id === id))
            .filter((r): r is MedicalHistory => !!r);

          if (orderedRecords.length > 0) return orderedRecords.slice(0, limit);
        }
      }

      return this.runFallbackSearch(patientRecords, query, limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `فشل البحث في Vector Store، استخدام البحث التقليدي: ${errorMessage}`,
      );
      return this.runFallbackSearch(patientRecords, query, limit);
    }
  }

  private runFallbackSearch(
    records: MedicalHistory[],
    query: string,
    limit: number,
  ): MedicalHistory[] {
    return records
      .filter(
        (r) =>
          r.content.includes(query) ||
          r.title?.includes(query) ||
          r.summary?.includes(query),
      )
      .slice(0, limit);
  }

  async chatWithPatientHistory(dto: ChatMedicalHistoryDto) {
    const { patientID, question, limit = 5 } = dto;

    const patient = await this.patientRepository.findOne({
      where: { patientID },
    });
    if (!patient)
      throw new NotFoundException(`المريض برقم ${patientID} غير موجود`);

    const docs = await this.ragService.similaritySearch(question, limit, {
      patientID,
    });

    const context = (docs || []).map((d: any) => d.pageContent).join('\n---\n');

    const answer = await this.ragService.answerWithContext(question, context);

    return {
      answer,
      contextSources: docs.map((d: any) => ({
        content: d.pageContent,
        metadata: d.metadata,
      })),
    };
  }

  async getMedicalHistoryByPatient(
    patientID: string,
  ): Promise<MedicalHistory[]> {
    const patient = await this.patientRepository.findOne({
      where: { patientID },
    });
    if (!patient)
      throw new NotFoundException(`المريض برقم ${patientID} غير موجود`);

    return this.medicalHistoryRepository.find({
      where: { patientID, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getMedicalRecordById(id: string): Promise<MedicalHistory> {
    const record = await this.medicalHistoryRepository.findOne({
      where: { id },
    });
    if (!record)
      throw new NotFoundException(`السجل الطبي برقم ${id} غير موجود`);
    return record;
  }

  async updateMedicalRecord(
    id: string,
    updateDto: Partial<CreateMedicalHistoryDto>,
  ): Promise<MedicalHistory> {
    const record = await this.getMedicalRecordById(id);
    Object.assign(record, updateDto);
    const updated = await this.medicalHistoryRepository.save(record);

    if (updateDto.content || updateDto.title) {
      try {
        await this.ragService.addData(
          `[${updated.type}] ${updated.title || ''}: ${updated.content}`,
          {
            patientID: updated.patientID,
            type: updated.type,
            visitDate: updated.visitDate,
            recordId: updated.id,
            updated: true,
          },
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.logger.warn(`فشل تحديث السجل في Vector Store: ${errorMessage}`);
      }
    }

    return updated;
  }

  async deleteMedicalRecord(id: string): Promise<void> {
    const record = await this.getMedicalRecordById(id);
    record.isActive = false;
    await this.medicalHistoryRepository.save(record);
    this.logger.log(`تم حذف السجل الطبي ${id}`);
  }

  private buildPatientContext(
    patient: Patient,
    records: MedicalHistory[],
  ): string {
    const summary =
      typeof patient.medicalSummary === 'object' && patient.medicalSummary
        ? JSON.stringify(patient.medicalSummary)
        : patient.medicalSummary || '';

    const profile = [
      `Patient: ${patient.name}`,
      `Age: ${patient.age}`,
      `Gender: ${patient.gender}`,
      summary ? `Medical summary: ${summary}` : '',
      patient.medications ? `Current medications: ${patient.medications}` : '',
      patient.currentCondition
        ? `Current condition: ${patient.currentCondition}`
        : '',
      patient.medicalHistory ? `Legacy history: ${patient.medicalHistory}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const recordsBlock =
      records.length > 0
        ? records
            .map(
              (r) =>
                `[${r.type}] ${r.title || 'Record'} (${r.visitDate || r.createdAt.toISOString().slice(0, 10)}): ${r.content}`,
            )
            .join('\n---\n')
        : 'No prior medical history records.';

    return `${profile}\n\n--- Medical Records ---\n${recordsBlock}`;
  }

  async getPatientInsights(patientID: string) {
    const patient = await this.patientRepository.findOne({
      where: { patientID },
    });
    if (!patient)
      throw new NotFoundException(`Patient ${patientID} not found`);

    const records = await this.medicalHistoryRepository.find({
      where: { patientID, isActive: true },
      order: { createdAt: 'DESC' },
    });

    const context = this.buildPatientContext(patient, records);
    const insights: Array<{
      id: string;
      type: string;
      label: string;
      content: string;
    }> = [];

    const summary =
      typeof patient.medicalSummary === 'object' && patient.medicalSummary
        ? patient.medicalSummary
        : null;

    if (summary?.allergies) {
      insights.push({
        id: 'profile-allergy',
        type: 'allergy',
        label: 'Known Allergy (Profile)',
        content: summary.allergies,
      });
    }

    if (patient.medications) {
      insights.push({
        id: 'profile-meds',
        type: 'medication',
        label: 'Current Medications (Profile)',
        content: patient.medications,
      });
    }

    if (records.length === 0 && insights.length === 0) {
      return {
        insights: [
          {
            id: 'no-records',
            type: 'info',
            label: 'No History',
            content: 'No prior medical records found for this patient.',
          },
        ],
        timeline: [],
      };
    }

    const queries = [
      {
        id: 'rag-allergy',
        type: 'allergy',
        label: 'Allergy Alert',
        question:
          'List any drug or food allergies mentioned in the records. Include the date if available. One concise sentence.',
      },
      {
        id: 'rag-medications',
        type: 'medication',
        label: 'Recent Medications',
        question:
          'List the most recently prescribed or consumed medications. Format as a short comma-separated list.',
      },
      {
        id: 'rag-conditions',
        type: 'condition',
        label: 'Active Conditions',
        question:
          'Summarize active or chronic conditions in one or two sentences.',
      },
    ];

    await Promise.all(
      queries.map(async (q) => {
        try {
          const content = await this.ragService.answerWithContext(
            q.question,
            context,
          );
          const text = String(content).trim();
          if (
            text &&
            !text.includes('لا تتوفر معلومات') &&
            !text.toLowerCase().includes('no information')
          ) {
            insights.push({
              id: q.id,
              type: q.type,
              label: q.label,
              content: text,
            });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          this.logger.warn(`Insight query failed (${q.id}): ${errorMessage}`);
        }
      }),
    );

    const timeline = records.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title || r.type,
      summary: r.summary || r.content.slice(0, 120),
      visitDate: r.visitDate || r.createdAt.toISOString().slice(0, 10),
      doctorName: r.doctorName,
    }));

    return { insights, timeline };
  }

  async generateReportTemplate(dto: GenerateTemplateDto) {
    const patient = await this.patientRepository.findOne({
      where: { patientID: dto.patientID },
    });
    if (!patient)
      throw new NotFoundException(`Patient ${dto.patientID} not found`);

    const records = await this.medicalHistoryRepository.find({
      where: { patientID: dto.patientID, isActive: true },
      order: { createdAt: 'DESC' },
    });

    const context = this.buildPatientContext(patient, records);
    const notes = dto.clinicalNotes?.trim() || 'None provided yet.';

    const prompts: Record<ReportTemplate, string> = {
      [ReportTemplate.PRESCRIPTION]: `Draft a professional medical prescription (Rx) for this patient.
Patient age: ${patient.age}, gender: ${patient.gender}.
Today's clinical notes: ${notes}
Include: medication name, dosage, frequency, duration, and brief instructions.
Check for drug interactions with prior medications in the records.
If insufficient data, state what is missing instead of guessing.
Format clearly as a prescription document the doctor can review and edit.`,

      [ReportTemplate.CLINICAL_NOTE]: `Draft a structured clinical consultation note including:
Subjective, Objective, Assessment, and Plan (SOAP format).
Today's notes: ${notes}
Base findings only on patient records and provided notes.`,

      [ReportTemplate.FOLLOW_UP]: `Draft follow-up care instructions for this patient.
Today's notes: ${notes}
Include monitoring advice, lifestyle recommendations, and when to return.
Base only on available records.`,
    };

    try {
      const content = await this.ragService.answerWithContext(
        prompts[dto.template],
        context,
      );
      return {
        template: dto.template,
        content: String(content),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Template generation failed: ${errorMessage}`);
      throw err;
    }
  }
}
