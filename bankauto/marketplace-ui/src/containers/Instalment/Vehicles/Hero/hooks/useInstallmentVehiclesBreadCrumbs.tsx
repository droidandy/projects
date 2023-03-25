import { Brand, Model, VehiclesFilterData } from '@marketplace/ui-kit/types';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { BreadCrumbsItem } from 'types/BreadCrumbs';

export const useInstallmentVehiclesBreadCrumbs = (
  data: VehiclesFilterData,
  values: VehiclesFilterValues,
  type: string | null,
  currentBrand: Brand | null | undefined,
  currentModel: Model | null | undefined,
) => {
  const getTypeUrlPart = (vehicleType: string | null) => {
    return vehicleType ? `${vehicleType}/` : '';
  };
  const breadCrumbsData: BreadCrumbsItem[] = [];
  switch (type) {
    case 'new':
      breadCrumbsData.push(
        { to: '/installment', label: 'Рассрочка' },
        { to: '/installment/vehicles/new/', label: 'Новые автомобили' },
      );
      break;
    case 'used':
      breadCrumbsData.push(
        { to: '/installment', label: 'Рассрочка' },
        { to: '/installment/vehicles/used/', label: 'Автомобили с пробегом' },
      );
      break;
    default:
      breadCrumbsData.push(
        { to: '/installment', label: 'Рассрочка' },
        { to: '/installment/vehicles/', label: 'Все автомобили' },
      );
      break;
  }
  const showBrandBreadCrumb = Number(values?.brands?.length) < 2;
  const showModelBreadCrumb = showBrandBreadCrumb && Number(values?.models?.length) < 2;
  if (showBrandBreadCrumb) {
    breadCrumbsData.push({
      to: `/installment/vehicles/${getTypeUrlPart(type)}?brand=${currentBrand?.id}`,
      label: currentBrand?.name || '',
    });
  }

  if (showModelBreadCrumb) {
    breadCrumbsData.push({
      to: `/installment/vehicles/${getTypeUrlPart(type)}?brand=${currentBrand?.id}&model=${currentModel?.id}`,
      label: currentModel?.name || '',
    });
  }
  return breadCrumbsData;
};
