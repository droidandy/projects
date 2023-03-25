import { VehicleInstalmentItem } from 'types/Vehicle';
import { BreadCrumbsItem } from 'components/Breadcrumbs/Breadcrumbs';
import { stringifyFilterQuery } from 'helpers/filter';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';

export const parseVehicleToLinks = (vehicle: VehicleInstalmentItem): BreadCrumbsItem[] => {
  const { values, initial } = useInstalmentFilter();
  let query = null;
  if (!initial) {
    query = stringifyFilterQuery(values);
  }

  const instalmentCrumb = {
    to: query ? `/installment/?${query}` : '/installment',
    label: 'Рассрочка',
  };
  const brandCrumb = { to: `/installment/vehicles/?brand=${vehicle.brand.id}`, label: vehicle.brand.name };
  const modelCrumb = {
    to: `/installment/vehicles/?brand=${vehicle.brand.id}&model=${vehicle.model.id}`,
    label: `${vehicle.model.name}`,
  };
  const currentCrumb = {
    label: `${vehicle.engineVolume} л, ${vehicle.year} г.`,
  };
  return [instalmentCrumb, brandCrumb, modelCrumb, currentCrumb];
};
