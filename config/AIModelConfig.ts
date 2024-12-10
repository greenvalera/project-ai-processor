import dotenv from 'dotenv';
import config from '../config';

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

type AIModelConfigParams = {
  openAIApiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

const AIModelConfig: AIModelConfigParams = {
  openAIApiKey: API_KEY,
  model: config.model,
  temperature: 0,
  maxTokens: 2048 * 2,
};

export default AIModelConfig;
