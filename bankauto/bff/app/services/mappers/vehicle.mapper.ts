import {
  VehicleBase,
  VehicleCharacteristic,
  VehicleCharacteristics,
  VehicleCharacteristicsGroup,
  VehicleData,
  VehicleDiscounts,
  VehicleGifts,
  VehicleImages,
  VehicleImagesSized,
  VehicleOffice,
  VehicleOption,
  VehicleOptionBase,
  VehicleOptionGroup,
  VehicleOptions,
} from '@marketplace/ui-kit/types/Vehicle';
import {
  VEHICLE_CONDITION,
  VEHICLE_CUSTOM,
  VEHICLE_SCENARIO,
  VEHICLE_STATUS,
  VEHICLE_TYPE,
  VEHICLE_WHEEL,
} from '@marketplace/ui-kit/types/Enum';
import {
  VehicleBaseDTO,
  VehicleCharacteristicDTO,
  VehicleCharacteristicsDTO,
  VehicleCharacteristicsGroupDTO,
  VehicleContactsDTO,
  VehicleDataDTO,
  VehicleDiscountDTO,
  VehicleGiftsDTO,
  VehicleImagesDTO,
  VehicleImagesNewDTO,
  VehicleOfficeDTO,
  VehicleOptionBaseDTO,
  VehicleOptionDTO,
  VehicleOptionsDTO,
} from '../../types/dtos/vehicle.dto';
import { ImagesSizedDTO } from '../../types/dtos/images.dto';
import {
  BodyTypeMapper,
  BrandMapper,
  CityMapperNew,
  ColorMapper,
  DriveMapper,
  EngineMapper,
  EquipmentMapper,
  GenerationMapper,
  ModelMapper,
  TransmissionMapper,
} from './node.mapper';
import { pipeMapper } from './utils';
import { OfficeMapper } from './office.mapper';
import { VideoMapper } from './video.mapper';
import { WithVehicleContacts } from '../../types/vehicle';

export const VehicleDiscountsMapper = <T>(item: T, dto: VehicleDiscountDTO): T & VehicleDiscounts => ({
  ...item,
  market: dto.discount_market === null ? undefined : dto.discount_market,
  kasko: dto.discount_kasko === null ? undefined : dto.discount_kasko,
  osago: dto.discount_osago === null ? undefined : dto.discount_osago,
  tradeIn: dto.discount_tradein === null ? undefined : dto.discount_tradein,
  credit: dto.discount_credit === null ? undefined : dto.discount_credit,
  lap: dto.discount_lap === null ? undefined : dto.discount_lap,
});
const optionsSort = (a: VehicleOptionBase, b: VehicleOptionBase) => (a.sort >= b.sort ? -1 : 1);
const optionBaseMapper = (o: VehicleOptionBaseDTO): VehicleOptionBase => ({
  id: o.id,
  name: o.name,
  sort: o.sort,
  status: o.status,
});
const optionMapper = (o: VehicleOptionDTO): VehicleOption => ({
  ...optionBaseMapper(o),
  groupId: o.group_option_id,
  description: o.description || undefined,
});

const groupDefault: VehicleOptionBaseDTO = {
  id: 0,
  name: '',
  sort: 9,
  status: 'active',
};

const VehicleOptionsMapper = <T>(item: T, dto: VehicleOptionsDTO): T & VehicleOptions => {
  const groupsDTO = (dto.group_options || ([] as VehicleOptionBaseDTO[])).reduce(
    (s, i) => ({ ...s, [i.id]: i }),
    {} as Record<number, VehicleOptionBaseDTO>,
  );
  const groups: Record<number, VehicleOptionGroup> = {};
  (dto.options || ([] as VehicleOptionDTO[])).forEach((option) => {
    if (!groups[option.group_option_id]) {
      groups[option.group_option_id] = {
        ...(groupsDTO[option.group_option_id] || groupDefault),
        items: [],
      };
    }
    groups[option.group_option_id].items.push(optionMapper(option));
  });
  return {
    ...item,
    options: Object.keys(groups)
      .map((k) => groups[+k])
      .sort(optionsSort),
  };
};

const VehicleCharacteristicMapper = (dto: VehicleCharacteristicDTO): VehicleCharacteristic => ({
  id: dto.characteristic_id,
  name: dto.name,
  unit: dto.unit,
  value: dto.value,
});

const VehicleCharacteristicsGroupMapper = (dto: VehicleCharacteristicsGroupDTO): VehicleCharacteristicsGroup =>
  dto.reduce(
    (s, i) => ({
      ...s,
      [i.group]: s[i.group] ? [...s[i.group], VehicleCharacteristicMapper(i)] : [VehicleCharacteristicMapper(i)],
    }),
    {} as VehicleCharacteristicsGroup,
  );

const VehicleCharacteristicsMapper = <T>(item: T, dto: VehicleCharacteristicsDTO): T & VehicleCharacteristics => ({
  ...item,
  characteristics: dto.characteristics ? VehicleCharacteristicsGroupMapper(dto.characteristics) : {},
});

const VehicleOfficeMapper = <T>(item: T, dto: VehicleOfficeDTO): T & VehicleOffice => ({
  ...item,
  salesOffice: dto.sales_office ? OfficeMapper({}, dto.sales_office) : undefined,
});

export const VehicleBaseMapper = <T>(item: T, dto: VehicleBaseDTO & VehicleDiscountDTO): T & VehicleBase => ({
  ...item,
  id: dto.id,
  uuid: dto.uuid || undefined,
  type: dto.type === 0 ? VEHICLE_TYPE.NEW : VEHICLE_TYPE.USED,
  status: dto.status === null ? undefined : (dto.status as any as VEHICLE_STATUS),
  scenario: dto.scenario === null ? undefined : (dto.scenario as any as VEHICLE_SCENARIO),
  wheel: dto.wheel === null ? undefined : (dto.wheel as any as VEHICLE_WHEEL),
  condition: dto.condition === null ? undefined : (dto.condition as any as VEHICLE_CONDITION),
  custom: dto.custom === null ? undefined : (dto.custom as any as VEHICLE_CUSTOM),
  salesOfficeId: dto.sales_office_id,
  mileage: dto.mileage,
  passportAvailable: !!dto.passport_available,
  vin: dto.vin,
  guid: dto.guid,
  ownersNumber: dto.owners_number === null ? undefined : dto.owners_number,
  productionYear: dto.production_year,
  price: dto.price,
  discounts: VehicleDiscountsMapper({}, dto),
  brandId: dto.brand_id,
  modelId: dto.model_id,
  generationId: dto.generation_id,
  driveId: dto.drive_id,
  engineId: dto.engine_id,
  transmissionId: dto.transmission_id,
  bodyTypeId: dto.body_type_id,
  equipmentId: dto.equipment_id,
  colorId: dto.color_id,
  isDeleted: dto.is_deleted === null ? undefined : !!dto.is_deleted,
  isBooked: dto.is_booked === null ? undefined : !!dto.is_booked,
  bookingPrice: dto.booking_price,
  isWarranty: dto.is_warranty === null ? undefined : !!dto.is_warranty,
  isDealerService: dto.is_dealer_service === null ? undefined : !!dto.is_dealer_service,
  isDamaged: dto.is_damaged === null ? undefined : !!dto.is_damaged,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  publicationEnd: dto.publication_end || undefined,
  number: dto.number || undefined,
  pts: dto.pts || undefined,
  sts: dto.sts || undefined,
  comment: dto.comment || undefined,
  totalViews: dto.totalViews,
});

export const VehicleImagesMapper = <T>(item: T, dto: VehicleImagesDTO): T & VehicleImages => ({
  ...item,
  images: [...(dto.exterior_images || []), ...(dto.interior_images || [])],
  stsImages: dto.sts_images || [],
  exteriorImages: dto.exterior_images || [],
  interiorImages: dto.interior_images || [],
});
export const VehicleImagesNewMapper = <T>(item: T, dto: VehicleImagesNewDTO): T & VehicleImages => ({
  ...item,
  images: dto.exteriorImages || [],
  stsImages: dto.stsImages || [],
  exteriorImages: dto.exteriorImages || [],
  interiorImages: dto.exteriorImages || [],
});
export const VehicleImageSizedMapper = <T>(item: T, dto: ImagesSizedDTO): T & VehicleImagesSized => ({
  ...item,
  // eslint-disable-next-line no-underscore-dangle
  imagesSized: [...(dto._exterior_images || []), ...(dto._interior_images || [])],
  // eslint-disable-next-line no-underscore-dangle
  exteriorImagesSizes: dto._exterior_images || [],
  // eslint-disable-next-line no-underscore-dangle
  interiorImagesSizes: dto._interior_images || [],
});

export const VehicleGiftsMapper = <T>(item: T, dto: VehicleGiftsDTO): T & VehicleGifts => ({
  ...item,
  gifts: dto.gifts?.map((g) => ({ id: g.id, name: g.name })) || [],
});
export const VehicleGiftsNewMapper = <T>(item: T, dto: VehicleGiftsDTO): T & VehicleGifts => ({
  ...item,
  gifts: dto.gifts?.map((g) => ({ id: g.id, name: g.name })) || [],
});
const VehicleDataMapper = <T>(item: T, dto: VehicleDataDTO): T & VehicleData => {
  return {
    ...item,
    city: CityMapperNew({}, dto.city || {}),
    brand: BrandMapper({}, dto.brand || {}),
    model: ModelMapper({}, dto.model || {}),
    generation: GenerationMapper({}, dto.generation || {}),
    drive: DriveMapper({}, dto.drive || {}),
    engine: EngineMapper({}, dto.engine || {}),
    transmission: TransmissionMapper({}, dto.transmission || {}),
    bodyType: BodyTypeMapper({}, dto.body_type || {}),
    equipment: EquipmentMapper({}, dto.equipment || {}),
    color: ColorMapper({}, dto.color || {}),
    stickers: dto.stickers || null,
  };
};

export const VehicleMapper = pipeMapper(
  VehicleImagesMapper,
  VehicleImageSizedMapper,
  VideoMapper,
  VehicleGiftsMapper,
  VehicleOptionsMapper,
  VehicleCharacteristicsMapper,
  VehicleBaseMapper,
  VehicleDataMapper,
  VehicleOfficeMapper,
);
export const VehicleContactsMapper = <T>(
  item: T,
  { time_from, time_to, address, latitude, longitude }: VehicleContactsDTO,
): T & WithVehicleContacts => ({
  ...item,
  contacts: {
    timeFrom: time_from,
    timeTo: time_to,
    longitude,
    latitude,
    address,
  },
});

export const VehicleContactsMapperNew = <T>(
  item: T,
  { timeFrom, timeTo, address, latitude, longitude }: any,
): T & WithVehicleContacts => ({
  ...item,
  contacts: {
    timeFrom,
    timeTo,
    longitude,
    latitude,
    address,
  },
});
