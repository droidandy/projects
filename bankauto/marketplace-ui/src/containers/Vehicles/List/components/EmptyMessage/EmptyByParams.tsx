import React, { FC } from 'react';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { Box, Button, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { useStyles } from './EmptyMessage.styles';

interface Props {
  type: VEHICLE_TYPE_ID;
}

export const EmptyByParams: FC<Props> = ({ type }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const { values: filterValues, clearFilterValues } = useVehiclesFilter();

  const handleClearFilter = () => {
    clearFilterValues(filterValues.type !== undefined && filterValues.type !== null ? filterValues.type : undefined);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'}>
        {`К сожалению, с такими параметрами нет автомобилей${+type ? ' с пробегом' : ''}.`}
      </Typography>
      <Button className={s.btn} onClick={handleClearFilter}>
        <Typography variant="inherit" color="primary">
          Посмотреть другие предложения
        </Typography>
      </Button>
    </Box>
  );
};
