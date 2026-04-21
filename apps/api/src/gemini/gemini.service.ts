import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly modelName = 'gemini-2.5-flash';
  private readonly maxRetries = 2;

  constructor(private readonly configService: ConfigService) {}

  async generateResponse(message: string): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is not configured in environment variables.',
      );
    }
    const genAI = new GoogleGenAI({ apiKey });
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await genAI.models.generateContent({
          model: this.modelName,
          contents: message,
        });
        const responseText = result.text;

        if (!responseText?.trim()) {
          throw new InternalServerErrorException(
            'Gemini returned an empty response.',
          );
        }

        return responseText;
      } catch (error: unknown) {
        if (this.shouldRetry(error) && attempt < this.maxRetries) {
          await this.sleep((attempt + 1) * 700);
          continue;
        }
        this.handleGeminiError(error);
      }
    }

    throw new HttpException(
      'AI service is temporarily unavailable. Please try again shortly.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  private handleGeminiError(error: unknown): never {
    const statusCode = this.extractStatusCode(error);
    const message = this.extractErrorMessage(error);

    if (statusCode === 429 || /rate limit|quota|too many/i.test(message)) {
      throw new HttpException(
        'Rate limit exceeded. Please try again in a moment.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (
      statusCode === 503 ||
      /unavailable|high demand|temporar/i.test(message)
    ) {
      throw new HttpException(
        'AI service is temporarily unavailable due to high demand. Please try again shortly.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (typeof statusCode === 'number' && statusCode >= 400) {
      throw new HttpException(message, statusCode);
    }

    throw new HttpException(
      'Failed to generate AI response.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private shouldRetry(error: unknown): boolean {
    const statusCode = this.extractStatusCode(error);
    const message = this.extractErrorMessage(error);

    return (
      statusCode === 503 || /unavailable|high demand|temporar/i.test(message)
    );
  }

  private extractStatusCode(error: unknown): number | undefined {
    const normalized = error as {
      status?: number;
      code?: number;
      message?: string;
    };
    const directStatus = normalized?.status ?? normalized?.code;

    if (typeof directStatus === 'number') {
      return directStatus;
    }

    const parsed = this.parseNestedError(normalized?.message);
    if (typeof parsed?.error?.code === 'number') {
      return parsed.error.code;
    }
    return undefined;
  }

  private extractErrorMessage(error: unknown): string {
    const normalized = error as { message?: string };
    const rawMessage =
      normalized?.message || 'Unexpected Gemini API error occurred.';
    const parsed = this.parseNestedError(rawMessage);

    return parsed?.error?.message || rawMessage;
  }

  private parseNestedError(
    message?: string,
  ): { error?: { code?: number; message?: string; status?: string } } | null {
    if (!message) {
      return null;
    }

    const jsonStart = message.indexOf('{');
    if (jsonStart === -1) {
      return null;
    }

    try {
      return JSON.parse(message.slice(jsonStart)) as {
        error?: { code?: number; message?: string; status?: string };
      };
    } catch {
      return null;
    }
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
