import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('feed')
  async feedData(@Body() data: { info: string; patientId: string }) {
    return await this.ragService.addData(data.info, {
      patientId: data.patientId,
    });
  }

  @Get('ask')
  async askAi(@Query('question') question: string) {
    return await this.ragService.ask(question);
  }
}
