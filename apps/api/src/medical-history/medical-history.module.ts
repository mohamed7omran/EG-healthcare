import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistory } from './entities/medical-history.entity';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { Patient } from '../patient/entities/patient.entity';
import { RagModule } from '../rag/rag.module';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalHistory, Patient]), RagModule],
  providers: [MedicalHistoryService],
  controllers: [MedicalHistoryController],
  exports: [MedicalHistoryService],
})
export class MedicalHistoryModule {}
