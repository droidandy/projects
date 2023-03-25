import React, { FC, memo } from 'react';
import Grid from '@material-ui/core/Grid';
import { SelectBase } from 'components/Fields/SelectBase';

interface Props {
  isDisabled?: boolean;
}

export const VehicleIdentityFieldSet: FC<Props> = memo(({ isDisabled }) => {
  return (
    <Grid container spacing={5}>
      <Grid item xs={12} sm={4}>
        <SelectBase name="city" disabled={isDisabled} placeholder="Город" variant="outlined" show />
      </Grid>
      <Grid item xs={12} sm={4}>
        <SelectBase name="brand" disabled={isDisabled} placeholder="Марка" variant="outlined" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <SelectBase name="model" placeholder="Модель" variant="outlined" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <SelectBase name="year" placeholder="Год" variant="outlined" />
      </Grid>
    </Grid>
  );
});
