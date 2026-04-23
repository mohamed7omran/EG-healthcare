import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Doctor } from '../doctor/entities/doctor.entity';
import { Patient } from '../patient/entities/patient.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const doctor = await this.doctorRepository.findOne({
      where: { doctorID: dto.doctorID },
    });
    const patient = await this.patientRepository.findOne({
      where: { patientID: dto.patientID },
    });

    if (!doctor) throw new NotFoundException('Doctor not found');
    if (!patient) throw new NotFoundException('Patient not found');

    const appointment = this.appointmentRepository.create({
      doctor,
      patient,
      type:dto.type,
      date: dto.date,
      time: dto.time,
      status: dto.status,
    });

    return this.appointmentRepository.save(appointment);
  }

  findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  async findByDoctorId(id:string): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.find({
      where: {
      doctor: {
        doctorID: id,
      },
    },
    relations: ['doctor', 'patient'],
      
    });
    if (appointments.length === 0) {
    throw new NotFoundException('No appointments found for this doctor');
  }
  return appointments;
  }

  async findByPatientId(id:string): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.find({
      where: {
      patient: {
        patientID: id,
      },
    },
      
    });
    if (appointments.length === 0) {
    throw new NotFoundException('No appointments found for this patient');
  }
  return appointments;
  }

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
    if (dto.status) appointment.status = dto.status;

    return this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.appointmentRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Appointment not found');
  }
}