import { VEHICLE_SCENARIO, VEHICLE_TYPE } from '@marketplace/ui-kit/types/Enum';
import {
  VehicleBaseNew,
  VehicleDataNew,
  VehicleGiftsNew,
  PhotosNew,
  VehicleBaseShort,
  PhotosShort,
} from '@marketplace/ui-kit/types/NewVehicle';
import {
  PhotosDTONew,
  VehicleBaseDTONew,
  VehicleDataDTONew,
  VehicleGiftsDTONew,
  VehicleBaseDTOShort,
  PhotosDTOShort,
} from 'types/dtos/newVehicle.dto';
import { pipeMapper } from './utils';

export const VehicleBaseMapperShort = <T>(
  item: T,
  { type, scenario, ...restDTOFields }: VehicleBaseDTOShort,
): T & VehicleBaseShort => ({
  ...item,
  ...restDTOFields,
  bookingPrice: 0,
  scenario: scenario as VEHICLE_SCENARIO,
  type: type === 'new' ? VEHICLE_TYPE.NEW : VEHICLE_TYPE.USED,
});

export const VehicleBaseMapperNew = <T>(
  item: T,
  { type, scenario, ...restDTOFields }: VehicleBaseDTONew,
): T & VehicleBaseNew => ({
  ...item,
  ...restDTOFields,
  bookingPrice: 0,
  scenario: scenario as VEHICLE_SCENARIO,
  type: type === 'new' ? VEHICLE_TYPE.NEW : VEHICLE_TYPE.USED,
});

export const VehicleDataMapperNew = <T>(
  item: T,
  { engine, engineVolume, enginePower, ...restDTOFields }: VehicleDataDTONew,
): T & VehicleDataNew => ({
  ...item,
  ...restDTOFields,
  engine: {
    engine,
    engineVolume,
    enginePower,
  },
});

export const VehicleGiftsMapperNew = <T>(item: T, dto: VehicleGiftsDTONew): T & VehicleGiftsNew => ({
  ...item,
  ...dto,
});

export const VehiclePhotosMapperNew = <T>(item: T, dto: PhotosDTONew): T & PhotosNew => ({
  ...item,
  ...dto,
});

export const VehiclePhotosMapperShort = <T>(item: T, dto: PhotosDTOShort): T & PhotosShort => ({
  ...item,
  ...dto,
});

export const VehicleMapperNew = pipeMapper(
  VehicleBaseMapperNew,
  VehiclePhotosMapperNew,
  VehicleGiftsMapperNew,
  VehicleDataMapperNew,
);

export const VehicleMapperShort = pipeMapper(
  VehicleBaseMapperShort,
  VehiclePhotosMapperShort,
  VehicleGiftsMapperNew,
  VehicleDataMapperNew,
);
