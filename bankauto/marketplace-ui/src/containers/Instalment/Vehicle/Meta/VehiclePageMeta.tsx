import React, { memo, useMemo } from 'react';
import { Meta } from 'components/Meta';
import { useInstalmentOffer } from 'store/instalment/vehicle/item';

export const VehiclePageMeta = memo(() => {
  const { vehicle } = useInstalmentOffer();

  const meta = useMemo(() => {
    if (vehicle) {
      const currentPrice = vehicle.installmentPayments[60]; //TODO: Уточнить как получать
      const creditMonthlyPayment = currentPrice / 5; //TODO: Уточнить рассчёт
      const fullName = `${vehicle.brand.name} ${vehicle.model.name} ${vehicle.generation.name}`;
      return {
        title: `${fullName}, (${vehicle.enginePower} л.с.), ${vehicle.color.name}, ${vehicle.year} год - цена ${currentPrice} р. на БанкАвто.ру`,
        description: `Купить ${fullName}, (${vehicle.enginePower} л.с.), ${vehicle.color.name}, ${vehicle.year} год всего за ${creditMonthlyPayment}р в месяц! Только на БанкАвто.ру`,
      }; //TODO: Уточнить текст
    }
    return {};
  }, [vehicle]);

  return <Meta {...meta} />;
});
