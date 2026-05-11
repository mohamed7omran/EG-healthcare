import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Chroma } from '@langchain/community/vectorstores/chroma';

@Injectable()
export class RagService implements OnModuleInit {
  private vectorStore: Chroma;
  private chatModel: ChatOpenAI;

  async onModuleInit() {
    // إعداد الموديلات من LM Studio
    const embeddings = new OpenAIEmbeddings({
      apiKey: 'no-key',
      configuration: { baseURL: 'http://localhost:1234/v1' },
      modelName: 'text-embedding-qwen3-embedding-0.6b',
    });

    this.chatModel = new ChatOpenAI({
      apiKey: 'no-key',
      configuration: { baseURL: 'http://localhost:1234/v1' },
      modelName: 'qwen/qwen3.5-9b',
      temperature: 0.3, // خليها قليلة عشان الدقة الطبية
    });

    // الربط مع السيرفر اللي إنت مشغله (localhost:8000)
    this.vectorStore = await Chroma.fromExistingCollection(embeddings, {
      url: 'http://localhost:8001',
      collectionName: 'patient_knowledge_base',
    }).catch(async () => {
      // لو أول مرة يشتغل، بيكريه كولكشن جديد
      return await Chroma.fromTexts(['Start'], [{}], embeddings, {
        url: 'http://localhost:8001',
        collectionName: 'patient_knowledge_base',
      });
    });
  }

  // فنكشن لإضافة بيانات طبية
  async addData(text: string, metadata: any) {
    await this.vectorStore.addDocuments([{ pageContent: text, metadata }]);
  }

  // فنكشن التحليل والرد
  async ask(question: string) {
    const docs = await this.vectorStore.similaritySearch(question, 3);
    const context = docs.map((d) => d.pageContent).join('\n');

    const prompt = `بناءً على السجلات التالية:\n${context}\n\nالسؤال: ${question}`;
    const res = await this.chatModel.invoke(prompt);
    return res.content;
  }
}
