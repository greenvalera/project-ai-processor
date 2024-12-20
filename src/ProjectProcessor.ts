import * as fs from 'fs/promises';
import * as path from 'path';
import FileProcessor from './FileProcessor';

interface Config {
  projectPath: string;
  fileTypes: string[];
  excludedFileTypes: string[];
  prompt: string;
  promptByTypes?: { [key: string]: string };
}

class ProjectProcessor {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public async processProject(): Promise<void> {
    try {
      const files = await this.scanProject();
      console.log(`Found ${files.length} files to process`);

      for (const filePath of files) {
        const fileProcessor = new FileProcessor(filePath);
        const prompt = this.getPromtByFile(fileProcessor);
        await fileProcessor.processFile({
          prompt
        });
      }
    } catch (error) {
      console.error('Error processing project', error);
    }
  }
  
  public getPromtByFile(file: FileProcessor): string {
    const fileExtension = file.getFileExtension();
    return this.config.promptByTypes?.[fileExtension] || this.config.prompt;
  }

  public getPromtByFileExtention(file: FileProcessor): string {
    const fileExtension = file.getFileExtension();
    return this.config.promptByTypes?.[fileExtension] || this.config.prompt;
  }

  private async scanProject(): Promise<string[]> {
    const files = await this.scanDirectory(this.config.projectPath);
    return files.filter(file => this.shouldProcessFile(file));
  }

  private async scanDirectory(directory: string): Promise<string[]> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(entry => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? this.scanDirectory(fullPath) : Promise.resolve([fullPath]);
    }));
    return Array.prototype.concat(...files);
  }

  private shouldProcessFile(file: string): boolean {
    const fileType = path.extname(file);
    if (this.config.excludedFileTypes.includes(fileType)) return false;

    const relativeFilePath = path.relative(this.config.projectPath, file);
    for (const excludedPattern of this.config.excludedFileTypes) {
      if (new RegExp(excludedPattern).test(relativeFilePath)) {
      return false;
      }
    }

    if (this.config.fileTypes.length === 0) return true;
    return this.config.fileTypes.includes(fileType);
  }
}

export default ProjectProcessor;
