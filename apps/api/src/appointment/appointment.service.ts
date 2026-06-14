/**
 * @file AppointmentService
 * @description Handles appointment management and doctor-specific data retrieval.
 * * @task_summary:
 * 1. Current Appointments:
 * - Fetch all 'Pending' appointments for a specific doctor.
 * - Requirements: Join with Patient entity and sort by Date/Time (ASC).
 * * 2. Unique Patient History:
 * - Retrieve a unique list of all patients who have ever visited a specific doctor.
 * - Requirements: Use QueryBuilder with DISTINCT to prevent duplicate patient records.
 * * @note_on_legacy_methods:
 * - The methods [findByDoctorId, findByPatientId, findOne] are general-purpose
 * and NOT optimal for the specific dashboard tasks.
 * - They return redundant data (duplicates) and lack the necessary status
 * filtering (e.g., Pending vs All) required for a professional clinical workflow.
 * * @tech_stack: NestJS, TypeORM, PostgreSQL.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Doctor } from '../doctor/entities/doctor.entity';
import { Patient } from '../patient/entities/patient.entity';
import { NotificationService } from '../notification/notification.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const doctor = await this.doctorRepository.findOne({
      where: { doctorID: dto.doctorID },
    });
    const patient = await this.patientRepository.findOne({
      where: { patientID: dto.patientID },
    });

    if (!doctor) throw new NotFoundException('Doctor not found');
    const user = await this.userRepository.findOne({
      where: { userID: doctor.doctorID },
    });
    if (!patient) throw new NotFoundException('Patient not found');
    if (!user) throw new NotFoundException('user not found');

    const appointment = this.appointmentRepository.create({
      doctor,
      patient,
      type: dto.type,
      date: dto.date,
      time: dto.time,
      report: dto.report ?? null,
      status: dto.status,
    });

    const formattedDateStr = this.formattedDate(appointment.date);
    await this.notificationService.sendNotification(
      user.fcmToken,
      'New Appointment',
      `There is a new pending appointment for ${patient.name}\nOn ${formattedDateStr}`,
    );

    return this.appointmentRepository.save(appointment);
  }

  findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  async findByDoctorId(id: string): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.find({
      where: {
        doctor: {
          doctorID: id,
        },
      },
      relations: ['doctor', 'patient'],
    });
    return appointments;
  }

  async findByPatientId(id: string): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.find({
      where: {
        patient: {
          patientID: id,
        },
      },
    });
    return appointments;
  }

  async findPatientsByDoctorId(id: string): Promise<Patient[]> {
    return this.patientRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.appointments', 'appointment')
      .where('appointment.doctorDoctorID = :id', { id })
      .getMany();
  }

  // async findPatientsByDoctorId(id: string): Promise<Patient[]> {
  //   return this.patientRepository
  //     .createQueryBuilder('patient')
  //     .innerJoin('patient.appointments', 'appointment')
  //     .where('appointment.doctorDoctorID = :id', { id })
  //     .distinct(true)
  //     .getMany();
  // }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointmentID: id },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (dto.doctorID) {
      const doctor = await this.doctorRepository.findOne({
        where: { doctorID: dto.doctorID },
      });
      if (!doctor) throw new NotFoundException('Doctor not found');
      appointment.doctor = doctor;
    }

    if (dto.patientID) {
      const patient = await this.patientRepository.findOne({
        where: { patientID: dto.patientID },
      });
      if (!patient) throw new NotFoundException('Patient not found');
      appointment.patient = patient;
    }

    if (dto.date) appointment.date = dto.date;
    if (dto.time) appointment.time = dto.time;
    if (dto.type) appointment.type = dto.type;
    if (dto.report !== undefined) appointment.report = dto.report;

    if (dto.status) {
      appointment.status = dto.status;
      const user = await this.userRepository.findOne({
        where: { userID: dto.patientID },
      });
      if (!user) throw new NotFoundException('user not found');

      const formattedDateStr = this.formattedDate(appointment.date);
      if (dto.status == 'Scheduled') {
        await this.notificationService.sendNotification(
          user.fcmToken,
          'Appointment',
          `Your appointment has been scheduled by Dr. ${appointment.doctor.name}\n On ${formattedDateStr}`,
        );
      }
      if (dto.status == 'Completed') {
        await this.notificationService.sendNotification(
          user.fcmToken,
          'Appointment',
          `Dr. ${appointment.doctor.name} has completed your appointment \n at ${this.formattedDate(new Date().toISOString())}`,
        );
      }
    }
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.appointmentRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Appointment not found');
  }

  formattedDate(date: string): string {
    const formattedDate = new Date(date).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formattedDate;
  }
}
