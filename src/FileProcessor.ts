import * as fs from 'fs/promises';
import AIProvider from './AIProvider';

type ProcessFileOptions = {
  prompt: string;
};

class FileProcessor {
  private aiProvider: AIProvider;
  private filePath: string;

  constructor(filePath: string) {
    this.aiProvider = new AIProvider();
    this.filePath = filePath;
  }

  static isFormatted(text: string): boolean {
    const formattedCodeRegex = /^```[a-zA-Z]*\n([\s\S]*?)\n```$/;
    return formattedCodeRegex.test(text);
  }

  public async processFile({
    prompt,
  }: ProcessFileOptions): Promise<void> {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf8');
      const fileExtension = this.filePath.split('.').pop();

      const template = `{prompt}
      Input code:
      '''
      {sourceCode}
      '''`;

      const message = template
        .replace('{prompt}', prompt)
        .replace('{sourceCode}', fileContent);

      let modifiedContent = await this.aiProvider.processCode(message);
      if (FileProcessor.isFormatted(modifiedContent)) {
        modifiedContent = FileProcessor.removeFormattingWrapper(modifiedContent);
      }
      
      await fs.writeFile(this.filePath, modifiedContent, 'utf8');
      console.log(`Processed file: ${this.filePath}`);
    } catch (error) {
      console.error(`Error processing file: ${this.filePath}`, error);
    }
  }

  public getFileExtension(): string {
    const fileExtension = this.filePath.split('.').pop();
    if (!fileExtension) {
      throw new Error('File extension not found');
    }

    return fileExtension;
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
