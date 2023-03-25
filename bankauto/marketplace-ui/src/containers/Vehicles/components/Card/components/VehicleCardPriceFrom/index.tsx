import React, { FC } from 'react';
import { Grid, Typography, PriceFormat, CreditInfo } from '@marketplace/ui-kit';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { InfoTooltip } from 'components/InfoTooltip';
import { useStyles } from './VehicleCardPriceFrom.styles';

type Props = {
  price: number;
  type: VEHICLE_TYPE;
  productionYear: number;
  creditInfo: CreditInfo;
};

export const VehicleCardPriceFrom: FC<Props> = ({ price, creditInfo }) => {
  const { title, newPrice, infoColor } = useStyles();

  return (
    <Grid container direction="column">
      <Grid item className={title}>
        Цена
      </Grid>
      <Grid item>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" color="primary" className={newPrice} component="div">
              от <PriceFormat value={price} />
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="secondary" component="div">
              от <PriceFormat value={creditInfo?.monthlyPayment} /> в месяц
              <InfoTooltip
                title={
                  <Typography variant="body2" className={infoColor}>
                    В кредит при первоначальном взносе {creditInfo?.initialPayment}% и сроке {creditInfo?.creditTerm}{' '}
                    мес.
                    <br />
                    Возможно оформление кредита без первоначального взноса.
                  </Typography>
                }
              />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
