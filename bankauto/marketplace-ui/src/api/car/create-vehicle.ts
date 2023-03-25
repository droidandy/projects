import API, { CancellableAxiosPromise } from 'api/request';
import { Vehicle } from '@marketplace/ui-kit/types';
import { VehicleCreateParams, VehicleCreateFormValues } from 'types/VehicleCreate';

type CreateVehicleValues = VehicleCreateFormValues & { vin: string | null };

function createVehicle(
  params: VehicleCreateParams,
  values: CreateVehicleValues,
): CancellableAxiosPromise<any & { vehicle: Vehicle }> {
  return API.post(
    '/vehicle/create',
    {
      price: values.price,
      uuid: params.uuid,
      type: params.typeId,
      scenario: params.scenario,
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
      vin: values.vin,
      production_year: values.year?.value,
      mileage: values.mileage,
    },
    {
      authRequired: true,
    },
  );
}

export { createVehicle };
