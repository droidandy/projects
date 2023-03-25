import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { stringify } from 'query-string';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';

type FilterQuery = Record<string, string | string[] | VEHICLE_TYPE_ID | undefined | null>;

export const stringifyFilterQuery = (values: VehiclesFilterValues): string => {
  const query: FilterQuery = {
    // type: values.type ?? null,
    specialOffers: values.specialOffers?.map((o) => o.value) ?? null,
    brand: values.brands?.map((o) => o.value) ?? null,
    model: values.models?.map((o) => o.value) ?? null,
    generation: values.generations?.map((o) => o.value) ?? null,
    yearFrom: values.yearFrom ? `${values.yearFrom}` : null,
    yearTo: values.yearTo ? `${values.yearTo}` : null,
    priceFrom: values.priceFrom ? `${values.priceFrom}` : null,
    priceTo: values.priceTo ? `${values.priceTo}` : null,
    bodyType: values.bodyTypes?.map((o) => o.value) ?? null,
    transmission: values.transmissions?.map((o) => o.value) ?? null,
    engineType: values.engines?.map((o) => o.value) ?? null,
    driveType: values.drives?.map((o) => o.value) ?? null,
    powerFrom: values.powerFrom ? `${values.powerFrom}` : null,
    powerTo: values.powerTo ? `${values.powerTo}` : null,
    mileageFrom: values.mileageFrom && values.type === VEHICLE_TYPE_ID.USED ? `${values.mileageFrom}` : null,
    mileageTo: values.mileageTo && values.type === VEHICLE_TYPE_ID.USED ? `${values.mileageTo}` : null,
    volumeFrom: values.volumeFrom ? `${values.volumeFrom}` : null,
    volumeTo: values.volumeTo ? `${values.volumeTo}` : null,
    color: values.colors ? values.colors.map((v) => `${v}`) : null,
    sellerType: values.sellerType ?? null,
    installmentMonths: values.installmentMonths ? `${values.installmentMonths}` : null,
    installmentMonthlyPaymentFrom: values.installmentMonthlyPaymentFrom
      ? `${values.installmentMonthlyPaymentFrom}`
      : null,
    installmentMonthlyPaymentTo: values.installmentMonthlyPaymentTo ? `${values.installmentMonthlyPaymentTo}` : null,
    salesOfficeId: values.salesOfficeId ? values.salesOfficeId.map((v) => `${v}`) : null,
  };

  return stringify(
    Object.keys(query).reduce((acc, filter: string) => {
      if (query[filter] !== '' && query[filter] !== null && query[filter] !== undefined) {
        acc[filter] = query[filter];
      }

      return acc;
    }, {} as FilterQuery),
  );
};
