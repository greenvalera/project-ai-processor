import dotenv from 'dotenv';
import { OpenAI } from '@langchain/openai';

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

class AIProvider {
  private model: OpenAI;

  constructor() {
    this.model = new OpenAI({
      openAIApiKey: API_KEY,
      modelName: 'gpt-4o-mini',
      temperature: 0,
      maxTokens: 2048 * 2,
    });
  }

  public async processCode(message: string): Promise<string> {
    try {
      const response = await this.model.invoke(message);

      console.log(response);

      return response;
    } catch (error) {
      console.error('Error during OpenAI request', error);
      throw new Error('AI processing failed');
    }
  }
}

export default AIProvider;
