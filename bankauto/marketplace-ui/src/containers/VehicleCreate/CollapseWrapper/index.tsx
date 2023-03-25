import React, { FC, useMemo } from 'react';
import Accordion from '@marketplace/ui-kit/components/Accordion';
import AccordionDetails from '@marketplace/ui-kit/components/AccordionDetails';
import AccordionSummary, { Props as AccordionSummaryProps } from '@marketplace/ui-kit/components/AccordionSummary';
import { useStyles } from './CollapseWrapper.styles';

export interface CollapseWrapperProps extends Pick<AccordionSummaryProps, 'expandIcon' | 'IconButtonProps'> {
  header: JSX.Element | null;
  expanded?: boolean;
}

export const CollapseWrapper: FC<CollapseWrapperProps> = ({
  children,
  header,
  expandIcon,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  IconButtonProps,
  expanded = true,
}) => {
  const s = useStyles();
  const classes = useMemo(
    () => ({
      accordion: {
        root: s.accordionRoot,
      },
      accordionSummary: {
        root: s.accordionSummary,
        expandIcon: s.accordionExpandIcon,
      },
      accordionDetails: {
        root: s.accordionDetailsRoot,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [s],
  );

  return (
    <>
      <Accordion classes={classes.accordion} expanded={expanded}>
        <AccordionSummary classes={classes.accordionSummary} expandIcon={expandIcon} IconButtonProps={IconButtonProps}>
          {header}
        </AccordionSummary>
        <AccordionDetails classes={classes.accordionDetails}>{children}</AccordionDetails>
      </Accordion>
    </>
  );
};
