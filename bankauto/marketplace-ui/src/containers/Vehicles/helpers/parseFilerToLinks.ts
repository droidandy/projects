import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { BreadCrumbsItem } from 'components/Breadcrumbs/Breadcrumbs';
import { getFilterUrl } from 'containers/Vehicles/helpers/getFilterUrl';

export const parseFilterToLinks = (values: VehiclesFilterValues): BreadCrumbsItem[] => {
  const breadcrumbs: BreadCrumbsItem[] = [];
  const { type } = values;
  const typeUrl = getFilterUrl({ type });
  switch (values.type) {
    case VEHICLE_TYPE_ID.NEW:
      breadcrumbs.push({ to: typeUrl, label: 'Новые автомобили' });
      break;
    case VEHICLE_TYPE_ID.USED:
      breadcrumbs.push({ to: typeUrl, label: 'Автомобили с пробегом' });
      break;
    default:
      breadcrumbs.push({ to: typeUrl, label: 'Все автомобили' });
  }

  return breadcrumbs;
};
