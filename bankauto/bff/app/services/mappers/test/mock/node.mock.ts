import {
  BodyType,
  Brand,
  City,
  Color,
  Company,
  Drive,
  Engine,
  Equipment,
  Generation,
  Model,
  Node,
  NodeId,
  OfficeBase,
  Transmission,
} from '@marketplace/ui-kit/types/Node';
import { siteUrl } from './nodeDto.mock';

export const NodeIdMock: NodeId = {
  id: 1,
  name: 'node_name',
  nameRus: undefined,
};

export const NodeMock: Node = {
  ...NodeIdMock,
  alias: 'node_alias',
  status: 'active',
};

export const GenerationMock: Generation = {
  ...NodeMock,
  bodyTypeId: 1,
  clearance: 160,
  length: 4400,
  modelId: 365,
  trunk: 480,
  vendorName: undefined,
  width: 1740,
  yearEnd: undefined,
  yearStart: 2017,
  youtube: '4uLMJNg9nbU',
};

export const ModelMock: Model = {
  ...NodeMock,
  brandId: 1,
};

export const BrandMock: Brand = {
  ...NodeMock,
  siteUrl,
  configuratorUrl: undefined,
};

export const BodyTypeMock: BodyType = {
  ...NodeMock,
};

export const TransmissionMock: Transmission = {
  ...NodeMock,
  code: 'code',
};

export const EngineMock: Engine = {
  ...NodeMock,
  needVolume: 1,
  needExpenditure: 1,
};

export const DriveMock: Drive = {
  ...NodeMock,
  code: 'code',
};

export const ColorMock: Color = {
  ...NodeMock,
  linkedColorId: 1,
  code: 'code',
};

export const EquipmentMock: Equipment = {
  ...NodeMock,
  driveId: 1,
  transmissionId: 1,
  generationId: 1,
  engineId: 1,
  price: 1,
  power: 1,
  volume: '1',
  used: 0,
  acceleration: '1',
  expenditure: '1',
};

export const OfficeBaseMock: OfficeBase = {
  ...NodeIdMock,
  isActive: true,
  address: 'address',
  isDeleted: false,
};

export const CityMock: City = {
  ...NodeIdMock,
};

export const CompanyMock: Company = {
  ...NodeIdMock,
  logo: null,
};
