import { VehicleAlias } from 'types/VehicleAlias';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { BreadCrumbsItem } from 'types/BreadCrumbs';

const getTypeUrlPart = (type: string | null) => {
  return type ? `${type}/` : '';
};

export const getVehicleBreadCrumbs = (
  type: string | null,
  alias: {
    brand: VehicleAlias | null;
    model: VehicleAlias | null;
    generation: VehicleAlias | null;
  } | null,
  filterValues: VehiclesFilterValues,
) => {
  const breadCrumbsData: BreadCrumbsItem[] = [];
  const { brand, model, generation } = alias || {};

  switch (type) {
    case 'new':
      breadCrumbsData.push({ to: '/', label: 'Главная' }, { to: '/car/new/', label: 'Новые автомобили' });
      break;
    case 'used':
      breadCrumbsData.push({ to: '/', label: 'Главная' }, { to: '/car/used/', label: 'Автомобили с пробегом' });
      break;
    default:
      breadCrumbsData.push({ to: '/', label: 'Главная' }, { to: '/car/', label: 'Все автомобили' });
      break;
  }

  const showBrandBreadCrumb = Number(filterValues?.brands?.length) < 2 && brand;
  const showModelBreadCrumb = showBrandBreadCrumb && Number(filterValues?.models?.length) < 2 && model;
  const showGenerationBreadCrumb = showModelBreadCrumb && Number(filterValues?.generations?.length) < 2 && generation;

  if (showBrandBreadCrumb) {
    breadCrumbsData.push({
      to: `/car/${getTypeUrlPart(type)}${brand?.alias}/`,
      label: brand?.name || '',
    });
  }

  if (showModelBreadCrumb) {
    breadCrumbsData.push({
      to: `/car/${getTypeUrlPart(type)}${brand?.alias}/${model?.alias}`,
      label: model?.name || '',
    });
  }

  if (showGenerationBreadCrumb) {
    breadCrumbsData.push({
      to: `/car/${getTypeUrlPart(type)}${brand?.alias}/${model?.alias}/${generation?.alias}`,
      label: generation?.name || '',
    });
  }

  return breadCrumbsData;
};
