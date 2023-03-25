import React, { FC } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@marketplace/ui-kit';
import { useStyles } from './AccordionItem.styles';

type Props = {
  name: string;
  isExpanded: boolean;
  addition?: string | number;
  handleChange: (e: React.ChangeEvent<{}>, isExpanded: boolean) => void;
};

export const AccordionItem: FC<Props> = ({ name, addition, isExpanded, handleChange, children }) => {
  const { additionText, childrenWrapper } = useStyles();

  return (
    <Accordion square expanded={isExpanded} onChange={handleChange}>
      <AccordionSummary>
        <Box width="100%" display="flex" justifyContent="space-between">
          <Typography component="p" variant="h5">
            {name}
          </Typography>
          {addition ? (
            <Typography className={additionText} variant="body1">
              {addition}
            </Typography>
          ) : null}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <div className={childrenWrapper}>{children}</div>
      </AccordionDetails>
    </Accordion>
  );
};
