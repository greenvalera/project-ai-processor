/**
 * Prompt for docs generation for all types of files by default.
 * Need to be upgraded or specified for different ceases.
 */
const docsPromptDefault = `
Rewrite the documentation for the following code in JSDOC format.
Check documentation for functions and classes definitions.
Check documentation for code blocks as inline comments, but only for the complex and non-trivial ones.
Don't change or cut any code, just add documentation.
Save the import statements as is, don't cut or change them.
If the documentation is not present, add it.
If the documentation is present but pure rewrite it.
If the code is not documented, add documentation.
If the code is documented and in JSDOC format and it's correct, do nothing.

Special instructions for React components:
* For React components, skip the @param and @return instructions in the component definition section.
* For React components, {ComponentName}.propTypes section should be documented as a separate JSDOC block without description and with list of @param instructions.
* For ALL fields of react component property type, but not for this type, add description just before prop definition. For example make fot ALL props:
'''
export type/interface AccordionProps {
  /** If the accordion should be unbordered. */
  unbordered?: boolean;
  /** If the accordion should have a background. */
  withBackground: boolean;
  /** Force set top spacing because of it's reset in first accordion on some themes */
  withTop?: boolean;
  /**  Remove top spacing. */
  withoutTop?: boolean;
  ...
'''

Don't document the following:
* import statements.

Return only the modified code as plain text without any formatting.

Before answering, check the following and fix if needed:
* If the code is wrapped in code block \`\`\`javascript{code}\`\`\`, unwrap them and return only the code.
`;

export const tsDocsPromt = `
Analyze the provided .ts file and add detailed inline documentation. Follow these rules strictly:

Component Description: Add a concise but informative JSDoc comment before each component's definition, explaining its purpose and general functionality.

Props Documentation: For any type or interface that defines the component's props (e.g., ComponentProps), add a descriptive comment for each property directly above the property. Use the following format:

For optional properties: Explain the behavior when provided or omitted.
For boolean properties: Specify what true or false represents.
For other types: Clearly explain the purpose and expected value.
Retain the structure of the original code. Do not change any code logic.

Do not wrap the code in backticks or any other formatting. Output clean TypeScript code ready to be saved directly into a .ts file.

Save all existing usefull comments to code or save theme sanse as they are.
Don't add any new comments to the code except described above.

DON'T ADD next comments:
* Props for the <SomeComponent>. For example: "Props for the MapEventsHandler component."
* @interface AccordionGroupProps
* @component
* JSDOC list of @prop before component declaration or export statement.

Retain the structure of the original code. Do not change any code logic. Don't add any code or remove any code. Work only with comments.

Example Input:

typescript
Копіювати код
export interface AccordionProps {
  unbordered?: boolean;
  withBackground: boolean;
  withTop?: boolean;
  withoutTop?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ unbordered, withBackground, withTop, withoutTop }) => {
  // Component implementation
};
Example Output:

typescript
/**
 * Accordion component renders a collapsible section that can display or hide content.
 * This component provides multiple customization options for borders, background, and spacing.
 */
export interface AccordionProps {
  /** Determines whether the accordion should be rendered without a border. */
  unbordered?: boolean;
  /** Indicates if the accordion should include a background. */
  withBackground: boolean;
  /** Forces top spacing, overriding the default spacing applied to the first accordion. */
  withTop?: boolean;
  /** Removes the default top spacing of the accordion. */
  withoutTop?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ unbordered, withBackground, withTop, withoutTop }) => {
  // Component implementation
};

Use this format to document all components and their props in the provided .ts file.
`;

export default docsPromptDefault;
