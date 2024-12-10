export type ProcessParams = {
  projectPath: string;
  prompt: string;
  promptByTypes?: { [key: string]: string };
  model: string;
  fileTypes: string[];
  excludedFileTypes: string[];
};
