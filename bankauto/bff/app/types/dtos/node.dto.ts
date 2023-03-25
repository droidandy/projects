export interface NodeIdDTO {
  id: number;
  name: string;
  name_rus?: string;
}

export interface NodeDTO extends NodeIdDTO {
  alias?: string | null;
  status: string;
}

/* --- Vehicle --- */

export interface GiftDTO {
  name: string;
  id: number;
}

export interface GenerationDTO extends NodeDTO {
  model_id: number;
  body_type_id: number;
  year_start: number;
  year_end?: number | null;
  vendor_name?: string | null;
  trunk?: number | null;
  clearance?: number | null;
  length?: number | null;
  width?: number | null;
  youtube?: string | null;
}

export interface ModelDTO extends NodeDTO {
  brand_id: number;
  bank_api_id?: number;
}

export interface BrandDTO extends NodeDTO {
  seo_text_new: string | null;
  seo_text_used: string | null;
  created_at: number;
  updated_at: number;
  site_url?: string | null;
  configurator_url?: string | null;
}

export interface BodyTypeDTO extends NodeDTO {
  code?: string | null;
}

export interface TransmissionDTO extends NodeDTO {
  code: string;
}

export interface EngineDTO extends NodeDTO {
  need_volume: number;
  need_expenditure: number;
}

export interface DriveDTO extends NodeDTO {
  code: string;
}

export interface ColorDTO extends NodeDTO {
  linked_color_id?: number;
  code: string;
}

export interface EquipmentDTO extends NodeDTO {
  drive_id: number;
  transmission_id: number;
  generation_id: number;
  engine_id: number;
  price: number | null;
  power: number;
  volume: string;
  used: 0 | 1;
  acceleration: string;
  expenditure: string;
}

/* --- Office --- */
export interface OfficeBaseDTO extends NodeIdDTO {
  address: string;
  status: 0 | 1;
  is_deleted: 0 | 1;
}

export interface CityDTO extends NodeIdDTO {}

export interface CompanyDTO extends NodeIdDTO {
  logo: string | null;
}

/* --- Vehicle New  --- */
export interface NodeNewDTO {
  id: number;
  name: string;
  alias: string;
}

export interface BrandNewDTO extends NodeNewDTO {}
export interface ModelNewDTO extends NodeNewDTO {}
export interface GenerationNewDTO extends NodeNewDTO {}
export interface CityNewDTO extends NodeNewDTO {}
export interface ColorNewDTO {
  name: string;
  code: string;
}
