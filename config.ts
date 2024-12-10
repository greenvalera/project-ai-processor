import type { ProcessParams } from './types';
import docsPromt from './prompts/docsPromt';

const projectPath = '/home/v.pogorelov/phoenix_docker/data/frontend/src/packages/dating/activity/';

const projectConfig: ProcessParams = {
  projectPath,
  prompt: docsPromt,
  model: 'gpt-4o',
  fileTypes: ['.ts', '.tsx', '.js', '.jsx'],
  excludedFileTypes: ['.test.ts', '.test.tsx', '.test.js', '.test.jsx'],
};

export default projectConfig;
