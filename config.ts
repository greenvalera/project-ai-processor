import type { ProcessParams } from './types';
import docsPromt from './prompts/docsPromt';

const projectPath = '***set your project path here***';

const projectConfig: ProcessParams = {
  projectPath,
  prompt: docsPromt,
  model: 'gpt-4o',
  fileTypes: ['.ts', '.tsx', '.js', '.jsx'],
  excludedFileTypes: ['.test.ts', '.test.tsx', '.test.js', '.test.jsx'],
};

export default projectConfig;
