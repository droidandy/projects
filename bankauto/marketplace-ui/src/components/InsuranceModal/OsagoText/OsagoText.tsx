import React from 'react';
import { Grid, Typography, PriceFormat } from '@marketplace/ui-kit';

import { useStyles } from '../InsuranceModal.styles';

interface Props {
  price?: number;
}

const OsagoText = ({ price }: Props) => {
  const classes = useStyles();

  return (
    <Grid container direction="column" wrap="nowrap" className={classes.insuranceInfo} spacing={2}>
      <Grid item>
        <Typography variant="h5">ОСАГО – Обязательное страхование автогражданской ответственности</Typography>
      </Grid>
      {price && (
        <Grid item>
          <Typography variant="h5" component="div" color="primary">
            <PriceFormat value={price} />
            /год
          </Typography>
        </Grid>
      )}
      <Grid item>
        <Typography variant="body1" component="div">
          Выплата максимальной суммы зависит от степени нанесенного ущерба потерпевшей стороне:
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" component="div">
          <ul className={classes.osagoList}>
            <li>до 500 000 руб. – вред нанесен жизни либо здоровью. Выплата осуществляется каждому пострадавшему.</li>
            <li>до 400 000 руб. – выплата за вред, нанесенный материальным ценностям.</li>
          </ul>
        </Typography>
      </Grid>
    </Grid>
  );
};

export { OsagoText };
