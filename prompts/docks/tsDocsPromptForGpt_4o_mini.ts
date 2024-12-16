/**
 * Prompt for generating documentation for TypeScript (.ts) files.
 * Focuses on describing components and their props.
 * Currently used with the GPT-4o-mini model, which is less stable compared to GPT-4o.
 * The prompt is not fully optimized: GPT-4o-mini may produce unexpected changes in certain .ts file cases.
 * For example, it might add comments excluded by the prompt or ignore specific examples.
 * While GPT-4o performs this task significantly better, it comes at a much higher cost.
 */
const tsDocsPromptForGpt_4o_mini = `
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
import React, {
  FC,
  ReactNode,
  MutableRefObject,
  useEffect,
  useState,
  useRef,
} from 'react';
import cn from 'classnames';
import {motion, AnimatePresence} from 'framer-motion';

import useEventCallback from '@core/utils/react/useEventCallback';
import AddBabciaUBTracking from '@core/tracking/babcia/containers/AddBabciaUBTracking';
import scrollIntoView from '@core/utils/scroll/scrollIntoView';
import getAnimationTime from '@core/utils/animation/utils/getAnimationTime';

import type {CSSModule} from '../../types';
import SpacingSize from '../../constants/SpacingSize';
import {Icon} from '../icon';
import AccordionContent from './AccordionContent';
import baseCss from './Accordion.css';

export interface AccordionProps {
  // Pass to make controlled component
  active?: boolean;
  // If 'Accordion' is active by default
  defaultActive?: boolean;
  children: ReactNode;
  title: ReactNode;
  className?: string;
  trackingName?: string;
  unbordered?: boolean;
  withBackground: boolean;
  // Force set top spacing because of it's reset in first accordion on some themes
  withTop?: boolean;
  withoutTop?: boolean;
  withoutBottom?: boolean;
  withoutLeft?: boolean;
  withoutRight?: boolean;
  actionClassName?: string;
  titleClassName?: string;
  icon?: string | ReactNode;
  spacedIcon?: boolean;
  arrow?: ReactNode;
  showArrow?: boolean;
  onClick?: () => void;
  withContentWrapper?: boolean; // Use custom content, e.g. no spacings will be applied to children
  withScrollIntoView?: boolean;
  'data-test'?: string;
  /**
   * Scroll into 1/3 of content view
   * Useful, ex. for disapprove reasons, when need show part of accordion content
   */
  partialViewContent?: boolean;
  scrollableRef?: MutableRefObject<HTMLDivElement>;
  spacingSize?: SpacingSize;
  actionSpacing?: SpacingSize;
  withBorder?: boolean;
  withoutTopBorder?: boolean;
  spacedHeading?: boolean;
  inverse?: boolean;
  /**
   * {@see AccordionGroup} passes this prop using cloneElement.
   * Unused here, but required for {@see AccordionGroup} usage in {@see ProfileInfoWithAccordions}.
   */
  closeCurrentItem?: () => void;
}

const ANIMATION_SPEED = getAnimationTime();

const TRANSITION = {duration: ANIMATION_SPEED};

const ARROW_ANIMATION_PROPS = {
  variants: {
    up: {
      rotate: -180,
    },
    down: {
      rotate: 0,
    },
  },
  transition: TRANSITION,
  initial: 'down',
};

const CONTENT_ANIMATION_PROPS = {
  variants: {
    open: {
      opacity: 1,
      height: 'auto',
    },
    exit: {
      opacity: 0,
      height: 0,
    },
    initial: {
      opacity: 0,
      height: 0,
    },
  },
  initial: 'initial',
  exit: 'exit',
  animate: 'open',
  transition: TRANSITION,
};

/**
 * Just a universal 'accordion' component.
 *
 * Be aware that when accordion is closed - content is unmounted. Is an optimization for cases when:
 * 1. You have massive calculations inside, but user don't see them. They can lead to slowing browser
 * 2. The case, when you need to fetch some data on content appear (@see SearchFormSwitchableWrapper.js)
 */
const Accordion: FC<
  // \`AccordionProps\` without \`css\` inside to make it more suitable for \`@phoenix/ui\`.
  AccordionProps & {
    css: CSSModule;
  }
> = ({
  css,
  active: activeFromProps = null,
  defaultActive = false,
  icon,
  title,
  arrow,
  scrollableRef,
  className,
  actionClassName,
  actionSpacing = SpacingSize.NORMAL,
  titleClassName,
  'data-test': dataTest,
  onClick,
  trackingName,
  withContentWrapper = true,
  withScrollIntoView = true,
  partialViewContent = false,
  showArrow = true,
  spacingSize = SpacingSize.NORMAL,
  withBorder = false,
  withoutTopBorder = false,
  withTop = false,
  spacedHeading = true,
  spacedIcon = true,
  unbordered,
  withBackground = true,
  withoutTop,
  withoutBottom,
  withoutLeft,
  withoutRight,
  inverse,
  children,
}) => {
  const ref = useRef<HTMLDivElement>();
  const [activeState, setActive] = useState(defaultActive);
  const active = activeFromProps ?? activeState;

  const handleClick = useEventCallback(() => {
    onClick?.();
    if (activeFromProps === null) {
      setActive(!active);
    }
  });

  const handleRest = useEventCallback((definition: string) => {
    if (!withScrollIntoView || definition === 'exit') {
      return;
    }

    if (scrollableRef?.current) {
      scrollIntoView({
        currentElem: ref.current,
        partialViewContent,
        scrollableElem: scrollableRef.current,
      });
    } else {
      scrollIntoView({
        currentElem: ref.current,
        partialViewContent,
      });
    }
  });

  const initialActive = useRef(active).current;

  useEffect(() => {
    if (initialActive && !window.IS_INTEGRATION_TEST_ENVIRONMENT) {
      setTimeout(handleRest, ANIMATION_SPEED * 1000);
    }
  }, [initialActive, handleRest]);

  return (
    <div
      className={cn(
        baseCss.accordion,
        css.accordion,
        spacingSize && css[spacingSize],
        unbordered && css.unbordered,
        withBackground && css.withBackground,
        withBorder && css.withBorder,
        withoutTopBorder && css.withoutTopBorder,
        withTop && css.withTop,
        withoutTop && css.withoutTop,
        withoutBottom && css.withoutBottom,
        withoutLeft && css.withoutLeft,
        withoutRight && css.withoutRight,
        className,
      )}
      data-test={dataTest}
      ref={ref}
    >
      <AddBabciaUBTracking trackingName={trackingName || 'accordion'}>
        <div
          // Can't use "button" tag since is possible that some nested buttons are rendered
          // @see SearchFormHeadingWithPreselectedCategoriesLayout.js
          role="button"
          tabIndex={0}
          className={cn(
            baseCss.action,
            css.action,
            showArrow && baseCss.withArrow,
            actionClassName,
            actionSpacing && baseCss[actionSpacing],
          )}
          onClick={handleClick}
          data-test="accordionButton"
        >
          <div className={baseCss.heading}>
            <div
              className={cn(
                baseCss.headingWrap,
                spacedHeading && css.spacedHeading,
              )}
            >
              {icon && (
                <div className={baseCss.icon}>
                  {typeof icon === 'string' ? (
                    <Icon type={icon} standard data-test="accordionTitleIcon" />
                  ) : (
                    icon
                  )}
                </div>
              )}
              <div className={cn(baseCss.title, titleClassName)}>{title}</div>
            </div>
            {showArrow &&
              (arrow || (
                <motion.div
                  {...ARROW_ANIMATION_PROPS}
                  animate={active ? 'up' : 'down'}
                >
                  <Icon
                    standard
                    type="bottom"
                    data-test="accordionArrow"
                    inverse={inverse}
                  />
                </motion.div>
              ))}
          </div>
        </div>
      </AddBabciaUBTracking>
      <AnimatePresence>
        {active && (
          <motion.div
            onAnimationComplete={handleRest}
            {...CONTENT_ANIMATION_PROPS}
          >
            {withContentWrapper ? (
              <AccordionContent spaced={spacedIcon && Boolean(icon)}>
                {children}
              </AccordionContent>
            ) : (
              children
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;

>>>

Example Output:

<<<typescript
import React, {
  FC,
  ReactNode,
  MutableRefObject,
  useEffect,
  useState,
  useRef,
} from 'react';
import cn from 'classnames';
import {motion, AnimatePresence} from 'framer-motion';

import useEventCallback from '@core/utils/react/useEventCallback';
import AddBabciaUBTracking from '@core/tracking/babcia/containers/AddBabciaUBTracking';
import scrollIntoView from '@core/utils/scroll/scrollIntoView';
import getAnimationTime from '@core/utils/animation/utils/getAnimationTime';

import type {CSSModule} from '../../types';
import SpacingSize from '../../constants/SpacingSize';
import {Icon} from '../icon';
import AccordionContent from './AccordionContent';
import baseCss from './Accordion.css';

export interface AccordionProps {
  /** Pass to make controlled component */
  active?: boolean;
  /** If 'Accordion' is active by default */
  defaultActive?: boolean;
  /** The content to be displayed inside the accordion */
  children: ReactNode;
  /** The title of the accordion */
  title: ReactNode;
  /** Additional class names for the accordion */
  className?: string;
  /** Name for tracking purposes */
  trackingName?: string;
  /** If the accordion should be unbordered */
  unbordered?: boolean;
  /** If the accordion should have a background */
  withBackground: boolean;
  /** Force set top spacing because of it's reset in first accordion on some themes */
  withTop?: boolean;
  /** Remove top spacing */
  withoutTop?: boolean;
  /** Remove bottom spacing */
  withoutBottom?: boolean;
  /** Remove left spacing */
  withoutLeft?: boolean;
  /** Remove right spacing */
  withoutRight?: boolean;
  /** Additional class names for the action area */
  actionClassName?: string;
  /** Additional class names for the title area */
  titleClassName?: string;
  /** Icon to be displayed in the accordion */
  icon?: string | ReactNode;
  /** If the icon should be spaced */
  spacedIcon?: boolean;
  /** Custom arrow component */
  arrow?: ReactNode;
  /** If the arrow should be shown */
  showArrow?: boolean;
  /** Click handler for the accordion */
  onClick?: () => void;
  /** Use custom content, e.g. no spacings will be applied to children */
  withContentWrapper?: boolean;
  /** If the accordion should scroll into view */
  withScrollIntoView?: boolean;
  /** Data attribute for testing */
  'data-test'?: string;
  /**
   * Scroll into 1/3 of content view
   * Useful, ex. for disapprove reasons, when need show part of accordion content
   */
  partialViewContent?: boolean;
  /** Reference to the scrollable element */
  scrollableRef?: MutableRefObject<HTMLDivElement>;
  /** Size of spacing */
  spacingSize?: SpacingSize;
  /** Spacing for the action area */
  actionSpacing?: SpacingSize;
  /** If the accordion should have a border */
  withBorder?: boolean;
  /** If the top border should be removed */
  withoutTopBorder?: boolean;
  /** If the heading should be spaced */
  spacedHeading?: boolean;
  /** If the accordion should be inverted */
  inverse?: boolean;
  /**
   * {@see AccordionGroup} passes this prop using cloneElement.
   * Unused here, but required for {@see AccordionGroup} usage in {@see ProfileInfoWithAccordions}.
   */
  closeCurrentItem?: () => void;
}

const ANIMATION_SPEED = getAnimationTime();

const TRANSITION = {duration: ANIMATION_SPEED};

const ARROW_ANIMATION_PROPS = {
  variants: {
    up: {
      rotate: -180,
    },
    down: {
      rotate: 0,
    },
  },
  transition: TRANSITION,
  initial: 'down',
};

const CONTENT_ANIMATION_PROPS = {
  variants: {
    open: {
      opacity: 1,
      height: 'auto',
    },
    exit: {
      opacity: 0,
      height: 0,
    },
    initial: {
      opacity: 0,
      height: 0,
    },
  },
  initial: 'initial',
  exit: 'exit',
  animate: 'open',
  transition: TRANSITION,
};

/**
 * Just a universal 'accordion' component.
 *
 * Be aware that when accordion is closed - content is unmounted. Is an optimization for cases when:
 * 1. You have massive calculations inside, but user don't see them. They can lead to slowing browser
 * 2. The case, when you need to fetch some data on content appear (@see SearchFormSwitchableWrapper.js)
 */
const Accordion: FC<
  // \`AccordionProps\` without \`css\` inside to make it more suitable for \`@phoenix/ui\`.
  AccordionProps & {
    css: CSSModule;
  }
> = ({
  css,
  active: activeFromProps = null,
  defaultActive = false,
  icon,
  title,
  arrow,
  scrollableRef,
  className,
  actionClassName,
  actionSpacing = SpacingSize.NORMAL,
  titleClassName,
  'data-test': dataTest,
  onClick,
  trackingName,
  withContentWrapper = true,
  withScrollIntoView = true,
  partialViewContent = false,
  showArrow = true,
  spacingSize = SpacingSize.NORMAL,
  withBorder = false,
  withoutTopBorder = false,
  withTop = false,
  spacedHeading = true,
  spacedIcon = true,
  unbordered,
  withBackground = true,
  withoutTop,
  withoutBottom,
  withoutLeft,
  withoutRight,
  inverse,
  children,
}) => {
  const ref = useRef<HTMLDivElement>();
  const [activeState, setActive] = useState(defaultActive);
  const active = activeFromProps ?? activeState;

  const handleClick = useEventCallback(() => {
    onClick?.();
    if (activeFromProps === null) {
      setActive(!active);
    }
  });

  const handleRest = useEventCallback((definition: string) => {
    if (!withScrollIntoView || definition === 'exit') {
      return;
    }

    if (scrollableRef?.current) {
      scrollIntoView({
        currentElem: ref.current,
        partialViewContent,
        scrollableElem: scrollableRef.current,
      });
    } else {
      scrollIntoView({
        currentElem: ref.current,
        partialViewContent,
      });
    }
  });

  const initialActive = useRef(active).current;

  useEffect(() => {
    if (initialActive && !window.IS_INTEGRATION_TEST_ENVIRONMENT) {
      setTimeout(handleRest, ANIMATION_SPEED * 1000);
    }
  }, [initialActive, handleRest]);

  return (
    <div
      className={cn(
        baseCss.accordion,
        css.accordion,
        spacingSize && css[spacingSize],
        unbordered && css.unbordered,
        withBackground && css.withBackground,
        withBorder && css.withBorder,
        withoutTopBorder && css.withoutTopBorder,
        withTop && css.withTop,
        withoutTop && css.withoutTop,
        withoutBottom && css.withoutBottom,
        withoutLeft && css.withoutLeft,
        withoutRight && css.withoutRight,
        className,
      )}
      data-test={dataTest}
      ref={ref}
    >
      <AddBabciaUBTracking trackingName={trackingName || 'accordion'}>
        <div
          // Can't use "button" tag since is possible that some nested buttons are rendered
          // @see SearchFormHeadingWithPreselectedCategoriesLayout.js
          role="button"
          tabIndex={0}
          className={cn(
            baseCss.action,
            css.action,
            showArrow && baseCss.withArrow,
            actionClassName,
            actionSpacing && baseCss[actionSpacing],
          )}
          onClick={handleClick}
          data-test="accordionButton"
        >
          <div className={baseCss.heading}>
            <div
              className={cn(
                baseCss.headingWrap,
                spacedHeading && css.spacedHeading,
              )}
            >
              {icon && (
                <div className={baseCss.icon}>
                  {typeof icon === 'string' ? (
                    <Icon type={icon} standard data-test="accordionTitleIcon" />
                  ) : (
                    icon
                  )}
                </div>
              )}
              <div className={cn(baseCss.title, titleClassName)}>{title}</div>
            </div>
            {showArrow &&
              (arrow || (
                <motion.div
                  {...ARROW_ANIMATION_PROPS}
                  animate={active ? 'up' : 'down'}
                >
                  <Icon
                    standard
                    type="bottom"
                    data-test="accordionArrow"
                    inverse={inverse}
                  />
                </motion.div>
              ))}
          </div>
        </div>
      </AddBabciaUBTracking>
      <AnimatePresence>
        {active && (
          <motion.div
            onAnimationComplete={handleRest}
            {...CONTENT_ANIMATION_PROPS}
          >
            {withContentWrapper ? (
              <AccordionContent spaced={spacedIcon && Boolean(icon)}>
                {children}
              </AccordionContent>
            ) : (
              children
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Accordion;

>>>

Example of code need any changes:

<<<typescript
import {
  FC,
  ReactNode,
  ReactElement,
  Children,
  useMemo,
  useRef,
  useState,
  cloneElement,
} from 'react';

import useEventCallback from '@core/utils/react/useEventCallback';

import type {AccordionProps} from './Accordion';

export interface AccordionGroupProps {
  // If you have less than 2 accordions it makes no sense to use the "AccordionGroup".
  children: [ReactNode, ReactNode, ...ReactNode[]];
}

const NONE = -1;

/**
 * Container around 'accordions'.
 * Manages the setting of the active state of the accordions.
 */
const AccordionGroup: FC<AccordionGroupProps> = ({children}) => {
  const activeIndex = useRef(NONE);
  const [, update] = useState({});

  const defaultActiveIndex = useMemo(
    () =>
      Children.toArray(children).findIndex(
        (item: ReactElement<AccordionProps>) => item?.props?.defaultActive,
      ),
    [children],
  );

  /**
   * Reset default active tab in case when Accordion was rendered
   * and children updates with another defaultActive prop.
   * Case: user open my profile and click on notification for edit basic info
   */
  useMemo(() => {
    activeIndex.current = defaultActiveIndex;
  }, [defaultActiveIndex]);

  const handleClick = useEventCallback((index: number) => {
    activeIndex.current = activeIndex.current === index ? NONE : index;
    update({});
  });

  const closeCurrentItem = useEventCallback(() => {
    handleClick(NONE);
  });

  return Children.map(
    children,
    (child: ReactElement, index) =>
      child &&
      cloneElement(child, {
        active: activeIndex.current === index,
        onClick: () => {
          handleClick(index);
          child.props.onClick?.();
        },
        closeCurrentItem,
      }),
  );
};

export default AccordionGroup;

>>>

Use this format to document all components and their props in the provided .ts or .tsx file.
`;

export default tsDocsPromptForGpt_4o_mini;