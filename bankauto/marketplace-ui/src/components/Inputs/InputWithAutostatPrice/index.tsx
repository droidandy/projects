import React from 'react';
import { Tooltip } from '@material-ui/core';
import { PriceFormat } from '@marketplace/ui-kit';
import InputNumberPrice, {
  InputNumberPriceProps,
} from '@marketplace/ui-kit/components/InputSpecified/InputNumberPrice';
import { Grid, Typography } from '@material-ui/core';
import { InfoAboutAutostat } from './InfoAboutAutostat';
import { useStyles } from './InputWithAutostatPrice.styles';

type Props = InputNumberPriceProps & {
  autostatPrice: number;
  className?: string;
};

export const InputWithAutostatPrice = ({ autostatPrice = 0, ...rest }: Props) => {
  const { autostatData, priceFromAutostat, autostatLabel, flexContainer, price, info, hintContainer } = useStyles();

  return (
    <Grid container className={flexContainer}>
      <Grid container item xs={12} sm={6} className={autostatData}>
        <Typography className={autostatLabel}>
          Стоимость автомобиля по оценке Автостата{' '}
          <Tooltip
            classes={{ tooltip: hintContainer }}
            title={<InfoAboutAutostat />}
            enterTouchDelay={0}
            placement="top"
          >
            <span className={info}>i</span>
          </Tooltip>
        </Typography>
        <Typography className={priceFromAutostat}>
          <PriceFormat value={autostatPrice} />
        </Typography>
      </Grid>
      <Grid container item xs={12} sm={6}>
        <InputNumberPrice {...rest} className={price} />
      </Grid>
    </Grid>
  );
};
