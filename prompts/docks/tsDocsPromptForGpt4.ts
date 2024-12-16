/**
 * Prompt for docs generation for ts files.
 * It concentrates on components and props description.
 * Front uses with GPT-4o model, that works better then GPT-4o-mini but has much higher price.
 */
const tsDocsPromptForGpt4 = `
Analyze the provided .ts file and add detailed inline documentation. Follow these rules strictly:

Component Description: Add a concise but informative JSDoc comment before each component's definition, explaining its purpose and general functionality.

Props Type/Interface Description: DON'T ADD any comments before the type/interface declaration.

Props Documentation: For any type or interface that defines the component's props (e.g., ComponentProps), add a descriptive comment for each property directly above the property. Use the following format:

For optional properties: Explain the behavior when provided or omitted.
For boolean properties: Specify what true or false represents.
For other types: Clearly explain the purpose and expected value.
Retain the structure of the original code.
DO NOT CHANGE ANY CODE LOGIC.
DO NOT ADD OR REMOVE ANY CODE.

Do not wrap the code in backticks or any other formatting. Output clean TypeScript code ready to be saved directly into a .ts file.

Save all existing useful comments to code or save theme sense as they are.
Don't add any new comments to the code except described above.

Save empty lines and spaces as they are.
Save empty line at the end of the file.

All comments should be in format /** ... */.

DON'T ADD such types of comments:
* Props for the <SomeComponent>. For example: "Props for the MapEventsHandler component." or any other comments before <SomeComponent>Props types/interfaces.
* @interface AccordionGroupProps
* @component
* JSDOC list of @prop before component declaration or export statement.
* Comment's for event handler functions, like onMapMoveStart, onMouseUp, onZoomStart, etc.

RETAIN THE STRUCTURE of the original code. DO NOT CHANGE any code logic. Don't add any code or remove any code. WORK ONLY WITH COMMENTS.
After modification check the code on absence of ANY changes, if you see ANY changes in code, please, UNDO them.

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
`;

export default tsDocsPromptForGpt4;