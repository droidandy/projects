import { VehicleFormDataOption } from 'types/VehicleFormType';
import {
  ReviewCreateFormValue,
  ReviewCreateFormDataDTO,
  ReviewCreateFormData,
  ReviewCreateFormDataParams,
} from 'types/Review';

const DataNodeMapper = (node: { id: number; name: string }): VehicleFormDataOption => ({
  label: node.name,
  value: node.id,
});

export const DataMapper = (values: ReviewCreateFormDataDTO): ReviewCreateFormData => ({
  brand: values.brands.map(DataNodeMapper),
  model: values.models.sort((a, b) => a.name.localeCompare(b.name)).map(DataNodeMapper),
  year: values.years.map((year) => ({ label: `${year}`, value: year })).reverse(),
  body: values.bodies,
  generation: values.generations,
  engine: values.engines,
  drive: values.drives,
  transmission: values.transmissions,
  modification: values.modifications,
  ownershipTerm: values.ownershipTerm.map(DataNodeMapper),
});

export const ValuesParamsMapper = (values: ReviewCreateFormValue): ReviewCreateFormDataParams => ({
  brandId: values.brand ? +values.brand : undefined,
  modelId: values.model ? +values.model : undefined,
  year: values.year ? +values.year : undefined,
  bodyTypeId: values.body ? +values.body : undefined,
  generationId: values.generation ? +values.generation : undefined,
  engineId: values.engine ? +values.engine : undefined,
  driveId: values.drive ? +values.drive : undefined,
  transmissionId: values.transmission ? +values.transmission : undefined,
  modificationId: values.modification ? +values.modification : undefined,
  ownershipTerm: values.ownershipTerm ? +values.ownershipTerm : undefined,
});
