import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { ChatDto } from './dto/chat.dto';

@Controller('ai')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('chat')
  async chat(@Body() body: ChatDto) {
    const reply = await this.geminiService.generateResponse(body.message);

    return { reply };
  }
}
