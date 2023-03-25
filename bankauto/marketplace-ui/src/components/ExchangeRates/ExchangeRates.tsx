import { Box, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import React, { FC } from 'react';

import { ExchangeRates as ExchangeRatesType } from '@marketplace/ui-kit/types/';
import { format, parse } from 'date-fns';
import { useStyles } from './ExchangeRates.styles';

interface Props {
  rates: ExchangeRatesType;
}

const ExchangeRates: FC<Props> = ({ rates }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();
  const formattedDate = rates.date && format(parse(rates.date, 'yyyy.MM.dd', new Date()), 'dd.MM.yyyy');

  return (
    <Box className={s.root}>
      <Box display="flex">
        <Box className={s.header}>
          <Typography className={s.headerTitle} variant="h4">
            Курс валют
          </Typography>
          <Typography variant={isMobile ? 'body2' : 'body1'}>на {formattedDate}</Typography>
        </Box>
      </Box>
      {isMobile ? (
        <Box px={1.25}>
          <Box mb={1.25}>
            <Grid container>
              <Grid item xs={4}>
                <Typography variant="body2" color="secondary">
                  Валюта
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="secondary" align="right">
                  Покупка
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="secondary" align="right">
                  Продажа
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box mb={1.25}>
            <Grid container>
              <Grid item xs={4}>
                <Typography variant="h5">Доллар&nbsp;США</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" align="right">
                  {rates.usdBid.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" align="right">
                  {rates.usdAck.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box mb={1.25}>
            <Grid container>
              <Grid item xs={4}>
                <Typography variant="h5">Евро</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" align="right">
                  {rates.eurBid.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" align="right">
                  {rates.eurAck.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ) : (
        <>
          <Grid container justify="space-evenly" alignItems="center">
            <Grid item>
              <Box fontSize="4rem" fontWeight="bold">
                €
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="body1">Покупка</Typography>
              <Typography variant="h3">{rates.eurBid.toFixed(2)}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">Продажа</Typography>
              <Typography variant="h3">{rates.eurAck.toFixed(2)}</Typography>
            </Grid>
          </Grid>
          <Grid container justify="space-evenly" alignItems="center">
            <Grid item>
              <Box fontSize="4rem" fontWeight="bold">
                $
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="body1">Покупка</Typography>
              <Typography variant="h3">{rates.usdBid.toFixed(2)}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">Продажа</Typography>
              <Typography variant="h3">{rates.usdAck.toFixed(2)}</Typography>
            </Grid>
          </Grid>
        </>
      )}
      <Box />
    </Box>
  );
};

export { ExchangeRates };
