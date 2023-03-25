import { VEHICLE_TYPE, VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';

export enum Tab {
  ALL = 'all',
  NEW = 'new',
  USED = 'used',
}

export const TypeMapper: Record<Tab, VEHICLE_TYPE | null> = {
  [Tab.ALL]: null,
  [Tab.NEW]: VEHICLE_TYPE.NEW,
  [Tab.USED]: VEHICLE_TYPE.USED,
};

export const TypeIdMapper: Record<Tab, VEHICLE_TYPE_ID | null> = {
  [Tab.ALL]: null,
  [Tab.NEW]: VEHICLE_TYPE_ID.NEW,
  [Tab.USED]: VEHICLE_TYPE_ID.USED,
};

export const TabIdxMapper: Record<Tab, 0 | 1 | 2> = {
  [Tab.ALL]: 0,
  [Tab.NEW]: 1,
  [Tab.USED]: 2,
};
