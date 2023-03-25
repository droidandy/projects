import API, { CancellableAxiosPromise } from 'api/request';
import { Vehicle } from '@marketplace/ui-kit/types';
import { VehicleCreateParams } from 'types/VehicleCreate';
import { SellCreateFormValues } from 'types/SellCreate';

const preparePayloadCreate = (params: VehicleCreateParams, values: SellCreateFormValues) => ({
  uuid: params.uuid,
  type: params.typeId,
  scenario: params.scenario,
  city: `${values.city}`,
  phone: values.phone,
  number: values.series,
  vin: values.vin,
  price: values.price,
  brand: values.brand && `${values.brand.value}`,
  model: values.model && `${values.model?.value}`,
  generation: values.generation && `${values.generation?.value}`,
  body: `${values.body}`,
  engine: `${values.engine}`,
  transmission: `${values.transmission}`,
  drive: `${values.drive}`,
  color: `${values.color}`,
  engine_volume: values.volume && `${values.volume?.value}`,
  engine_hp: values.power,
  condition: values.condition,
  production_year: values.year?.value,
  mileage: values.mileage,
  comment: values.comment,
  owners_number: values.ownersNumber,
  images_url: [...(values.imagesExterior || []), ...(values.imagesInterior || [])].join(','),
  sts_url: [...(values.stsFront || []), ...(values.stsBack || [])].join(','),
  video_url: values.video,
});

export const createClientVehicle = (
  params: VehicleCreateParams,
  values: SellCreateFormValues,
): CancellableAxiosPromise<any & { vehicle: Vehicle }> => {
  return API.post('/client/vehicle/create', preparePayloadCreate(params, values), {
    authRequired: true,
  });
};

const preparePayloadUpdate = (id: string, params: VehicleCreateParams, values: SellCreateFormValues) => ({
  id,
  uuid: params.uuid,
  type: params.typeId,
  scenario: params.scenario,
  phone: values.phone,
  vin: values.vin,
  color_id: values.color,
  brand_id: values.brand?.value,
  model_id: values.model?.value,
  generation_id: values.generation?.value,
  transmission_id: values.transmission,
  drive_id: values.drive,
  body_type_id: values.body,
  engine_id: values.engine,
  production_year: values.year?.value,
  mileage: values.mileage,
  number: values.series,
  price: values.price,
  condition: values.condition,
  city_id: 17849, //не тот формат
  video_url: values.video,
  comment: values.comment, //нет поля
  owners_number: values.ownersNumber && +values.ownersNumber, //нет поля
  sts_images: [...(values.stsFront || []), ...(values.stsBack || [])],
  exterior_images: values.imagesExterior || [],
  equipment: {
    power: values.power,
    volume: Number(values.volume?.value),
  },
});

export const updateClientVehicle = (
  id: string,
  params: VehicleCreateParams,
  values: SellCreateFormValues,
): CancellableAxiosPromise<any & { vehicle: Vehicle }> => {
  return API.put(`/client/vehicle/update/${id}`, preparePayloadUpdate(id, params, values), {
    authRequired: true,
  });
};
