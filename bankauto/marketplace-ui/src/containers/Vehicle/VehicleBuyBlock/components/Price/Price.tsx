import React, { FC, memo } from 'react';
import { useStyles } from './Price.styles';
import { StyledProps } from '@marketplace/ui-kit/types';
import { Typography, PriceFormat, useBreakpoints } from '@marketplace/ui-kit';

export interface Props extends StyledProps {
  price: string | number;
  oldPrice?: string | number;
  useFrom?: boolean;
}

const PriceRoot: FC<Props> = ({ price, oldPrice, useFrom }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <div>
      {useFrom ? (
        <Typography variant={isMobile ? 'h5' : 'h4'} component="p">
          Цена
        </Typography>
      ) : null}
      {oldPrice && price !== oldPrice ? (
        <Typography variant={isMobile ? 'h5' : 'h4'} className={s.crossedPrice} component="p">
          <PriceFormat value={+oldPrice} className={s.price} />
        </Typography>
      ) : null}
      <Typography variant={isMobile ? 'h3' : 'h2'} color="primary" component="p">
        {useFrom && 'от '}
        <PriceFormat value={+price} className={s.price} />
      </Typography>
    </div>
  );
};

const Price = memo(PriceRoot);
export default Price;
