import { StickerData } from '@marketplace/ui-kit/types';
import {
  GiftDTO,
  BodyTypeDTO,
  BrandDTO,
  ColorDTO,
  DriveDTO,
  EngineDTO,
  EquipmentDTO,
  GenerationDTO,
  ModelDTO,
  TransmissionDTO,
  BrandNewDTO,
  ModelNewDTO,
  GenerationNewDTO,
  ColorNewDTO,
  CityNewDTO,
} from './node.dto';
import { OfficeDTO } from './office.dto';
import { VideoDTO } from './video.dto';
import { ImagesSizedDTO, PhotoDTO } from './images.dto';

export interface VehicleDiscountDTO {
  discount_market: number | null;
  discount_credit: number | null;
  discount_tradein: number | null;
  discount_kasko: number | null;
  discount_osago: number | null;
  discount_lap: number | null;
}
export interface VehicleOptionBaseDTO {
  id: number;
  name: string;
  sort: number;
  status: string;
}

export interface VehicleOptionDTO extends VehicleOptionBaseDTO {
  brand_id: number;
  group_option_id: number;
  description?: string | null;
  created_at: number;
  updated_at: number;
}

export interface VehicleOptionsDTO {
  group_options?: VehicleOptionBaseDTO[];
  options?: VehicleOptionDTO[];
}

export interface VehicleCharacteristicDTO {
  characteristic_id: number;
  group: string;
  name: string;
  unit: string;
  value: string;
}

export type VehicleCharacteristicsGroupDTO = VehicleCharacteristicDTO[];

export type VehicleCharacteristicsDTO = {
  characteristics: VehicleCharacteristicsGroupDTO;
};

export interface VehicleGiftsDTO {
  gifts: GiftDTO[];
}

export interface VehicleOfficeDTO {
  sales_office: OfficeDTO | null;
}

export interface VehicleOfficesDTO {
  sales_office: OfficeDTO[];
}

export interface VehicleImagesDTO {
  sts_images?: string[] | null;
  interior_images?: string[] | null;
  exterior_images?: string[] | null;
}

export interface VehicleImagesNewDTO {
  stsImages: string[] | null;
  exteriorImages: string[] | null;
}

export interface VehicleBaseDTO {
  id: number;
  uuid: string | null;
  sales_office_id: number;
  brand_id: number;
  model_id: number;
  generation_id: number;
  drive_id: number;
  engine_id: number;
  transmission_id: number;
  body_type_id: number;
  avatar_id: number;
  equipment_id: number;
  color_id: number;
  production_year: number;
  mileage: number;
  passport_available: number;
  vin: string;
  sts: string | null;
  pts: string | null;
  guid: string;
  created_at: number;
  updated_at: number;
  started_at: number;
  publication_end?: number;
  type: number;
  status: number;
  price: number;
  scenario: string | null;
  condition: string | null;
  wheel: number | null;
  custom: number | null;
  is_deleted: 0 | 1 | null;
  is_booked: 0 | 1 | null;
  booking_price: number;
  is_warranty: 0 | 1 | null;
  is_dealer_service: 0 | 1 | null;
  is_damaged: 0 | 1 | null;
  number: string | null;
  owners_number: number | null;
  comment: string | null;
  totalViews?: number;
}

export interface VehicleDataDTO {
  brand: BrandDTO;
  model: ModelDTO;
  generation: GenerationDTO;
  city: CityNewDTO;
  drive: DriveDTO;
  engine: EngineDTO;
  transmission: TransmissionDTO;
  body_type: BodyTypeDTO;
  equipment: EquipmentDTO;
  color: ColorDTO;
  stickers?: StickerData[] | null;
}

export interface VehicleDTO
  extends VideoDTO,
    VehicleImagesDTO,
    ImagesSizedDTO,
    VehicleOptionsDTO,
    VehicleDiscountDTO,
    VehicleGiftsDTO,
    VehicleCharacteristicsDTO,
    VehicleOfficeDTO,
    VehicleBaseDTO,
    VehicleDataDTO {}

export type VehicleContactsDTO = {
  time_from?: number;
  time_to?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
};

export type VehicleWithContactsDTO = {
  vehicle: VehicleDTO;
  contacts: VehicleContactsDTO;
};

/* --- Old Short Vehicle --- */
export interface OldShortCompanyDTO {
  name: string;
  address: string;
  logo?: string;
}

export interface OldShortGiftDTO {
  name: string;
  id: number;
}

export interface OldShortVehicleGiftsDTO {
  gifts?: OldShortGiftDTO[];
}

export interface OldShortVehicleDiscountsDTO {
  market: number;
  tradeIn: number;
  credit: number;

  kasko?: number;
  osago?: number;
  lap?: number;
}

export interface OldShortVehicleBaseDTO {
  id: number;
  mileage: number;
  vin: string;
  year: number;
  price: number;
  type: string;
  status: number;
  company: OldShortCompanyDTO;
  discounts: OldShortVehicleDiscountsDTO; // not in swagger but is present in the actual response (???)
  salesOfficeId: number;
  scenario: string;
}

export interface OldShortVehicleDataDTO {
  brand: BrandNewDTO;
  model: ModelNewDTO;
  generation: GenerationNewDTO;
  color: ColorNewDTO;
  engine: string;
  engineVolume: string;
  enginePower: number;
  body: string;
  equipment: string;
  drive: string;
  transmission: string;
}

export interface OldShortPhotosDTO {
  photos: PhotoDTO[];
}

export interface OldShortVehicleDTO
  extends OldShortVehicleBaseDTO,
    OldShortVehicleDataDTO,
    OldShortPhotosDTO,
    OldShortVehicleGiftsDTO {}
