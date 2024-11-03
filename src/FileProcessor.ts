import * as fs from 'fs/promises';
import { PromptTemplate } from '@langchain/core/prompts';
import AIProvider from './AIProvider';

type ProcessFileOptions = {
  filePath: string;
  prompt: string;
};

class FileProcessor {
  private aiProvider: AIProvider;

  constructor() {
    this.aiProvider = new AIProvider();
  }

  public async processFile({
    filePath,
    prompt,
  }: ProcessFileOptions): Promise<void> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const template = new PromptTemplate({
        inputVariables: ['prompt', 'sourceCode'],
        template: `{prompt}
        Input code:
        '''
        {sourceCode}
        ''''`,
      });

      const message = await template.format({
        prompt,
        sourceCode: fileContent,
      });

      console.log(`Processing file: ${filePath}`);
      console.log('Message:', message);

      let modifiedContent = await this.aiProvider.processCode(message);
      modifiedContent = FileProcessor.removeFormattingWrapper(modifiedContent);

      await fs.writeFile(filePath, modifiedContent, 'utf8');
      console.log(`Processed file: ${filePath}`);
    } catch (error) {
      console.error(`Error processing file: ${filePath}`, error);
    }
  }

  static removeFormattingWrapper(text: string): string {
    const formattedCodeRegex = /^```[a-zA-Z]*\n([\s\S]*?)\n```$/;
    const match = text.match(formattedCodeRegex);

    if (match) {
      return match[1];
    }

    return text;
  }
}

export default FileProcessor;
