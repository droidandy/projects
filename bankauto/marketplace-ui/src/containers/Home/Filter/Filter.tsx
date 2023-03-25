import React, { FC } from 'react';
import cx from 'classnames';
import { useBreakpoints, useDebounce } from '@marketplace/ui-kit';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { ComponentProps } from 'types/ComponentProps';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { useVehiclesMeta } from 'store/catalog/vehicles/meta';
import isEqual from 'lodash/isEqual';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { stringifyFilterQuery } from 'helpers/filter';
import { useStyles } from './Filter.styles';
import { FilterFull } from './components/FilterFull/FilterFull';
import { FilterShort } from './components/FilterShort/FilterShort';

interface Props extends ComponentProps {
  carType?: VEHICLE_TYPE;
}

const Filter: FC<Props> = ({ className }) => {
  const { root, form } = useStyles();
  const {
    values: stateValues,
    setVehiclesFilterValues,
    data: { brands: filterDataBrands, models: filterDataModels },
  } = useVehiclesFilter();
  const {
    meta: { count: carsCount = 0 },
    fetchVehiclesMeta,
  } = useVehiclesMeta();

  const { brands, models, ...stateForLink } = stateValues;

  const isSingleBrand = brands?.length === 1;
  const isSingleModel = models?.length === 1;

  const linkPath = `/car${
    (isSingleBrand &&
      `/${filterDataBrands.find(({ id }) => brands![0]?.value === id)?.alias}${
        (isSingleModel && `/${filterDataModels.find(({ id }) => id === models![0]?.value)?.alias}`) || ''
      }`) ||
    ''
  }`;

  const linkQuery = {
    ...stateForLink,
    ...(!isSingleBrand
      ? {
          brands,
        }
      : {}),
    ...(!(isSingleModel && isSingleBrand)
      ? {
          models,
        }
      : {}),
  };

  const linkHref = {
    pathname: '/car/',
    query: stringifyFilterQuery(linkQuery as VehiclesFilterValues),
  };

  const linkAs = {
    pathname: linkPath,
    query: stringifyFilterQuery(linkQuery as VehiclesFilterValues),
  };

  const debouncedSetVehiclesFilterValues = useDebounce(setVehiclesFilterValues, 200);
  const { isMobile } = useBreakpoints();

  const handleChange = (values: VehiclesFilterValues) => {
    if (isEqual(values, stateValues)) {
      return;
    }

    if (!isEqual(stateValues.brands, values.brands)) {
      values.models = null;
    }

    debouncedSetVehiclesFilterValues(values);
    fetchVehiclesMeta(values);
  };

  return (
    <div className={cx(root, className)}>
      {isMobile ? (
        <FilterShort carsCount={carsCount} onChange={handleChange} linkHref={linkHref} linkAs={linkAs} />
      ) : (
        <FilterFull className={form} onChange={handleChange} linkHref={linkHref} linkAs={linkAs} />
      )}
    </div>
  );
};

export { Filter };
