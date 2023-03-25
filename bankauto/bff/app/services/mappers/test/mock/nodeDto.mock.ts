import {
  BodyTypeDTO,
  BrandDTO,
  CityDTO,
  ColorDTO,
  CompanyDTO,
  DriveDTO,
  EngineDTO,
  EquipmentDTO,
  GenerationDTO,
  ModelDTO,
  NodeDTO,
  NodeIdDTO,
  OfficeBaseDTO,
  TransmissionDTO,
} from '../../../../types/dtos/node.dto';

export const siteUrl = 'http://site.url';

export const NodeIdDTOMock: NodeIdDTO = {
  id: 1,
  name: 'node_name',
};

export const NodeDTOMock: NodeDTO = {
  ...NodeIdDTOMock,
  alias: 'node_alias',
  status: 'active',
};

export const GenerationDTOMock: GenerationDTO = {
  ...NodeDTOMock,
  model_id: 365,
  body_type_id: 1,
  vendor_name: null,
  year_start: 2017,
  year_end: null,
  trunk: 480,
  clearance: 160,
  length: 4400,
  width: 1740,
  youtube: '4uLMJNg9nbU',
};

export const ModelDTOMock: ModelDTO = {
  ...NodeDTOMock,
  brand_id: 1,
};

export const BrandDTOMock: BrandDTO = {
  ...NodeDTOMock,
  seo_text_new: null,
  seo_text_used: null,
  created_at: new Date().getDate(),
  updated_at: new Date().getDate(),
  site_url: siteUrl,
  configurator_url: null,
};

export const BodyTypeDTOMock: BodyTypeDTO = {
  ...NodeDTOMock,
};

export const TransmissionDTOMock: TransmissionDTO = {
  ...NodeDTOMock,
  code: 'code',
};

export const EngineDTOMock: EngineDTO = {
  ...NodeDTOMock,
  need_volume: 1,
  need_expenditure: 1,
};

export const DriveDTOMock: DriveDTO = {
  ...NodeDTOMock,
  code: 'code',
};

export const ColorDTOMock: ColorDTO = {
  ...NodeDTOMock,
  linked_color_id: 1,
  code: 'code',
};

export const EquipmentDTOMock: EquipmentDTO = {
  ...NodeDTOMock,
  drive_id: 1,
  transmission_id: 1,
  generation_id: 1,
  engine_id: 1,
  price: 1,
  power: 1,
  volume: '1',
  used: 0,
  acceleration: '1',
  expenditure: '1',
};

export const OfficeBaseDTOMock: OfficeBaseDTO = {
  ...NodeIdDTOMock,
  address: 'address',
  status: 1,
  is_deleted: 0,
};

export const CityDTOMock: CityDTO = {
  ...NodeIdDTOMock,
};

export const CompanyDTOMock: CompanyDTO = {
  ...NodeIdDTOMock,
  logo: null,
};
