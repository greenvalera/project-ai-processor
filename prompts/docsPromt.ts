const docsPromt = `
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

Don't document the following:
* import statements.

Return only the modified code as plain text without any formatting.

Before answering, check the following and fix if needed:
* If the code is wrapped in code block \`\`\`javascript{code}\`\`\`, unwrap them and return only the code.
`;

export default docsPromt;
