import React, { useEffect } from 'react';
import { useFormState } from 'react-final-form';
import { useDebounce } from '@marketplace/ui-kit';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { useAutostat } from 'store/autostat';
import { AutostatSchema } from './schema';
import { InputSellPrice } from './fields/InputSellPrice';
import { useFormVehicleContext } from '../FormContext';

export const VehiclePriceFieldSet = () => {
  const {
    values: { brand, model, generation, year, condition, mileage },
  } = useFormState<VehicleFormSellValues>();
  const { catalogType } = useFormVehicleContext();
  const {
    data: autostatData,
    fetchAutostatDataByParams,
    loading: autostatLoading,
    error: autostatError,
  } = useAutostat();

  const fetchAutostatPrice = useDebounce(fetchAutostatDataByParams, 400);

  useEffect(() => {
    AutostatSchema.validate({
      brand,
      model,
      generation,
      year,
      condition,
      mileage,
    })
      .then(() => {
        fetchAutostatPrice({
          brand: brand!,
          model: model!,
          generation: null, // generationId,
          year: year!,
          state: condition!,
          mileage: mileage!,
          catalog: catalogType,
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogType, brand, model, generation, year, condition, mileage]);

  return (
    <InputSellPrice
      name="price"
      placeholder="Введите вашу цену"
      loading={autostatLoading}
      error={autostatError}
      autostatPrice={autostatData ? autostatData.priceAvg : null}
    />
  );
};
