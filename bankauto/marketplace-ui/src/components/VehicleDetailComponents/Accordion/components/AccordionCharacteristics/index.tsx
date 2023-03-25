import React, { FC, useState, useMemo } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Grid } from '@material-ui/core';
import { VehicleCharacteristicsGroup, VehicleCharacteristic } from '@marketplace/ui-kit/types';

import { AccordionItem } from '../AccordionItem';
import { useStyles } from './AccordionCharacteristics.styles';

type Props = {
  characteristics?: VehicleCharacteristicsGroup | null;
};

export const AccordionCharacteristics: FC<Props> = ({ characteristics }) => {
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const { isMobile } = useBreakpoints();
  const { listItem, listContainer, meaning } = useStyles();

  const characteristicsList = useMemo(() => {
    if (characteristics) {
      return Object.entries(characteristics).map(([category, categoryItems]) => {
        return {
          name: category,
          items: categoryItems.filter((item) => item.value !== null && item.value !== undefined),
        };
      });
    }
    return null;
  }, [characteristics]);

  const getOptionDescriprion = (categoryItems: VehicleCharacteristic[]) => (
    <Grid container className={listContainer}>
      {categoryItems.map((item) => (
        <Grid item xs={12} md={6} key={item.id} className={listItem}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body1">{item.name}:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" className={meaning}>{` ${item.value}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );

  const handleChange = (name: string) => (e: React.ChangeEvent<{}>, isExpanded: boolean) =>
    setExpanded(isExpanded ? name : false);

  return (
    <>
      {characteristicsList && characteristicsList.length > 0 ? (
        <Box>
          {characteristicsList.map((category) => (
            <AccordionItem
              key={category.name}
              name={category.name}
              addition={isMobile ? category.items.length : ''}
              isExpanded={expanded === category.name}
              handleChange={handleChange(category.name)}
            >
              {getOptionDescriprion(category.items)}
            </AccordionItem>
          ))}
        </Box>
      ) : null}
    </>
  );
};
