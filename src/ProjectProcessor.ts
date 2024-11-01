
import { FileProcessor } from './FileProcessor';
import { AIProvider } from './AIProvider';
import * as fs from 'fs/promises';
import * as path from 'path';

interface Config {
    projectPath: string;
    fileTypes: string[];
    excludedFileTypes: string[];
    prompt: string;
    promptByTypes?: { [key: string]: string };
}

export class ProjectProcessor {
    private config: Config;
    private fileProcessor: FileProcessor;

    constructor(config: Config, apiKey: string) {
        this.config = config;
        const aiProvider = new AIProvider(apiKey);
        this.fileProcessor = new FileProcessor(aiProvider);
    }

    public async processProject(): Promise<void> {
        try {
            const files = await this.scanProject();
            console.log(`Found ${files.length} files to process`);
            for (const filePath of files) {
                const fileType = path.extname(filePath);
                const prompt = this.config.promptByTypes?.[fileType] || this.config.prompt;
                await this.fileProcessor.processFile({ filePath, prompt });
            }
        } catch (error) {
            console.error('Error processing project', error);
        }
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
        if (this.config.fileTypes.length === 0) return true;
        return this.config.fileTypes.includes(fileType);
    }
}
