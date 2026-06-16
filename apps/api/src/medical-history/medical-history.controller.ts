import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  // UseGuards,
} from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { SearchMedicalHistoryDto } from './dto/search-medical-history.dto';
import { ChatMedicalHistoryDto } from './dto/chat-medical-history.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('medical-history')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalHistoryController {
  constructor(private readonly service: MedicalHistoryService) {}

  @Post()
  // @Roles('DOCTOR')
  async add(@Body() dto: CreateMedicalHistoryDto) {
    return this.service.addMedicalRecord(dto);
  }

  @Post('search')
  // @Roles('DOCTOR')
  async search(@Body() dto: SearchMedicalHistoryDto) {
    return this.service.searchMedicalHistory(dto);
  }

  @Get('patient/:id')
  // @Roles('DOCTOR', 'PATIENT')
  async byPatient(@Param('id') id: string) {
    return this.service.getMedicalHistoryByPatient(id);
  }

  @Get(':id')
  // @Roles('DOCTOR')
  async getOne(@Param('id') id: string) {
    return this.service.getMedicalRecordById(id);
  }

  @Patch(':id')
  // @Roles('DOCTOR')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMedicalHistoryDto>,
  ) {
    return this.service.updateMedicalRecord(id, dto);
  }

  @Delete(':id')
  // @Roles('DOCTOR')
  async remove(@Param('id') id: string) {
    await this.service.deleteMedicalRecord(id);
    return { ok: true };
  }

  @Post('chat')
  // @Roles('DOCTOR')
  async chat(@Body() dto: ChatMedicalHistoryDto) {
    return this.service.chatWithPatientHistory(dto);
  }
}
