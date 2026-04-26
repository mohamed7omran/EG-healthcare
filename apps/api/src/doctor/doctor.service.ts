import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorRepository.create(createDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  search(query: string): Promise<Doctor[]> {
  if (!query.trim()) return Promise.resolve([]);

  return this.doctorRepository.find({
    where: [
      { name: ILike(`%${query}%`) },
      { specialty: ILike(`%${query}%`) },
    ],
    take: 20,
  });
}

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { doctorID: id },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }


  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    await this.doctorRepository.update(id, updateDoctorDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.doctorRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Doctor not found');
  }
}