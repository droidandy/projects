import { CreateVehicleDataDTO } from 'api/catalog/createData';
import {
  VehicleFormDataOption,
  VehicleFormDataNode,
  VehicleFormData,
  VehicleFormDataParams,
  VehicleFormValuesBase,
} from 'types/VehicleFormType';

const DataNodeMapper = (node: { id: number; name: string }): VehicleFormDataOption => ({
  label: node.name,
  value: node.id,
});

export const DataMapper = (values: CreateVehicleDataDTO): VehicleFormData => ({
  city: values.cities.map(DataNodeMapper),
  brand: values.brands.map(DataNodeMapper),
  model: values.models.sort((a, b) => a.name.localeCompare(b.name)).map(DataNodeMapper),
  year: values.years.map((year) => ({ label: `${year}`, value: year })).reverse(),
  body: values.bodies,
  generation: values.generations,
  engine: values.engines,
  drive: values.drives,
  transmission: values.transmissions,
  modification: values.modifications,
  color: values.colors,
});

export const ValuesParamsMapper = (values: VehicleFormValuesBase): VehicleFormDataParams => ({
  brandId: values.brand ? +values.brand : undefined,
  modelId: values.model ? +values.model : undefined,
  year: values.year ? +values.year : undefined,
  bodyTypeId: values.body ? +values.body : undefined,
  generationId: values.generation ? +values.generation : undefined,
  engineId: values.engine ? +values.engine : undefined,
  driveId: values.drive ? +values.drive : undefined,
  transmissionId: values.transmission ? +values.transmission : undefined,
});

export const DataParamsMap: { [K in keyof VehicleFormDataParams]: (item: any) => VehicleFormDataParams[K] } = {
  brandId: (item: VehicleFormDataOption) => item.value,
  modelId: (item: VehicleFormDataOption) => item.value,
  year: (item: VehicleFormDataOption) => item.value,
  bodyTypeId: (item: VehicleFormDataNode) => item.id,
  generationId: (item: VehicleFormDataNode) => item.id,
  engineId: (item: VehicleFormDataNode) => item.id,
  driveId: (item: VehicleFormDataNode) => item.id,
  transmissionId: (item: VehicleFormDataNode) => item.id,
};
