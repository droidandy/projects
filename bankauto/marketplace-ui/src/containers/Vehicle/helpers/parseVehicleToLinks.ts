import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { VehicleNew, VEHICLE_TYPE, VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { BreadCrumbsItem } from 'components/Breadcrumbs/Breadcrumbs';
import { initialState } from 'store/initial-state';
import { parseFilterToLinks } from 'containers/Vehicles/helpers/parseFilerToLinks';
import { carTypeSwitch } from 'helpers/carTypeHelper';

const MapTypeToTypeId = (type: VEHICLE_TYPE): VEHICLE_TYPE_ID | null => {
  switch (type) {
    case VEHICLE_TYPE.NEW:
      return VEHICLE_TYPE_ID.NEW;
    case VEHICLE_TYPE.USED:
      return VEHICLE_TYPE_ID.USED;
    default:
      return null;
  }
};

const parseVehicleToFilter = ({ type }: VehicleNew): VehiclesFilterValues => ({
  ...initialState.vehiclesFilter.values,
  type: MapTypeToTypeId(type),
  // TODO uncomment when filter routing will be finished
  // brands: [MapNodeToOption(brand)],
  // models: [MapNodeToOption(model)],
  // generations: [MapNodeToOption(generation)],
});

export const parseVehicleToLinks = (vehicle: VehicleNew): BreadCrumbsItem[] => {
  const values = parseVehicleToFilter(vehicle);
  const breadcrumbs = parseFilterToLinks(values);
  const {
    equipment,
    engine: { engineVolume },
    year,
  } = vehicle;

  // TODO remove when filter routing will be finished
  const brandCrumb = { to: `/car/${vehicle.type}/${vehicle.brand.alias}/`, label: vehicle.brand.name };
  const modelCrumb = {
    to: `/car/${vehicle.type}/${vehicle.brand.alias}/${vehicle.model.alias}/`,
    label: `${vehicle.model.name}`,
  };

  const currentCrumb = carTypeSwitch(
    vehicle,
    {
      label: `${equipment} ${engineVolume} л, ${year} г.`,
    },
    {
      label: `${engineVolume} л, ${year} г.`,
    },
  );
  return [...breadcrumbs, brandCrumb, modelCrumb, currentCrumb];
};
