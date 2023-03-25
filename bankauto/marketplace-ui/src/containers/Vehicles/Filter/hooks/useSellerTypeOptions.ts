import { useMemo } from 'react';
import { SELLER_TYPE } from 'types/VehiclesFilterValues';
import { FILTER_SELLER_TYPE } from 'types/VehiclesFilterDataWithSeller';

export const useSellerTypeOptions = (sellerType?: FILTER_SELLER_TYPE | null) =>
  useMemo(() => {
    if (!sellerType) return null;
    const options = Object.entries(sellerType).map(([value, label]) => ({ label, value }));
    options.push({
      label: 'Все',
      value: SELLER_TYPE.ALL,
    });
    return options;
  }, [sellerType]);
