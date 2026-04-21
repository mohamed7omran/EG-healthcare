import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiAnalysisService } from './ai-analysis.service';

@Controller('ai-analysis')
export class AiAnalysisController {
  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  @Post('xray')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeXray(@UploadedFile() file?: { buffer?: Buffer }) {
    if (!file?.buffer) {
      throw new BadRequestException('X-ray file is required.');
    }

    return this.aiAnalysisService.analyzeXray(file.buffer);
  }
}
