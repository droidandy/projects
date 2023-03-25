import React, { FC, memo } from 'react';
import { Grid } from '@marketplace/ui-kit';

import { Input, InputDate } from 'components/Fields';
import { useStyles } from '../Contract.styles';

export const DateAndPlaceFieldSet: FC = memo(() => {
  const { firstBlock } = useStyles();
  return (
    <div className={firstBlock}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={8}>
          <Input name="location" placeholder="Место составления" variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputDate name="date" placeholder="Дата составления" variant="outlined" />
        </Grid>
      </Grid>
    </div>
  );
});
