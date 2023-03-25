import React, { useEffect } from 'react';
import { useBreakpoints, useDebounce } from '@marketplace/ui-kit';
import { stringifyFilterQuery } from 'helpers/filter';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { useRouter } from 'next/router';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';

import isEqual from 'lodash/isEqual';
import { InstalmentMobileFilter } from './InstalmentFilter.Mobile';
import { InstalmentDesktopFilter } from './InstalmentFilter.Desktop';
import { useStyles } from './InatalmentFilter.styles';

const RouterSaver = () => {
  const router = useRouter();
  const { values, initial: initialFilter } = useInstalmentFilter();

  useEffect(() => {
    if (!initialFilter) {
      const path = 'installment';
      const query = stringifyFilterQuery(values);
      router.push('/installment', { pathname: `/${path}`, query }, { shallow: true, scroll: false });
    }
  }, [values, initialFilter]);
  return null;
};

const InstalmentFilter = () => {
  const { isMobile } = useBreakpoints();
  const { root, form } = useStyles();
  const router = useRouter();

  const { values: stateValues, data: formData, setInstalmentVehiclesFilterValues } = useInstalmentFilter();

  const debouncedSetInstalmentVehiclesFilterValues = useDebounce(setInstalmentVehiclesFilterValues, 200);

  const { ...stateForLink } = stateValues;
  const linkPath = 'installment/vehicles';
  const linkQuery = {
    ...stateForLink,
  };

  const linkHref = {
    pathname: linkPath,
    query: stringifyFilterQuery(linkQuery as VehiclesFilterValues),
  };

  const linkAs = {
    pathname: linkPath,
    query: stringifyFilterQuery(linkQuery as VehiclesFilterValues),
  };

  const handleChange = (values: VehiclesFilterValues) => {
    if (isEqual(values, stateValues)) {
      return;
    }

    if (!isEqual(stateValues.brands, values.brands)) {
      values.models = null;
    }

    debouncedSetInstalmentVehiclesFilterValues(values);
  };

  const handleSubmit = () => {
    router.push(linkHref, linkAs);
  };

  const placeholderFrom = React.useCallback(() => {
    return isMobile ? (
      <span>
        Платеж от <br />
        {`${
          stateValues.installmentMonthlyPaymentFrom
            ? ''
            : `${formData.installmentPayments[60]?.min?.toLocaleString('ru-RU')} ₽/месяц`
        }`}
      </span>
    ) : (
      `Платеж от ${
        stateValues.installmentMonthlyPaymentFrom
          ? ''
          : `${formData?.installmentPayments[60]?.min?.toLocaleString('ru-RU')}
                 ₽`
      }`
    );
  }, [formData.installmentPayments, stateValues.installmentMonthlyPaymentFrom, isMobile]);

  const placeholderTo = React.useCallback(() => {
    return isMobile ? (
      <span>
        Платеж до
        <br />
        {`${
          stateValues.installmentMonthlyPaymentTo
            ? ''
            : `${formData.installmentPayments[60]?.max?.toLocaleString('ru-RU')} ₽/месяц`
        }`}
      </span>
    ) : (
      `Платеж до ${
        stateValues.installmentMonthlyPaymentTo
          ? ''
          : `${formData?.installmentPayments[60]?.max?.toLocaleString('ru-RU')}
     ₽`
      }`
    );
  }, [formData.installmentPayments, stateValues.installmentMonthlyPaymentTo, isMobile]);

  return (
    <>
      <RouterSaver />
      <div className={root}>
        {isMobile ? (
          <InstalmentMobileFilter
            handleSubmit={handleSubmit}
            onChange={handleChange}
            placeholderFrom={placeholderFrom}
            placeholderTo={placeholderTo}
          />
        ) : (
          <InstalmentDesktopFilter
            className={form}
            handleSubmit={handleSubmit}
            onChange={handleChange}
            placeholderFrom={placeholderFrom}
            placeholderTo={placeholderTo}
          />
        )}
      </div>
    </>
  );
};

export { InstalmentFilter };
