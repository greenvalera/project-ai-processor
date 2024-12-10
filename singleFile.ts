/* eslint-disable */
import FileProcessor from './src/FileProcessor';
import config from './config';

const { prompt } = config;

const singleFile = async () => {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide a file path as an argument. Example: npm run single /path/to/file.js');
    process.exit(1);
  }

  const fileProcessor = new FileProcessor();
  await fileProcessor.processFile({
    filePath,
    prompt
  });
};

singleFile()
  .then(() => {console.log(`Finished.`);})
  .catch((error) => {console.error(`Error processing file`, error);});
