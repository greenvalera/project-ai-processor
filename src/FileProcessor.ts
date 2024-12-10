import * as fs from 'fs/promises';
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

  static isFormatted(text: string): boolean {
    const formattedCodeRegex = /^```[a-zA-Z]*\n([\s\S]*?)\n```$/;
    return formattedCodeRegex.test(text);
  }

  public async processFile({
    filePath,
    prompt,
  }: ProcessFileOptions): Promise<void> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
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
