import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}
@Entity()
export class Doctor {
  @PrimaryColumn()
  doctorID!: String;

  @Column()
  name!: string;

  @Column({ nullable: true })
  avatar: string;

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

  @Column()
  role: string;

  @Column()
  specialty!: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'json', nullable: true })
  availability: {
    day?: string;
    from?: string;
    to?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  reviews: {
    id: string;
    patientId: string;
    patientName: string;
    rating: number;
    comment?: string;
    date: Date;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments!: Appointment[];
}