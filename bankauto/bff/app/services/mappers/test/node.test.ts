import {
  NodeDTOMock,
  GenerationDTOMock,
  ModelDTOMock,
  BrandDTOMock,
  EngineDTOMock,
  BodyTypeDTOMock,
  ColorDTOMock,
  DriveDTOMock,
  TransmissionDTOMock,
  EquipmentDTOMock,
  OfficeBaseDTOMock,
  CityDTOMock,
  CompanyDTOMock,
} from './mock/nodeDto.mock';
import {
  NodeMock,
  GenerationMock,
  ModelMock,
  BrandMock,
  BodyTypeMock,
  DriveMock,
  TransmissionMock,
  ColorMock,
  EngineMock,
  EquipmentMock,
  CityMock,
  OfficeBaseMock,
  CompanyMock,
} from './mock/node.mock';
import {
  BodyTypeMapper,
  BrandMapper,
  CityMapper,
  ColorMapper,
  CompanyMapper,
  DriveMapper,
  EngineMapper,
  EquipmentMapper,
  GenerationMapper,
  ModelMapper,
  NodeMapper,
  OfficeBaseMapper,
  TransmissionMapper,
} from '../../../services/mappers/node.mapper';

describe('Node', () => {
  it('Node Mapping', () => {
    const r = NodeMapper({}, NodeDTOMock);
    expect(r).toEqual(NodeMock);
  });
  it('Generation Mapping', () => {
    const r = GenerationMapper({}, GenerationDTOMock);
    expect(r).toEqual(GenerationMock);
  });
  it('Model Mapping', () => {
    const r = ModelMapper({}, ModelDTOMock);
    expect(r).toEqual(ModelMock);
  });
  it('Brand Mapping', () => {
    const r = BrandMapper({}, BrandDTOMock);
    expect(r).toEqual(BrandMock);
  });
  it('BodyType Mapping', () => {
    const r = BodyTypeMapper({}, BodyTypeDTOMock);
    expect(r).toEqual(BodyTypeMock);
  });
  it('Transmission Mapping', () => {
    const r = TransmissionMapper({}, TransmissionDTOMock);
    expect(r).toEqual(TransmissionMock);
  });
  it('Engine Mapping', () => {
    const r = EngineMapper({}, EngineDTOMock);
    expect(r).toEqual(EngineMock);
  });
  it('Drive Mapping', () => {
    const r = DriveMapper({}, DriveDTOMock);
    expect(r).toEqual(DriveMock);
  });
  it('Color Mapping', () => {
    const r = ColorMapper({}, ColorDTOMock);
    expect(r).toEqual(ColorMock);
  });
  it('Equipment Mapping', () => {
    const r = EquipmentMapper({}, EquipmentDTOMock);
    expect(r).toEqual(EquipmentMock);
  });
  it('Office Mapping', () => {
    const r = OfficeBaseMapper({}, OfficeBaseDTOMock);
    expect(r).toEqual(OfficeBaseMock);
  });
  it('City Mapping', () => {
    const r = CityMapper({}, CityDTOMock);
    expect(r).toEqual(CityMock);
  });
  it('Company Mapping', () => {
    const r = CompanyMapper({}, CompanyDTOMock);
    expect(r).toEqual(CompanyMock);
  });
});
