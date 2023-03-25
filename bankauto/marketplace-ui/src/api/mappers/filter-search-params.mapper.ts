import { VehiclesParamsDTO } from 'dtos/VehiclesParamsDTO';
import { VehicleFilterValues } from 'types/VehicleFilterValues';
import { SELLER_TYPE, VehiclesFilterValues } from 'types/VehiclesFilterValues';

function filterSearchParamsMapper(filterValues: VehicleFilterValues): VehiclesParamsDTO {
  return {
    brandId: filterValues.brand?.map(({ value }) => value as number),
    modelId: filterValues.model?.map(({ value }) => value as number),
    generationId: filterValues.generation?.map(({ value }) => value as number),
    priceFrom: filterValues.priceFrom ? +filterValues.priceFrom : undefined,
    priceTo: filterValues.priceTo ? +filterValues.priceTo : undefined,
    bodyTypeId: filterValues.bodyType?.map(({ value }) => value as number),
    transmissionId: filterValues.transmission?.map(({ value }) => value as number),
    engineId: filterValues.engineType?.map(({ value }) => value as number),
    mileageFrom: filterValues.mileageFrom ? +filterValues.mileageFrom : undefined,
    mileageTo: filterValues.mileageTo ? +filterValues.mileageTo : undefined,
    driveId: filterValues.driveType?.map(({ value }) => value as number),
    productionYearFrom: filterValues?.yearFrom ? +filterValues?.yearFrom : undefined,
    productionYearTo: filterValues?.yearTo ? +filterValues?.yearTo : undefined,
    powerFrom: filterValues.powerFrom ? +filterValues.powerFrom : undefined,
    powerTo: filterValues.powerTo ? +filterValues.powerTo : undefined,
    volumeFrom: filterValues?.volumeFrom ? +filterValues?.volumeFrom : undefined,
    volumeTo: filterValues?.volumeTo ? +filterValues?.volumeTo : undefined,
    basicColorId: filterValues.color?.map((value) => value),
    installmentMonths: filterValues.installmentMonths ? +filterValues.installmentMonths : undefined,
    installmentMonthlyPaymentFrom: filterValues.installmentMonthlyPaymentFrom
      ? +filterValues.installmentMonthlyPaymentFrom
      : undefined,
    installmentMonthlyPaymentTo: filterValues.installmentMonthlyPaymentTo
      ? +filterValues.installmentMonthlyPaymentTo
      : undefined,
  };
}

function filterSearchParamsMapperNew(filterValues: VehiclesFilterValues): VehiclesParamsDTO {
  return {
    type: filterValues.type !== null ? filterValues.type : undefined,
    specialOfferId: filterValues.specialOffers?.map(({ value }) => value as number),
    distance: filterValues.distance as number,
    brandId: filterValues.brands?.map(({ value }) => value as number),
    modelId: filterValues.models?.map(({ value }) => value as number),
    generationId: filterValues.generations?.map(({ value }) => value as number),
    bodyTypeId: filterValues.bodyTypes?.map(({ value }) => value as number),
    transmissionId: filterValues.transmissions?.map(({ value }) => value as number),
    equipmentId: filterValues.equipmentId ? +filterValues.equipmentId : undefined,
    withGift: filterValues.withGift ? 1 : undefined,
    driveId: filterValues.drives?.map(({ value }) => value as number),
    basicColorId: filterValues.colors?.map((value) => value),
    priceFrom: filterValues.priceFrom ? +filterValues.priceFrom : undefined,
    priceTo: filterValues.priceTo ? +filterValues.priceTo : undefined,
    engineId: filterValues.engines?.map(({ value }) => value as number),
    productionYearFrom: filterValues?.yearFrom ? +filterValues?.yearFrom : undefined,
    productionYearTo: filterValues?.yearTo ? +filterValues?.yearTo : undefined,
    mileageFrom: filterValues.mileageFrom ? +filterValues.mileageFrom : undefined,
    mileageTo: filterValues.mileageTo ? +filterValues.mileageTo : undefined,
    powerFrom: filterValues.powerFrom ? +filterValues.powerFrom : undefined,
    powerTo: filterValues.powerTo ? +filterValues.powerTo : undefined,
    volumeFrom: filterValues?.volumeFrom ? +filterValues?.volumeFrom : undefined,
    volumeTo: filterValues?.volumeTo ? +filterValues?.volumeTo : undefined,
    installmentMonths: filterValues.installmentMonths ? +filterValues.installmentMonths : undefined,
    sellerType:
      filterValues.sellerType && filterValues.sellerType !== SELLER_TYPE.ALL ? filterValues.sellerType : undefined,
    cityId: (filterValues.cityId as number[]) || undefined,

    installmentMonthlyPaymentFrom: filterValues.installmentMonthlyPaymentFrom
      ? +filterValues.installmentMonthlyPaymentFrom
      : undefined,
    installmentMonthlyPaymentTo: filterValues.installmentMonthlyPaymentTo
      ? +filterValues.installmentMonthlyPaymentTo
      : undefined,
    salesOfficeId: filterValues.salesOfficeId?.map((value) => value),
  };
}

export { filterSearchParamsMapper, filterSearchParamsMapperNew };
