import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  doctorID: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  specialty: string;

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
