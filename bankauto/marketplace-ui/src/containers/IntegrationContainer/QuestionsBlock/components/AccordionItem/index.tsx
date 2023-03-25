import React, { FC } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@marketplace/ui-kit';
import { useStyles } from './AccordionItem.styles';

type Props = {
  name: string;
  isExpanded: boolean;
  addition?: string | number;
  handleChange: (e: React.ChangeEvent<{}>, isExpanded: boolean) => void;
};

export const AccordionItem: FC<Props> = ({ name, addition, isExpanded, handleChange, children }) => {
  const { additionText, childrenWrapper, accordionItemDot, accordionSummary, accordionTexts, accordionTitle } =
    useStyles({ isExpanded });

  return (
    <Accordion square expanded={isExpanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<div className={accordionItemDot} />} className={accordionSummary}>
        <div className={accordionTexts}>
          <Typography component="div" className={accordionTitle}>
            {name}
          </Typography>
          {addition ? (
            <Typography className={additionText} variant="body1">
              {addition}
            </Typography>
          ) : null}
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className={childrenWrapper}>{children}</div>
      </AccordionDetails>
    </Accordion>
  );
};
