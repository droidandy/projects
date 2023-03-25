import { CreditInfo, StickerData } from '@marketplace/ui-kit/types';
import { APPLICATION_TYPE, SPECIAL_OFFER_ALIAS, VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types/Enum';
import { BrandNewDTO, CityNewDTO, ColorNewDTO, GenerationNewDTO, ModelNewDTO, NodeNewDTO } from './node.dto';
import { PhotoDTO, PhotoDTOShort } from './images.dto';

type CompanyDTONew = {
  name: string;
  officeAddress: string;
  logo: string;
};

type CompanyDTOShort = Omit<CompanyDTONew, 'logo'>;

export type GiftDTONew = {
  name: string;
  id: number;
};

export type VehicleGiftsDTONew = {
  gifts: GiftDTONew[];
};

type PtsTypeDTO = 'Оригинал' | 'Дубликат' | 'Электронный' | 'Не указан';

type VehicleDiscountsDTONew = {
  market: number;
  tradeIn: number;
  credit: number;

  kasko?: number;
  osago?: number;
  lap?: number;
};

type OptionGroupListDTONew = {
  [optionGroup: string]: string[];
};

export type VehicleBaseDTOShort = {
  id: number;
  mileage: number;
  vin: string;
  year: number;
  price: number;
  type: string;
  status: number;
  company: CompanyDTOShort | null;
  discounts: VehicleDiscountsDTONew;
  scenario: string;
  isBooked: number;
};

type ContactsDTONew = {
  latitude: number;
  longitude: number;
  address: string;
};

export type SpecialOfferDTO = {
  id: number;
  percent: number;
  name: string;
  link: string;
  alias?: SPECIAL_OFFER_ALIAS;
  vehicleType?: VEHICLE_TYPE_ID;
  applicationType: APPLICATION_TYPE | null;
  dealerDiscount: number;
};

export type VehicleBaseDTONew = Omit<VehicleBaseDTOShort, 'company'> & {
  options: OptionGroupListDTONew;
  ptsType: PtsTypeDTO;
  videoUrl: string | null;
  salesOfficeId: number;
  ownersNumber: number;
  company: CompanyDTONew | null;
  totalViews: number;
  date: number;
  comment: string | null;
  contacts: ContactsDTONew | null;
};

export type VehicleDataDTONew = {
  brand: BrandNewDTO;
  model: ModelNewDTO;
  generation: GenerationNewDTO;
  city: CityNewDTO;
  color: ColorNewDTO;
  engine: string;
  engineVolume: string;
  enginePower: number;
  body: string;
  equipment: string;
  equipmentNode: NodeNewDTO;
  drive: string;
  transmission: string;
  specialOffer: SpecialOfferDTO;
  stickers?: StickerData[] | null;
  creditInfo: CreditInfo;
};

export type PhotosDTONew = {
  photos: PhotoDTO[];
};

export type PhotosDTOShort = {
  photos: PhotoDTOShort[];
};
export type VehicleDraftDTO = {
  vehicle: {
    id: number | null;
    colorId: number | null;
    brandId: number | null;
    modelId: number | null;
    generationId: number | null;
    transmissionId: number | null;
    driveId: number | null;
    bodyTypeId: number | null;
    condition: number | null;
    cityId: number | null;
    productionYear: number | null;
    mileage: number | null;
    videoUrl: string | null;
    number: string | null;
    price: number | null;
    engineId: number | null;
    comment: string | null;
    ownersNumber: number | null;
    estimatedCost: number | null;
    vin: string | null;
    scenario: number | null;
    status: number | null;
  };
  equipment: {
    avitoModificationId: number | null;
  };
  contacts: {
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    timeFrom: number | null;
    timeTo: number | null;
  };
  images: {
    stsImages: string[] | null;
    exteriorImages: string[] | null;
  };
  options: string[] | null;
  user: {
    firstName: string | null;
    email: string | null;
  };
};

export type VehicleDTONew = VehicleBaseDTONew & PhotosDTONew & VehicleDataDTONew & VehicleGiftsDTONew;

export type VehicleDTOShort = VehicleBaseDTOShort & PhotosDTOShort & VehicleDataDTONew & VehicleGiftsDTONew;
