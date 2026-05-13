import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  // 1. Endpoint لتخزين بيانات مريض (عشان يتدرب عليها)
  @Post('feed')
  async feedData(@Body() data: { info: string; patientId: string }) {
    return await this.ragService.addData(data.info, {
      patientId: data.patientId,
    });
  }

  // 2. Endpoint لسؤال الـ AI وتحليل البيانات
  @Get('ask')
  async askAi(@Query('question') question: string) {
    return await this.ragService.ask(question);
  }
}
