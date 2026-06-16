import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MedicalHistory } from './entities/medical-history.entity';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { SearchMedicalHistoryDto } from './dto/search-medical-history.dto';
import { ChatMedicalHistoryDto } from './dto/chat-medical-history.dto';
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
}
