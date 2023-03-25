import React, { memo, useMemo } from 'react';

import { Meta } from 'components/Meta';
import { GET_CREDIT_PROGRAM } from 'constants/creditProgram';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { clamp } from '../../../helpers/clamp';

export const VehiclePageMeta = memo(() => {
  const { vehicle } = useVehicleItem();
  const {
    price,
    discounts: { credit: creditDiscount = 0, tradeIn: tradeInDiscount = 0, market: marketDiscount = 0 },
  } = vehicle!;
  const currentPriceWithoutTradeIn = price! - creditDiscount - marketDiscount;
  const currentPrice = currentPriceWithoutTradeIn - tradeInDiscount;
  // const currentCreditPrice = price! - tradeInDiscountPrice - creditDiscount - marketDiscount;
  const creditProgram = useMemo(
    () =>
      GET_CREDIT_PROGRAM({
        price: currentPriceWithoutTradeIn,
        type: vehicle?.type,
        productionYear: vehicle?.year,
      }),
    [currentPriceWithoutTradeIn, vehicle?.year, vehicle?.type],
  );
  const middlePrice = clamp(creditProgram.INITIAL_PAYMENT.MIN, currentPrice / 2, creditProgram.INITIAL_PAYMENT.MAX);
  const minMonthPayment = creditProgram.CREDIT_PER_MONTH(creditProgram.MONTHS.MAX, middlePrice);

  const meta = useMemo(() => {
    if (vehicle) {
      const fullName = `${vehicle.brand.name} ${vehicle.model.name} ${vehicle.generation.name}`;
      return {
        title: `${fullName}, (${vehicle.engine.enginePower} л.с.), ${vehicle.color.name}, ${vehicle.year} год - цена ${currentPrice} р. на БанкАвто.ру`,
        description: `Купить ${fullName}, (${vehicle.engine.enginePower} л.с.), ${vehicle.color.name}, ${vehicle.year} год всего за ${minMonthPayment}р в месяц! Только на БанкАвто.ру`,
      };
    }
    return {};
  }, [currentPrice, minMonthPayment, vehicle]);

  return <Meta {...meta} />;
});
