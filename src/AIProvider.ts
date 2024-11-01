import { Configuration, OpenAIApi } from 'openai';

export class AIProvider {
    private api: OpenAIApi;
    
    constructor(apiKey: string) {
        const configuration = new Configuration({ apiKey });
        this.api = new OpenAIApi(configuration);
    }

    public async processCode(sourceCode: string, prompt: string): Promise<string> {
        try {
            const response = await this.api.createChatCompletion({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: `${prompt}\n\n${sourceCode}` }
                ],
                max_tokens: 2048 * 2,
                temperature: 0.1,
            });
            return response.data.choices[0].message?.content || '';
        } catch (error) {
            console.error('Error during OpenAI request', error);
            throw new Error('AI processing failed');
        }
    }
}
