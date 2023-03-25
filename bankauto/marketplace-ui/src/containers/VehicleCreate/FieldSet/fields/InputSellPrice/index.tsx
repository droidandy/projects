import React, { FC } from 'react';
import { Field } from 'react-final-form';
import NumberFormat from 'react-number-format';
import { Box, Grid, useBreakpoints, Typography, PriceFormat, InputNumber } from '@marketplace/ui-kit';
import { InfoTooltip } from 'components/InfoTooltip';
import { StateError } from 'store/types';
import { AutostatPreloader } from './AutostatPreloader';

type Props = {
  autostatPrice?: number | null;
  placeholder: string;
  name: string;
  loading: boolean;
  error: StateError | null;
};

export const InputSellPrice: FC<Props> = ({ name, placeholder, autostatPrice, loading, error }) => {
  const { isMobile } = useBreakpoints();
  const tooltipText = `Расчет является предварительным и не является публичной офертой. Окончательная стоимость вашего
                        автомобиля может быть определена исключительно после визуального осмотра автомобиля и проведения
                        диагностики специалистами.`;
  let priceFrom = 0;
  let priceTo = 0;

  if (autostatPrice) {
    priceFrom = autostatPrice;
    priceTo = Math.round(autostatPrice + (autostatPrice * 10) / 100);
  }

  return (
    <Grid container direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 0 : 4} wrap="nowrap">
      <Grid item xs={12} sm={4}>
        <Box
          mb={isMobile ? 2.5 : 0}
          p={isMobile ? 2.5 : 5}
          bgcolor="primary.main"
          borderRadius={isMobile ? '0.5rem' : '0.75rem'}
        >
          <Field name={name}>
            {({ input, meta }) => (
              <InputNumber
                error={meta.touched && !!meta.error}
                helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
                name={input.name}
                value={input.value}
                onBlur={input.onBlur}
                onChange={input.onChange}
                variant="outlined"
                label={placeholder}
                thousandSeparator=" "
                suffix=" ₽"
                min={1}
                max={99000000}
              />
            )}
          </Field>
        </Box>
      </Grid>

      <Grid item xs={12} sm={8}>
        <Typography variant="h5" color="textSecondary">
          Стоимость автомобиля
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="h5" color="textSecondary">
            по оценке Автостата
          </Typography>
          <InfoTooltip title={<Typography variant="subtitle1">{tooltipText}</Typography>} />
        </Box>
        {loading ? (
          <Box pt={isMobile ? 3 : 3.75}>
            <AutostatPreloader />
          </Box>
        ) : autostatPrice ? (
          <Box pt={1.25}>
            <Typography variant={isMobile ? 'h3' : 'h2'}>
              <NumberFormat value={priceFrom} thousandSeparator={' '} displayType="text" /> –{' '}
              <PriceFormat value={priceTo} />
            </Typography>
          </Box>
        ) : error || autostatPrice === 0 ? (
          <Box pt={isMobile ? 3 : 3.75}>
            <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} color="textSecondary">
              У нас недостаточно статистических данных для оценки стоимости автомобиля.
            </Typography>
          </Box>
        ) : null}
      </Grid>
    </Grid>
  );
};
