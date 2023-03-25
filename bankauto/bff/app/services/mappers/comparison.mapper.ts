import { ComparisonIds, VehicleComparisonNew, VehicleComparisonUsed } from '@marketplace/ui-kit/types';
import { ComparisonIdsDTO, VehicleComparisonNewDTO, VehicleComparisonUsedDTO } from 'types/dtos/comparison.dto';

export const ComparisonIdsMapper = (dto: ComparisonIdsDTO): ComparisonIds => ({
  new: dto?.new || [],
  used: dto?.used || [],
});

export const VehicleComparisonNewMapper = ({
  engine,
  enginePower,
  engineVolume,
  ...restDTO
}: VehicleComparisonNewDTO): VehicleComparisonNew => ({
  ...restDTO,
  engine: {
    engine,
    enginePower,
    engineVolume: `${engineVolume}`,
  },
});

export const VehicleComparisonUsedMapper = ({
  engine,
  enginePower,
  engineVolume,
  ...restDTO
}: VehicleComparisonUsedDTO): VehicleComparisonUsed => ({
  ...restDTO,
  engine: {
    engine,
    enginePower,
    engineVolume: `${engineVolume}`,
  },
});
