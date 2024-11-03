/* eslint-disable */
import { ProjectProcessor } from './src/ProjectProcessor';
import FileProcessor from './src/FileProcessor';

const projectPath = '/home/v.pogorelov/phoenix_docker/data/frontend/src/packages/dating/activity/';
const prompt = `Set a role of expirianced JavaScript and TypeScript developer.
 Rewrite the documentation for the following code in JSDOCK format.
 Check documentation for functions and classes definitions.
 Check documentation for code blocks as inline comments, but only for the complex and non-trivial ones.
 Dont change or cut any code, just add documentation.
 Save the import statements as is, dont cut or change them.
 If the documentation is not present, add it.
 If the documentation preset but pure rewrite it.
 If the code is not documented, add documentation.
 If the code is documented and in JSDOCK format and its correct, do nothing.
 
 Special instructions for react components:
 * For react components don't describe input params as @param instructions in component definition section.
 * Example of the component definition documentation:
  * /**
 * React component for rendering....
 */
 * For react components skip the @param instructions in the component definition section.
 * For react components skip the @return instructions in the component definition section.
 * For react components document document .propTypes in the prop types section.
 
 Don't document the following:
 * import statements.
 
 Return only the modified code as plain text without any formatting.
 
 Before answer check the following and fix if needed:
 * If the code is wrapped in code block \`\`\`javascript{code}\`\`\`, unwrap them and return only the code.
 * If is react component and .propTypes are present, remove @param instructions from the component definition section.
 `;

const config = {
  projectPath,
  prompt,
  fileTypes: ['.ts', '.tsx', '.js', '.jsx'],
  excludedFileTypes: ['.test.ts', '.test.tsx', '.test.js', '.test.jsx'],
};

const projectProcessor = new ProjectProcessor(config);

// eslint-disable-next-line no-unused-vars
const main = async () => {
  await projectProcessor.processProject();
};

const singleFile = async () => {
  const filePath = '/home/v.pogorelov/phoenix_docker/data/frontend/src/packages/dating/activity/components/ActivityBannerBeyondBordersIcon.js';
  const fileProcessor = new FileProcessor();
  await fileProcessor.processFile({
    filePath,
    prompt
  });
};

//main();
singleFile();
