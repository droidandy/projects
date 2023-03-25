import React, { FC, useMemo } from 'react';
import classNames from 'classnames';
import { CreditInfo, PriceFormat, Typography, VEHICLE_SCENARIO } from '@marketplace/ui-kit';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { InfoTooltip } from 'components/InfoTooltip';

import { useStyles } from './VehicleCardPrice.styles';

type Props = {
  price: number;
  marketDiscount: number;
  creditDiscount: number;
  tradeInDiscount: number;
  type: VEHICLE_TYPE;
  productionYear: number;
  isSoldC2C?: boolean;
  creditInfo: CreditInfo;
  scenario: VEHICLE_SCENARIO;
};

export const VehicleCardPrice: FC<Props> = ({
  price,
  marketDiscount,
  creditDiscount,
  tradeInDiscount,
  isSoldC2C,
  creditInfo,
  scenario,
}) => {
  const { root, actualPrice, hidden, oldPriceDecoration, shevron } = useStyles();

  const totalDiscount = marketDiscount + creditDiscount + tradeInDiscount;
  const currentPrice = price - totalDiscount;

  const creditInfoBlock = useMemo(() => {
    return ![`${VEHICLE_SCENARIO.USED_FROM_CLIENT}`, `${VEHICLE_SCENARIO.USED_AUCTION_AND_CLIENT}`].includes(
      `${scenario}`,
    ) && creditInfo ? (
      <Typography variant="body2" color="secondary">
        от <PriceFormat value={creditInfo?.monthlyPayment} /> в месяц
        <InfoTooltip
          title={
            <Typography variant="body2" color="inherit">
              В кредит при первоначальном взносе {creditInfo?.initialPayment}% и сроке {creditInfo?.creditTerm} мес.
              <br />
              Возможно оформление кредита без первоначального взноса.
            </Typography>
          }
        />
      </Typography>
    ) : null;
  }, [creditInfo, scenario]);

  return (
    <div className={root}>
      <Typography
        component="span"
        variant="h6"
        className={classNames(oldPriceDecoration, { [hidden]: !totalDiscount })}
      >
        <PriceFormat value={price} suffix="" />
      </Typography>
      <div className={actualPrice}>
        <Typography
          variant="h3"
          color={(isSoldC2C && 'textSecondary') || (totalDiscount && 'primary') || 'textPrimary'}
          component="div"
        >
          <PriceFormat value={currentPrice} />
        </Typography>
        {!isSoldC2C ? creditInfoBlock : null}
      </div>
      <Typography component="span" variant="h6" className={classNames({ [hidden]: !totalDiscount })}>
        Скидка до <PriceFormat value={totalDiscount} /> <span className={shevron}>&gt;</span>
      </Typography>
    </div>
  );
};
