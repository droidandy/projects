import {
  BodyType,
  Brand,
  Drive,
  Engine,
  Generation,
  Model,
  SpecialOffers,
  Transmission,
  VehiclesFilterData,
} from '@marketplace/ui-kit/types';
import { ParsedUrlQuery } from 'querystring';
import { SELLER_TYPE, VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { initialState } from 'store/initial-state';
import { getMappedList } from './getMappedList';

const MOSCOW = '1';

export const parseQueryFilter = (query: ParsedUrlQuery, filterData: VehiclesFilterData): VehiclesFilterValues => {
  const {
    type,
    specialOffers = [],
    brand = [],
    model = [],
    generation = [],
    bodyType = [],
    transmission = [],
    engineType = [],
    driveType = [],
    color = [],
    salesOfficeId = [],
  } = query;

  const mappedSpecialOffers = getMappedList<SpecialOffers>(specialOffers, filterData.specialOffers || []);
  const mappedBrands = getMappedList<Brand>(brand, filterData.brands);
  const mappedModels = getMappedList<Model>(model, filterData.models);
  const mappedGenerations = getMappedList<Generation>(generation, filterData.generations);
  const mappedBodyTypes = getMappedList<BodyType>(bodyType, filterData.bodyTypes);
  const mappedTransmissions = getMappedList<Transmission>(transmission, filterData.transmissions);
  const mappedEngines = getMappedList<Engine>(engineType, filterData.engines);
  const mappedDriveTypes = getMappedList<Drive>(driveType, filterData.drives);
  const mappedColors = Array.isArray(color) ? color.map((v) => +v) : [+color];
  const mappedSalesOfficeId = Array.isArray(salesOfficeId) ? salesOfficeId.map((v) => +v) : [+salesOfficeId];

  return {
    ...initialState.vehiclesFilter.values,
    type: (type as any) ?? null,
    city: MOSCOW,
    specialOffers: specialOffers.length ? mappedSpecialOffers : null,
    brands: brand.length ? mappedBrands : null,
    models: model.length ? mappedModels : null,
    generations: generation.length ? mappedGenerations : null,
    yearFrom: (query.yearFrom as string) ?? null,
    yearTo: (query.yearTo as string) ?? null,
    priceFrom: (query.priceFrom as string) ?? null,
    priceTo: (query.priceTo as string) ?? null,
    bodyTypes: query.bodyType ? mappedBodyTypes : null,
    transmissions: query.transmission ? mappedTransmissions : null,
    engines: query.engineType ? mappedEngines : null,
    drives: query.driveType ? mappedDriveTypes : null,
    mileageFrom: (query.mileageFrom as string) ?? null,
    mileageTo: (query.mileageTo as string) ?? null,
    powerFrom: (query.powerFrom as string) ?? null,
    powerTo: (query.powerTo as string) ?? null,
    volumeFrom: (query.volumeFrom as string) ?? null,
    volumeTo: (query.volumeTo as string) ?? null,
    colors: mappedColors,
    sellerType: (query.sellerType as SELLER_TYPE) ?? null,
    installmentMonths: (query.installmentMonths as string) ?? null,
    installmentMonthlyPaymentFrom: (query.installmentMonthlyPaymentFrom as string) ?? null,
    installmentMonthlyPaymentTo: (query.installmentMonthlyPaymentTo as string) ?? null,
    salesOfficeId: mappedSalesOfficeId ?? null,
  };
};
