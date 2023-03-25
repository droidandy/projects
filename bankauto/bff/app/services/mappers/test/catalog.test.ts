import shortId from 'shortid';
import {
  CatalogGenerationDTOMock,
  CatalogModelDTOMock,
  CatalogBrandDTOMock,
  SeoDTOMock,
  VehicleMetaDTOMock,
  ImagesDTOMock,
  generatedId,
} from './mock/catalogDto.mock';
import {
  CatalogNodeMock,
  CatalogGenerationMock,
  CatalogModelMock,
  CatalogBrandMock,
  ImagesMock,
} from './mock/catalog.mock';
import { CatalogBrandMapper, CatalogGenerationMapper, CatalogModelMapper, CatalogNodeMapper } from '../catalog.mapper';
import { ImagesMapper } from '../image.mapper';

describe('Catalog', () => {
  jest.spyOn(shortId, 'generate').mockImplementation(() => generatedId);

  it('Catalog Node Mapping', () => {
    const r = CatalogNodeMapper({}, { ...SeoDTOMock, ...VehicleMetaDTOMock });
    expect(r).toEqual(CatalogNodeMock);
  });
  it('Images Mapping', () => {
    const r = ImagesMapper({}, ImagesDTOMock);
    expect(r).toEqual(ImagesMock);
  });
  it('Catalog Generation Mapping', () => {
    const r = CatalogGenerationMapper({}, CatalogGenerationDTOMock);
    expect(r).toEqual(CatalogGenerationMock);
  });
  it('Catalog Model Mapping', () => {
    const r = CatalogModelMapper({}, CatalogModelDTOMock);
    expect(r).toEqual(CatalogModelMock);
  });
  it('Catalog Brand Mapping', () => {
    const r = CatalogBrandMapper({}, CatalogBrandDTOMock);
    expect(r).toEqual(CatalogBrandMock);
  });
});
