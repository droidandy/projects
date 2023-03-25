import { VehicleNew } from '@marketplace/ui-kit/types';
import { NodeNewDTO } from 'types/dtos/node.dto';
import { PhotoDTO } from 'types/dtos/images.dto';

export type ComparisonIdsDTO = {
  new: number[] | null;
  used: number[] | null;
} | null;

type NodeDTO = {
  id: number;
  name: string;
};

export type OptionDTO = NodeDTO & {
  sort: number;
  options: NodeDTO[];
};

// Used DTOs
export type VehicleComparisonUsedDTO = Omit<VehicleNew, 'options' | 'photos' | 'engine'> & {
  options: OptionDTO[];
  photos: [PhotoDTO] | [];
  condition: string;
  engine: string;
  enginePower: number;
  engineVolume: number;
};

export type VehiclesComparisonUsedDTO = {
  vehicles: VehicleComparisonUsedDTO[];
  optionsMap: OptionDTO[];
};

// New DTOs
export type VehicleComparisonNewDTO = NodeDTO & {
  vehicleId: number; // offerId
  brand: NodeNewDTO;
  model: NodeNewDTO;
  generation: NodeNewDTO;
  bodyType: NodeNewDTO;
  engine: string;
  engineVolume: number;
  enginePower: number;
  drive: string;
  offersCount: number;
  transmission: string;
  body: string;
  acceleration: number;
  expenditure: number;
  trunkVolume: number;
  clearance: number;
  priceMin: number;
  weight: null;
  photosExterior: PhotoDTO[];
  photosInterior: PhotoDTO[];
};

export type VehiclesComparisonNewDTO = {
  vehicles: VehicleComparisonNewDTO[];
  optionsMap: OptionDTO[];
};
