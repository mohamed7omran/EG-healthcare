// import {
//   HttpException,
//   HttpStatus,
//   Injectable,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class AiAnalysisService {

//   private readonly apiUrl = 'https://serverless.roboflow.com';
//   private readonly defaultApiKey = 'NRmuEF08gFhr0EvLRoqg';
//   private readonly defaultModelId = 'x-ray-3h2z9/2';
//   constructor(private readonly configService: ConfigService) {}

//   async analyzeXray(fileBuffer: Buffer) {
//     const apiKey =
//       this.configService.get<string>('ROBOFLOW_API_KEY') || this.defaultApiKey;
//     const modelId =
//       this.configService.get<string>('ROBOFLOW_MODEL_ID') ||
//       this.defaultModelId;

//     if (!apiKey || !modelId) {
//       throw new InternalServerErrorException(
//         'Roboflow configuration is missing.',
//       );
//     }

//     try {
//       const base64Image = fileBuffer.toString('base64');
//       const url = `https://serverless.roboflow.com/${modelId}?api_key=${apiKey}`;
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: base64Image,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new HttpException(
//           `Roboflow Error: ${response.status} - ${errorText}`,
//           response.status || HttpStatus.BAD_GATEWAY,
//         );
//       }

//       return await response.json();
//     } catch (error: unknown) {
//       if (error instanceof HttpException) {
//         throw error;
//       }

//       throw new InternalServerErrorException(
//         'حدث خطأ أثناء تحليل الصورة بواسطة الذكاء الاصطناعي',
//       );
//     }
//   }
// }
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiAnalysisService {
  private readonly apiUrl = 'https://serverless.roboflow.com';
  private readonly defaultApiKey = 'NRmuEF08gFhr0EvLRoqg';
  private readonly defaultModelId = 'x-ray-3h2z9/2';

  constructor(private readonly configService: ConfigService) {}

  async analyzeXray(fileBuffer: Buffer) {
    const apiKey =
      this.configService.get<string>('ROBOFLOW_API_KEY') || this.defaultApiKey;
    const modelId =
      this.configService.get<string>('ROBOFLOW_MODEL_ID') ||
      this.defaultModelId;

    if (!apiKey || !modelId) {
      throw new InternalServerErrorException(
        'Roboflow configuration is missing.',
      );
    }

    try {
      const base64Image = fileBuffer.toString('base64');
      const url = `${this.apiUrl}/${modelId}?api_key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: base64Image,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new HttpException(
          `Roboflow Error: ${response.status} - ${errorText}`,
          response.status || HttpStatus.BAD_GATEWAY,
        );
      }

      const result = await response.json();

      // --- التعديل الجوهري هنا ---
      // بنجهز البيانات بشكل "نظيف" للفرونت إند عشان نمنع الـ NaN
      const hasPredictions =
        result.predictions && result.predictions.length > 0;

      return {
        ...result,
        // إذا وجد تنبؤات نأخذ الأعلى ثقة، وإلا نرجع قيم افتراضية
        top: hasPredictions
          ? result.predictions[0].class
          : 'Normal (No issues detected)',
        confidence: hasPredictions ? result.predictions[0].confidence : 0,
      };
      // -------------------------
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'حدث خطأ أثناء تحليل الصورة بواسطة الذكاء الاصطناعي',
      );
    }
  }
}
