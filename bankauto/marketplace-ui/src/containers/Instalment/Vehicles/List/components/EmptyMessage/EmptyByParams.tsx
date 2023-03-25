import React, { FC } from 'react';
import { Box, Button, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { useStyles } from './EmptyMessage.styles';

export const EmptyByParams: FC = () => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const { values: filterValues, clearFilterValues } = useInstalmentFilter();

  const handleClearFilter = () => {
    clearFilterValues(filterValues.type!);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'}>
        К сожалению, с такими параметрами нет автомобилей в рассрочку.
      </Typography>
      <Button className={s.btn} onClick={handleClearFilter}>
        <Typography variant="inherit" color="primary">
          Посмотреть другие предложения
        </Typography>
      </Button>
    </Box>
  );
};
