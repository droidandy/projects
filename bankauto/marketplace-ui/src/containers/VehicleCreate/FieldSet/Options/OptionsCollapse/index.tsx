import React, { FC } from 'react';
import Typography from '@marketplace/ui-kit/components/Typography';
import Accordion from '@marketplace/ui-kit/components/Accordion';
import AccordionDetails from '@marketplace/ui-kit/components/AccordionDetails';
import AccordionSummary from '@marketplace/ui-kit/components/AccordionSummary';
import { VehicleFormOptions } from 'types/VehicleFormType';
import { OptionsGroup } from '../OptionsGroup';
import { useStyles } from './OptionsCollapse.styles';

interface OptionsFieldSetWrapper {
  options: VehicleFormOptions;
}

export const OptionsCollapse: FC<OptionsFieldSetWrapper> = ({ options }) => {
  const classes = useStyles();
  return (
    <Accordion classes={{ root: classes.root }}>
      <AccordionSummary
        classes={{ root: classes.summaryRoot, expanded: classes.expanded, content: classes.summaryContent }}
      >
        <Typography variant="h4" component="p">
          Опции&nbsp;
          <Typography variant="body2" color="textSecondary" component="span">
            Необязательно
          </Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails classes={{ root: classes.detailsRoot }}>
        {options.map((group) => (
          <OptionsGroup key={group.id} {...group} spacing={4} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};
