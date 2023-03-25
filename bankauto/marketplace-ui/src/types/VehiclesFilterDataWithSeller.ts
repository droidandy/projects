import { VehiclesFilterData } from '@marketplace/ui-kit/types';
import { SELLER_TYPE } from 'types/VehiclesFilterValues';

export type FILTER_SELLER_TYPE = {
  [SELLER_TYPE.PERSON]: string;
  [SELLER_TYPE.DEALER]: string;
};

export type VehiclesFilterDataWithSeller = VehiclesFilterData & {
  sellerType?: FILTER_SELLER_TYPE | null;
  salesOfficeId?: number[] | null;
};
