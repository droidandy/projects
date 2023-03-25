import { useState, useEffect } from 'react';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { VehicleAlias } from 'types/VehicleAlias';
import { getVehicleBreadCrumbs } from 'helpers/getBreadCrumbs';

interface BreadcrumbsProps {
  filterValues: VehiclesFilterValues;
  alias: {
    brand: VehicleAlias | null;
    model: VehicleAlias | null;
    generation: VehicleAlias | null;
  } | null;
  type: string | null;
}

type BreadcrumbsDataItem = {
  to: string;
  label: string;
};

export const useVehiclesBreadcrumbs = (props: BreadcrumbsProps) => {
  const { filterValues, type, alias } = props;
  const [breadCrumbs, setBreadCrumbs] = useState<BreadcrumbsDataItem[]>([{ to: '', label: '' }]);

  useEffect(() => {
    const breadCrumbsData = getVehicleBreadCrumbs(type, alias, filterValues);

    setBreadCrumbs(breadCrumbsData);
  }, [filterValues, type, alias]);

  return breadCrumbs;
};
