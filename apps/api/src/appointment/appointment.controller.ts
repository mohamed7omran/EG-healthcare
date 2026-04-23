import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @Get()
  find(@Query('doctorID') doctorID?: string,@Query('patientID') patientID?: string,) {
    if (doctorID) {
      return this.appointmentService.findByDoctorId(doctorID);
    }

    if (patientID) {
      return this.appointmentService.findByPatientId(patientID);
    }

    return this.appointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.appointmentService.remove(+id);
  }
}