import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Chroma } from '@langchain/community/vectorstores/chroma';

@Injectable()
export class RagService implements OnModuleInit {
  private readonly logger = new Logger(RagService.name);
  private vectorStore: Chroma | null = null;
  private chatModel: ChatOpenAI | null = null;
  private initPromise: Promise<void> | null = null;

  async onModuleInit() {
    try {
      await this.ensureInitialized();
    } catch (err) {
      this.logger.warn(
        'RAG initialization skipped — LM Studio/Chroma unavailable. Core API will keep running.',
      );
      this.logger.debug(err);
    }
  }

  private async ensureInitialized() {
    if (this.vectorStore && this.chatModel) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.initialize();
    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  private async initialize() {
    const embeddings = new OpenAIEmbeddings({
      apiKey: 'no-key',
      configuration: { baseURL: 'http://localhost:1234/v1' },
      modelName: 'text-embedding-nomic-embed-text-v1.5', //modelName: 'text-embedding-qwen3-embedding-0.6b',
    });

    this.chatModel = new ChatOpenAI({
      apiKey: 'no-key',
      configuration: { baseURL: 'http://localhost:1234/v1' },
      modelName: 'qwen/qwen3-8b',
      temperature: 0.3,
    });

    this.vectorStore = await Chroma.fromExistingCollection(embeddings, {
      url: 'http://localhost:8001',
      collectionName: 'patient_knowledge_base',
    }).catch(async () => {
      return await Chroma.fromTexts(['Start'], [{}], embeddings, {
        url: 'http://localhost:8001',
        collectionName: 'patient_knowledge_base',
      });
    });
  }

  async addData(text: string, metadata: any) {
    await this.ensureInitialized();
    if (!this.vectorStore) {
      throw new ServiceUnavailableException('RAG service is not available');
    }
    await this.vectorStore.addDocuments([{ pageContent: text, metadata }]);
  }

  /**
   * Similarity search with optional metadata filter.
   * If a filter is provided, the method fetches a larger result set and
   * then filters by metadata to ensure results belong to the requested scope.
   */
  async similaritySearch(query: string, k = 5, filter?: Record<string, any>) {
    await this.ensureInitialized();
    if (!this.vectorStore) {
      throw new ServiceUnavailableException('RAG service is not available');
    }

    return await this.vectorStore.similaritySearch(query, k, filter);
  }

  async answerWithContext(question: string, context: string) {
    await this.ensureInitialized();
    if (!this.chatModel)
      throw new ServiceUnavailableException('RAG chat model not available');

    const prompt = `
  أنت مساعد طبي ذكي وصارم في منصة EGhealthcare.
  مهمتك هي الإجابة على سؤال الطبيب بناءً على "السجلات الطبية المسترجعة" للمريض فقط.
  
  [شروط صارمة]:
  1. إذا لم تحتوِ السجلات على إجابة واضحة للسؤال، قل فوراً: "لا تتوفر معلومات في السجل الطبي للمريض بهذا الخصوص".
  2. لا تقم باختراع أو تخمين أي تفاصيل طبية غير مذكورة في السجلات المرفقة.

  [السجلات الطبية المسترجعة]:
  ${context}

  [سؤال الطبيب]:
  ${question}

  [الإجابة الطبية المعتمدة]:`;

    const res = await this.chatModel.invoke(prompt);
    return res.content;
  }
  async ask(question: string) {
    await this.ensureInitialized();
    if (!this.vectorStore || !this.chatModel)
      throw new ServiceUnavailableException('RAG not ready');
    const docs = await this.vectorStore.similaritySearch(question, 3);
    const context = docs.map((d) => d.pageContent).join('\n');
    const res = await this.chatModel.invoke(
      `بناءً على التالي:\n${context}\nالسؤال: ${question}`,
    );
    return res.content;
  }
}
