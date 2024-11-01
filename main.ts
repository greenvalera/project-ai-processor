import dotenv from 'dotenv';
import { ProjectProcessor } from './src/ProjectProcessor';
import { FileProcessor } from './src/FileProcessor';
import { AIProvider } from './src/AIProvider';

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
}

const projectPath = '/home/v.pogorelov/phoenix_docker/data/frontend/src/packages/dating/activity/';
const prompt = `As expirianced JavaScript developer rewrite the documentation
 for the following code in JSDOCK format.
 Check documentation for functions and classes definitions.
 Check documentation for code blocks as inline comments, but only for the complex and non-trivial ones/
 Dont check documentation for import statements.
 Dont chane or cut any code, just add documentation.
 Save the import statements as is, dont cut or change them.
 If the documentation is not present, add it.
 If the documentation preset but pure rewrite it.
 If the code is not documented, add documentation.
 If the code is documented and in JSDOCK format and its correct, do nothing.
 Return only the modified code as plain text without any formatting.
 if resulting code in answer is wrapped in code block \`\`\`javascript{code}\`\`\`, unwrap them and return only the code.
 Dont wrap the code in any code blocks, like \`\`\`javascript...\`\`\`.`;


const config = {
    projectPath,
    prompt,
    fileTypes: ['.ts', '.tsx', '.js', '.jsx'],
    excludedFileTypes: ['.test.ts', '.test.tsx', '.test.js', '.test.jsx'],
};

const projectProcessor = new ProjectProcessor(config, API_KEY);

const main = async () => {
    await projectProcessor.processProject();
};

const singleFile = async () => {
    const filePath = '/home/v.pogorelov/phoenix_docker/data/frontend/src/packages/dating/activity/utils/redirectWithPermissionCheck.js';
    const aiProvider = new AIProvider(process.env.OPENAI_API_KEY as string);
    const fileProcessor = new FileProcessor(aiProvider);
    await fileProcessor.processFile({filePath, prompt});
}

main();
//singleFile();
