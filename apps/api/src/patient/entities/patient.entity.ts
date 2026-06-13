import { Appointment } from '../../appointment/entities/appointment.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}
@Entity()
export class Patient {
  @PrimaryColumn()
  patientID: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  avatar: string;

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
