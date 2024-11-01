
import { AIProvider } from './AIProvider';
import * as fs from 'fs/promises';
import * as path from 'path';

type ProcessFileOptions = {
    filePath: string;
    prompt: string;
};

export class FileProcessor {
    private aiProvider: AIProvider;

    constructor(aiProvider: AIProvider) {
        this.aiProvider = aiProvider;
    }

    public async processFile({
        filePath,
        prompt,
    }: ProcessFileOptions): Promise<void> {
        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            let modifiedContent = await this.aiProvider.processCode(fileContent, prompt);
            modifiedContent = this.removeFormattingWrapper(modifiedContent);
            await fs.writeFile(filePath, modifiedContent, 'utf8');
            console.log(`Processed file: ${filePath}`);
        } catch (error) {
            console.error(`Error processing file: ${filePath}`, error);
        }
    }

    private removeFormattingWrapper(text: string): string {
        const formattedCodeRegex = /^```[a-zA-Z]*\n([\s\S]*?)\n```$/;
        const match = text.match(formattedCodeRegex);
      
        if (match) {
          return match[1];
        }
      
        return text;
      }
}
