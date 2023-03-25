import { VehicleShort, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { pushCriteoAnalyticsEvent } from './pushCriteoAnalyticsEvent';

export const sendCatalogViewAnalytics = (vehicles: VehicleShort[]) => {
  pushCriteoAnalyticsEvent({
    ecomm_category: vehicles.some(({ type }: VehicleShort) => type !== vehicles[0]?.type)
      ? 'Все'
      : vehicles[0]?.type === VEHICLE_TYPE.NEW
      ? 'Новые автомобили'
      : 'Автомобили с пробегом',
    rtrgAction: 'view_catalog',
    rtrgData: {
      products: vehicles.map(({ id, price }) => ({ id, price })),
    },
  });
};
