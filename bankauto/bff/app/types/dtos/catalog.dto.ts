import { ImageSizes } from '@marketplace/ui-kit/types/Image';
import { ImagesDTO } from './images.dto';
import {
  BodyTypeDTO,
  BrandDTO,
  ColorDTO,
  DriveDTO,
  EngineDTO,
  GenerationDTO,
  ModelDTO,
  NodeIdDTO,
  TransmissionDTO,
} from './node.dto';

export interface SeoDTO {
  seo_text_new: string | null;
  seo_text_used: string | null;
}

export interface VehicleMetaDTO {
  price_from: number;
  price_to: number | null;
  vehicles_count: number;
}

export type CatalogGenerationDTO = GenerationDTO &
  SeoDTO &
  VehicleMetaDTO &
  ImagesDTO & {
    _exterior_images: ImageSizes;
    body_type: BodyTypeDTO;
    available_for_new: 0 | 1;
  };
export type CatalogModelDTO = ModelDTO &
  SeoDTO &
  VehicleMetaDTO & {
    generations: CatalogGenerationDTO[];
  };
export type CatalogBrandDTO = BrandDTO &
  SeoDTO &
  VehicleMetaDTO & {
    models: CatalogModelDTO[];
  };

export interface CatalogBrandsShortDTO extends NodeIdDTO {
  alias: string;
  prise_from: string;
  vehicles_count: string;
}

export type FilterDataDeprecatedDTO = {
  brands: BrandDTO[];
  models: ModelDTO[];
  body_types: BodyTypeDTO[];
  transmissions: TransmissionDTO[];
  engines: EngineDTO[];
  drives: DriveDTO[];
  colors: ColorDTO[];
};

export type FilterDataDTO = {
  brands: BrandDTO[];
  models: ModelDTO[];
  generations: GenerationDTO[];
  bodies: BodyTypeDTO[];
  transmissions: TransmissionDTO[];
  engines: EngineDTO[];
  drives: DriveDTO[];
  colors: ColorDTO[];
  yearFrom: number;
  yearTo: number;
  priceFrom: number;
  priceTo: number;
  powerFrom: number;
  powerTo: number;
  volumeFrom: string;
  volumeTo: string;
  mileageFrom: number;
  mileageTo: number;
  installmentPayments: {
    [monthsCount: number]: { min: number; max: number };
  };
};
