/* eslint-disable */
import ProjectProcessor from './src/ProjectProcessor';
import FileProcessor from './src/FileProcessor';
import projectConfig from './config';

const singleFile = async () => {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide a file path as an argument. Example: npm run single /path/to/file.js');
    process.exit(1);
  }

  const projectProcessor = new ProjectProcessor(projectConfig);
  const fileProcessor = new FileProcessor(filePath);
  const prompt = projectProcessor.getPromtByFile(fileProcessor);

  await fileProcessor.processFile({
    prompt: prompt,
  });
};

singleFile()
  .then(() => {console.log(`Finished.`);})
  .catch((error) => {console.error(`Error processing file`, error);});
