import {
  CatalogBrandDTO,
  CatalogGenerationDTO,
  CatalogModelDTO,
  SeoDTO,
  VehicleMetaDTO,
} from '../../../../types/dtos/catalog.dto';
import { ImagesDTO } from '../../../../types/dtos/images.dto';
import { BodyTypeDTOMock, BrandDTOMock, GenerationDTOMock, ModelDTOMock } from './nodeDto.mock';

export const imageUrl = 'http://image.dir';
export const generatedId = 'generated_id';

export const SeoDTOMock: SeoDTO = {
  seo_text_new: 'seo text new',
  seo_text_used: 'seo text used',
};

export const VehicleMetaDTOMock: VehicleMetaDTO = {
  price_from: 1,
  price_to: 100,
  vehicles_count: 2,
};

export const ImagesDTOMock: ImagesDTO = {
  exterior_images: [imageUrl],
};

const imageSizedObject = {
  '335': imageUrl,
  '500': imageUrl,
  '1040': imageUrl,
  '1580': imageUrl,
  '1920': imageUrl,
};

export const CatalogGenerationDTOMock: CatalogGenerationDTO = {
  ...GenerationDTOMock,
  ...SeoDTOMock,
  ...VehicleMetaDTOMock,
  ...ImagesDTOMock,
  _exterior_images: imageSizedObject,
  body_type: BodyTypeDTOMock,
  available_for_new: 0,
};

export const CatalogModelDTOMock: CatalogModelDTO = {
  ...ModelDTOMock,
  ...SeoDTOMock,
  ...VehicleMetaDTOMock,
  generations: [CatalogGenerationDTOMock],
};

export const CatalogBrandDTOMock: CatalogBrandDTO = {
  ...BrandDTOMock,
  ...SeoDTOMock,
  ...VehicleMetaDTOMock,
  models: [CatalogModelDTOMock],
};
