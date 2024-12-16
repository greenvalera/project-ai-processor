import type { ProcessParams } from './types';
import { docsPromptDefault, tsDocsPromptForGpt4 } from './prompts/docks';

const projectPath = '***set your project path here***';

const projectConfig: ProcessParams = {
  projectPath,
  prompt: tsDocsPromptForGpt4,
  promptByTypes: {
    ts: tsDocsPromptForGpt4,
    tsx: tsDocsPromptForGpt4,
    js: docsPromptDefault,
    default: docsPromptDefault,
  },
  model: 'gpt-4o',
  fileTypes: ['.ts', '.tsx'],
  excludedFileTypes: ['.test.ts', '.test.tsx', '.test.js', '.test.jsx', 'index.ts', 'index.js', 'types.ts', 'types.js'],
};

export default projectConfig;
