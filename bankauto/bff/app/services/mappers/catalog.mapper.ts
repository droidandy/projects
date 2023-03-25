import {
  CatalogBrand,
  CatalogBrandsShort,
  CatalogGeneration,
  CatalogModel,
  CatalogNode,
  SeoOptions,
  VehiclesMeta,
} from '@marketplace/ui-kit/types/Catalog';
import { Brand, Generation, Model, NodeId } from '@marketplace/ui-kit/types/Node';
import { Images } from '@marketplace/ui-kit/types/Image';
import {
  CatalogBrandDTO,
  CatalogGenerationDTO,
  CatalogBrandsShortDTO,
  CatalogModelDTO,
  SeoDTO,
  VehicleMetaDTO,
} from '../../types/dtos/catalog.dto';
import { pipeMapper } from './utils';
import { ImagesMapper } from './image.mapper';
import { BodyTypeMapper, BrandMapper, GenerationMapper, ModelMapper, NodeIdMapper } from './node.mapper';

const SeoMapper = <T>(item: T, dto: SeoDTO): T & SeoOptions => {
  return {
    ...item,
    textNew: dto.seo_text_new || undefined,
    textUsed: dto.seo_text_used || undefined,
  };
};

const VehicleMetaMapper = <T>(item: T, dto: VehicleMetaDTO): T & VehiclesMeta => {
  return {
    ...item,
    priceFrom: dto.price_from,
    priceTo: dto.price_to || undefined,
    vehiclesCount: dto.vehicles_count,
  };
};

export const CatalogNodeMapper = <T>(item: T, dto: SeoDTO & VehicleMetaDTO): T & CatalogNode => {
  return {
    ...item,
    seo: SeoMapper({}, dto),
    meta: VehicleMetaMapper({}, dto),
  };
};

export const CatalogGenerationMapper = pipeMapper(
  GenerationMapper,
  ImagesMapper,
  CatalogNodeMapper,
  <T extends Generation & CatalogNode & Images>(item: T, dto: CatalogGenerationDTO): T & CatalogGeneration => ({
    ...item,
    // eslint-disable-next-line no-underscore-dangle
    imagesSized: dto._exterior_images ? [dto._exterior_images] : [],
    bodyType: BodyTypeMapper({}, dto.body_type),
    availableForNew: !!dto.available_for_new,
  }),
);

export const CatalogModelMapper = pipeMapper(
  ModelMapper,
  CatalogNodeMapper,
  <T extends Model & CatalogNode>(item: T, dto: CatalogModelDTO): T & CatalogModel => ({
    ...item,
    generations: dto.generations.map((i) => CatalogGenerationMapper({}, i, 'generation')),
  }),
);

export const CatalogBrandMapper = pipeMapper(
  BrandMapper,
  CatalogNodeMapper,
  <T extends Brand & CatalogNode>(item: T, dto: CatalogBrandDTO): T & CatalogBrand => ({
    ...item,
    models: dto.models.map((i) => CatalogModelMapper({}, i)),
  }),
);

export const CatalogBrandsShortMapper = pipeMapper(
  NodeIdMapper,
  <T extends NodeId>(item: T, dto: CatalogBrandsShortDTO): T & CatalogBrandsShort => {
    return {
      ...item,
      alias: dto.alias,
      priceFrom: +dto.prise_from,
      vehiclesCount: +dto.vehicles_count,
    };
  },
);
