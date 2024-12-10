import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import AIModelConfig from '../config/AIModelConfig';

dotenv.config();

const SYSTEM_MESSAGE = `
You are experienced JavaScript and TypeScript developer.
 You are working on a React project and need help with some code.
`;

class AIProvider {
  private openai: OpenAI;

  constructor() {
    const configuration = {
      apiKey: AIModelConfig.openAIApiKey,
    };

    this.openai = new OpenAI(configuration);
  }

  public async processCode(message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: AIModelConfig.model,
        messages: [
          { role: 'system', content: SYSTEM_MESSAGE },
          { role: 'user', content: message }
        ],
        max_tokens: AIModelConfig.maxTokens,
        temperature: AIModelConfig.temperature,
      });
      return (response.choices[0].message?.content || '').trim();
    } catch (error: Error | any) {
      const errorMessages = error.response?.data?.error?.message;
      console.error('Error during OpenAI request', errorMessages);
      throw new Error('AI processing failed');
    }
  }
}

export default AIProvider;
