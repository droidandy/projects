import React, { FC } from 'react';
import cx from 'classnames';
import { Grid, Typography } from '@marketplace/ui-kit';
import { useStyles } from './Table.style';

const Table: FC = () => {
  const s = useStyles();
  return (
    <Grid container className={s.table}>
      <Grid item xs={12}>
        <Grid container justify="space-between" alignItems="flex-start" className={s.row}>
          <Grid item xs={6} className={s.cell}>
            <Typography variant="h5" className={s.title}>
              Сумма покупок в месяц
            </Typography>
          </Grid>
          <Grid item xs={6} className={s.cell}>
            <Typography variant="h5" className={s.title}>
              Надбавка к ставке, % годовых
            </Typography>
          </Grid>
        </Grid>
        <Grid container justify="space-between" alignItems="flex-start" className={s.row}>
          <Grid item xs={6} className={s.cell}>
            <Typography variant="body1" className={s.desc}>
              от 10 000 до 50 000 руб.
            </Typography>
          </Grid>
          <Grid item xs={6} className={cx(s.cell, s.secondCell)}>
            <Typography variant="h4" color="primary" className={s.subtitle}>
              0,50%
            </Typography>
          </Grid>
        </Grid>
        <Grid container justify="space-between" alignItems="flex-start" className={s.row}>
          <Grid item xs={6} className={s.cell}>
            <Typography variant="body1" className={s.desc}>
              от 50 000 и более
            </Typography>
          </Grid>
          <Grid item xs={6} className={cx(s.cell, s.secondCell)}>
            <Typography variant="h4" color="primary" className={s.subtitle}>
              1,00%
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { Table };
