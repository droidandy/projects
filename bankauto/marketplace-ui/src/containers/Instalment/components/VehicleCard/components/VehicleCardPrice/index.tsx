import React, { FC } from 'react';

import { Box, Grid, Typography } from '@material-ui/core';
import { PriceFormat } from '@marketplace/ui-kit';
import { InfoTooltip } from 'components';
import { pluralizeMonth } from 'constants/pluralizeConstants';

type Props = {
  price: number;
  months: number;
  description: string | JSX.Element;
};

export const VehicleCardPrice: FC<Props> = ({ price, months, description }) => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Box pt={1.5}>
          <Typography component="span" color="secondary" variant="h6">
            {description}
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Grid container alignItems="center">
          <Grid item>
            <Box>
              <Typography variant="h3" color="textPrimary" component="span">
                <PriceFormat value={price} />
                /месяц
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <InfoTooltip
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title={
                <Typography variant="body2" style={{ color: 'white' }}>
                  Фиксированная ежемесячная стоимость владения автомобилем в рассрочку
                </Typography>
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Box pb={1.75}>
          <Typography component="span" variant="h6" style={{ lineHeight: '1.25rem' }}>
            {months} {pluralizeMonth(months)}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
