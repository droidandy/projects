import React, { FC } from 'react';
import NumberFormat from 'react-number-format';
import { Box, Grid, PriceFormat, Typography, useBreakpoints } from '@marketplace/ui-kit';

import { useStyles } from './EstimatedPrice.styles';

interface Props {
  priceFrom: number;
  priceTo?: number;
}

export const EstimatedPrice: FC<Props> = ({ priceFrom, priceTo }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  const to = priceTo ? <PriceFormat value={priceTo} /> : null;
  const from = to ? (
    <NumberFormat value={priceFrom} thousandSeparator={' '} displayType="text" />
  ) : (
    <PriceFormat value={priceFrom} />
  );

  return (
    <Grid container>
      <Grid item direction="column">
        <Typography className={s.estimatedPrice} variant="subtitle1">
          Оценочная стоимость
        </Typography>

        <Typography variant={isMobile ? 'h3' : 'h2'}>
          {to ? (
            <>
              {from} - {to}
            </>
          ) : (
            <>От {from}</>
          )}
        </Typography>
      </Grid>

      <Grid item>
        <Box pl={!isMobile ? 10 : 0} pt={isMobile ? 1.25 : 0}>
          <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} color="textSecondary">
            {priceFrom ? 'Данный расчет является предварительным' : 'Извините!'}
          </Typography>
          <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} color="textSecondary">
            {priceFrom
              ? 'Цена может быть значительно улучшена при осмотре автомобиля'
              : 'У нас недостаточно статистических данных для оценки стоимости автомобиля.'}
          </Typography>
          <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} color="textSecondary">
            {priceFrom
              ? 'в дилерском центре'
              : 'Точная оценка автомобиля будет произведена при осмотре в дилерском центре.'}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
