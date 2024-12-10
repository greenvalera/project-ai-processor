/* eslint-disable */
import ProjectProcessor from './src/ProjectProcessor';
import projectConfig from './config';


const projectProcessor = new ProjectProcessor(projectConfig);

// eslint-disable-next-line no-unused-vars
const main = async () => {
  await projectProcessor.processProject();
};

main()
  .then(() => { console.log('Finished.'); })
  .catch((error) => { console.error('Error processing project', error); });
