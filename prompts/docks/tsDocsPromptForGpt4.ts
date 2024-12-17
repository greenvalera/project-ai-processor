/**
 * Prompt for generating documentation for TypeScript (.ts) files.
 * Focuses on describing components and their props.
 * Currently used with the GPT-4o model, which provides better results than GPT-4o-mini but comes at a significantly higher cost.
 */
const tsDocsPromptForGpt4 = `
# Task description.
Analyze the provided .ts file and add inline documentation. Follow these rules strictly:

# Instructions for different types of comments.

## Component Description
* Add a concise but informative JSDoc comment before each component's definition, explaining its purpose and general functionality.

## Props Type/Interface Description:
* DON'T ADD any comments before the type/interface declaration.

## Props Documentation
* For any type or interface that defines the component's props (e.g., ComponentProps), add a descriptive comment for each property directly above the property.
* ALL prop may have comment. If property hasn't a comment, add a comment for it.
* Use one-line comments for each property to describe its purpose and behavior if it's clear.
* Use two-line comments for complex properties that require detailed explanations.
* Max line count for prop comment is 2 lines.
* For optional properties explain the behavior when provided or omitted.
* For other types: Clearly explain the purpose and expected value.
* Comment should be in format /** ... */
* If its one-line comment, open and close comment on the same line.
* Skip comments for prop named "children".
* Add only comments but not empty lines before the prop.
* Skip obvious phrases like  "Optional; may be omitted if no action is required upon change."

# Requirements for the code modifications absence:
* Retain the structure of the original code.
* DO NOT CHANGE ANY CODE LOGIC.
* DO NOT ADD OR REMOVE ANY CODE.
* Do not wrap the code in backticks or any other formatting.
* Output clean TypeScript code ready to be saved directly into a .ts file.
* Save empty lines and spaces as they are.
* Save empty line at the end of the file.

# Common requirements for the comments:
* Save all existing useful comments to code or save theme sense as they are.
* Don't add any new comments to the code except described above.
* All added comments should be in format /** {Some comment} */.

# List of exceptions. DON'T ADD next comments:
* Props for the <SomeComponent>. For example: "Props for the MapEventsHandler component." or any other comments before <SomeComponent>Props types/interfaces.
* @interface AccordionGroupProps
* @component
* JSDOC list of @prop before component declaration or export statement.
* Comment's for event handler functions, like onMapMoveStart, onMouseUp, onZoomStart, etc.

# Examples of input and output:

Example Input:
<<<typescript
import React, {FC} from 'react';

import MapProvider from '../../constants/MapProvider';
import MaptilerLayer from './MaptilerLayer';
import type {TileProviderProps} from './types';
import OSMTileLayer from './OSMTileLayer';

type TileLayerFactoryProps = TileProviderProps & {
  apiKey?: string;
  provider: MapProvider;
};

const TileLayerFactory: FC<TileLayerFactoryProps> = ({
  apiKey,
  style,
  provider = MapProvider.MAP_TILLER,
}) => {
  if (window && window.IS_INTEGRATION_TEST_ENVIRONMENT) {
    return null;
  }

  if (apiKey && provider === MapProvider.MAP_TILLER) {
    return <MaptilerLayer apiKey={apiKey} style={style} />;
  }

  return <OSMTileLayer />;
};

export default TileLayerFactory;

>>>

Example Output:
<<<typescript
import React, {FC} from 'react';

import MapProvider from '../../constants/MapProvider';
import MaptilerLayer from './MaptilerLayer';
import type {TileProviderProps} from './types';
import OSMTileLayer from './OSMTileLayer';

type TileLayerFactoryProps = TileProviderProps & {
  /**
   * Optional API key for accessing the Maptiler service.
   * If provided and the provider is Maptiler, the MaptilerLayer component will be used.
   */
  apiKey?: string;

  /**
   * The map provider to determine which tile layer to render.
   * Defaults to MapProvider.MAP_TILLER if not specified.
   */
  provider: MapProvider;
};

/**
 * Factory component for rendering different tile layers based on the map provider.
 * It decides which tile layer component to render based on the provided map provider and API key.
 */
const TileLayerFactory: FC<TileLayerFactoryProps> = ({
  apiKey,
  style,
  provider = MapProvider.MAP_TILLER,
}) => {
  if (window && window.IS_INTEGRATION_TEST_ENVIRONMENT) {
    return null;
  }

  if (apiKey && provider === MapProvider.MAP_TILLER) {
    return <MaptilerLayer apiKey={apiKey} style={style} />;
  }

  return <OSMTileLayer />;
};

export default TileLayerFactory;

>>>

Use this format to document all components and their props in the provided .ts or .tsx file.

# Check and fix result
After modification check that result passes next requirements:
* RETAIN THE STRUCTURE of the original code. DO NOT CHANGE any code logic. Don't add any code or remove any code. WORK ONLY WITH COMMENTS.
* Check the code on absence of ANY changes, if you see ANY changes in code, please, UNDO them.
* Check that all props have comments. If some props in prop type/interface don't have comments, please, ADD comments for them by rules above.

If result doesn't pass requirements, please, fix it and and check again.
Once you are sure that the result is correct, submit it.
`;

export default tsDocsPromptForGpt4;