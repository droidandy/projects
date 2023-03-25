import React, { FC } from 'react';
import { Box } from '@marketplace/ui-kit';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { EmptyByParams } from './EmptyByParams';
import { EmptyByCity } from './EmptyByCity';
import { useStyles } from './EmptyMessage.styles';

export const EmptyMessage: FC = () => {
  const s = useStyles();
  const {
    values: { type, city, ...restFilterValues },
  } = useVehiclesFilter();

  const isAnyFilterParamSet = Object.values(restFilterValues).some((item) =>
    item && Array.isArray(item) ? item.length : item,
  );

  return (
    <Box className={s.root}>{isAnyFilterParamSet ? <EmptyByParams type={type!} /> : <EmptyByCity type={type!} />}</Box>
  );
};
