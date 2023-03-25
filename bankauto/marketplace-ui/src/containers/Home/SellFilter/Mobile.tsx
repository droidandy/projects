import React, { FC } from 'react';
import { Grid, Button } from '@marketplace/ui-kit';
import { SelectBase } from 'components/Fields/SelectBase';

import { useStyles } from './Filter.styles';

export const FilterMobile: FC = () => {
  const s = useStyles();
  return (
    <>
      <Grid container direction="column" spacing={1} wrap="nowrap">
        <Grid item>
          <SelectBase className={s.control} name="city" area="city" placeholder="Город" variant="outlined" show />
        </Grid>
        <Grid item>
          <SelectBase className={s.control} name="brand" area="brand" placeholder="Марка" variant="outlined" show />
        </Grid>
        <Grid item>
          <SelectBase className={s.control} name="model" area="model" placeholder="Модель" variant="outlined" show />
        </Grid>
        <Grid item>
          <SelectBase className={s.control} name="year" area="year" placeholder="Год выпуска" variant="outlined" show />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" size="large" type="submit" fullWidth>
            Продать
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
