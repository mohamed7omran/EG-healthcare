import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';

@Entity('medical_history')
@Index(['patientID', 'createdAt'])
export class MedicalHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientID: string;

  @ManyToOne(() => Patient, { eager: false, onDelete: 'CASCADE' })
  patient: Patient;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-json', nullable: true })
  embedding: number[];

  @Column({ type: 'varchar', length: 50 })
  type:
    | 'diagnosis'
    | 'prescription'
    | 'lab_report'
    | 'procedure'
    | 'note'
    | 'other';

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'date', nullable: true })
  visitDate: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  doctorName: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  doctorID: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
