import {
  BodyType,
  Brand,
  City,
  CityNew,
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
import {
  NodeDTO,
  BodyTypeDTO,
  BrandDTO,
  ColorDTO,
  DriveDTO,
  EngineDTO,
  EquipmentDTO,
  GenerationDTO,
  ModelDTO,
  TransmissionDTO,
  OfficeBaseDTO,
  CityDTO,
  CompanyDTO,
  NodeIdDTO,
  CityNewDTO,
} from '../../types/dtos/node.dto';
import { pipeMapper } from './utils';

export const NodeIdMapper = <T>(item: T, { id, name, name_rus: nameRus }: NodeIdDTO): T & NodeId => {
  return {
    ...item,
    id,
    name,
    nameRus,
  };
};

export const NodeMapper = pipeMapper(NodeIdMapper, <T extends NodeId>(item: T, dto: NodeDTO): T & Node => {
  return {
    ...item,
    name: dto.name_rus || item.name,
    status: dto.status,
    alias: dto.alias || undefined,
  };
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const BodyTypeMapper = pipeMapper(NodeMapper, <T extends Node>(item: T, dto: BodyTypeDTO): T & BodyType => {
  return {
    ...item,
    id: Number(dto.id),
  };
});

export const GenerationMapper = pipeMapper(
  NodeMapper,
  <T extends Node>(item: T, dto: GenerationDTO): T & Generation => {
    return {
      ...item,
      name: dto.name,
      modelId: dto.model_id,
      bodyTypeId: dto.body_type_id,
      yearStart: dto.year_start,
      yearEnd: dto.year_end !== null ? dto.year_end : undefined,
      vendorName: dto.vendor_name !== null ? dto.vendor_name : undefined,
      trunk: dto.trunk !== null ? dto.trunk : undefined,
      clearance: dto.clearance !== null ? dto.clearance : undefined,
      length: dto.length !== null ? dto.length : undefined,
      width: dto.width !== null ? dto.width : undefined,
      youtube: dto.youtube !== null ? dto.youtube : undefined,
    };
  },
);

export const ModelMapper = pipeMapper(NodeMapper, <T extends Node>(item: T, dto: ModelDTO): T & Model => {
  return {
    ...item,
    name: dto.name,
    brandId: dto.brand_id,
    bankApiId: dto.bank_api_id ?? undefined,
  };
});

export const BrandMapper = pipeMapper(NodeMapper, <T extends Node>(item: T, dto: BrandDTO): T & Brand => {
  return {
    ...item,
    name: dto.name,
    siteUrl: dto.site_url || undefined,
    configuratorUrl: dto.configurator_url || undefined,
  };
});
export const CityMapperNew = <T>(item: T, dto: CityNewDTO): T & CityNew => ({
  ...item,
  ...dto,
});
export const TransmissionMapper = pipeMapper(
  NodeMapper,
  <T extends Node>(item: T, dto: TransmissionDTO): T & Transmission => {
    return {
      ...item,
      code: dto.code,
      id: Number(dto.id),
    };
  },
);

export const EngineMapper = pipeMapper(NodeMapper, <T extends Node>(item: T, dto: EngineDTO): T & Engine => {
  return {
    ...item,
    needVolume: dto.need_volume,
    needExpenditure: dto.need_expenditure,
    id: Number(dto.id),
  };
});

export const DriveMapper = pipeMapper(NodeMapper, <T extends Node>(item: T, dto: DriveDTO): T & Drive => {
  return {
    ...item,
    code: dto.code,
    id: Number(dto.id),
  };
});

export const ColorMapper = pipeMapper(NodeMapper, <T extends Node>(item: T, dto: ColorDTO): T & Color => {
  return {
    ...item,
    linkedColorId: dto.linked_color_id || undefined,
    code: dto.code,
    id: Number(dto.id),
  };
});

export const EquipmentMapper = pipeMapper(NodeMapper, <T extends Node>(item: T, dto: EquipmentDTO): T & Equipment => {
  return {
    ...item,
    driveId: dto.drive_id,
    transmissionId: dto.transmission_id,
    generationId: dto.generation_id,
    engineId: dto.engine_id,
    price: dto.price,
    power: dto.power,
    volume: dto.volume,
    used: dto.used,
    acceleration: dto.acceleration,
    expenditure: dto.expenditure,
    id: Number(dto.id),
  };
});

export const OfficeBaseMapper = pipeMapper(
  NodeIdMapper,
  <T extends NodeId>(item: T, { address, status, is_deleted: isDeleted }: OfficeBaseDTO): T & OfficeBase => {
    return {
      ...item,
      address,
      isActive: Boolean(status),
      isDeleted: Boolean(isDeleted),
    };
  },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CityMapper = pipeMapper(NodeIdMapper, <T extends NodeId>(item: T, dto: CityDTO): T & City => {
  return {
    ...item,
  };
});

export const CompanyMapper = pipeMapper(
  NodeIdMapper,
  <T extends NodeId>(item: T, { logo }: CompanyDTO): T & Company => {
    return {
      ...item,
      logo,
    };
  },
);
