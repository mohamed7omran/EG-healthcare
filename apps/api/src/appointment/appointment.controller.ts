/**
 * @file AppointmentController
 * @description Manages API endpoints for medical appointments and doctor dashboards.
 * * @logic_structure:
 * 1. Specialized Endpoints (Doctor Dashboard):
 * - GET /appointments/doctor/:id/current -> Optimized for today's tasks (Pending status, sorted).
 * - GET /appointments/doctor/:id/patients -> Returns a unique (DISTINCT) list of patients for the doctor's ledger.
 * * 2. General Purpose Endpoints (Legacy/Admin):
 * - GET /appointments -> Uses query params (doctorID/patientID) but lacks optimization.
 * - Note: These are kept for backward compatibility but are NOT recommended for specialized dashboard views
 * due to data redundancy and lack of filtering.
 * * @performance_note:
 * - Direct filtering by ID in specific paths is preferred over generic Query Parameters
 * to ensure better scalability and cleaner Role-Based Access Control (RBAC).
 * * @tech_stack: NestJS, TypeORM, PostgreSQL.
 */
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
  find(
    @Query('doctorID') doctorID?: string,
    @Query('patientID') patientID?: string,
  ) {
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
