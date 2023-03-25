import {
  CatalogBrand,
  CatalogGeneration,
  CatalogModel,
  CatalogNode,
  SeoOptions,
  VehiclesMeta,
} from '@marketplace/ui-kit/types/Catalog';
import { Images } from '@marketplace/ui-kit/types/Image';
import { BodyTypeMock, BrandMock, GenerationMock, ModelMock } from './node.mock';
import { imageUrl } from './catalogDto.mock';

export const VehicleMetaMock: VehiclesMeta = {
  priceFrom: 1,
  priceTo: 100,
  vehiclesCount: 2,
};
export const SeoOptionsMock: SeoOptions = {
  textNew: 'seo text new',
  textUsed: 'seo text used',
};
export const CatalogNodeMock: CatalogNode = {
  meta: VehicleMetaMock,
  seo: SeoOptionsMock,
};
export const ImagesMock: Images = {
  images: [imageUrl],
};
const imageSizedObject = {
  '335': imageUrl,
  '500': imageUrl,
  '1040': imageUrl,
  '1580': imageUrl,
  '1920': imageUrl,
};

export const CatalogGenerationMock: CatalogGeneration = {
  ...GenerationMock,
  ...CatalogNodeMock,
  ...ImagesMock,
  imagesSized: [imageSizedObject],
  bodyType: BodyTypeMock,
  availableForNew: false,
};
export const CatalogModelMock: CatalogModel = {
  ...ModelMock,
  ...CatalogNodeMock,
  generations: [CatalogGenerationMock],
};
export const CatalogBrandMock: CatalogBrand = {
  ...BrandMock,
  ...CatalogNodeMock,
  models: [CatalogModelMock],
};
