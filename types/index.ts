export type ProcessParams = {
  projectPath: string;
  prompt: string;
  model: string;
  fileTypes: string[];
  excludedFileTypes: string[];
  promptByTypes?: { [key: string]: string };
};
