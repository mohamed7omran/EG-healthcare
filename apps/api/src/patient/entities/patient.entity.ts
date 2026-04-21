import { Appointment } from '../../appointment/entities/appointment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}
@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  patientID: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ type: 'enum', enum: ['Male', 'Female', 'Other'] })
  gender: 'Male' | 'Female' | 'Other';

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ type: 'json', nullable: true })
  medicalSummary: {
    bloodType?: string;
    allergies?: string;
    lastVisit?: string;
    nextAppointment?: string;
  };

  @Column({ type: 'json', nullable: true })
  patientStats: {
    totalVisits?: number;
    completed?: number;
    upcoming?: number;
  };

  @Column({ type: 'text', nullable: true })
  currentCondition: string;

  @Column({ type: 'text', nullable: true })
  medications: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments!: Appointment[];
}
