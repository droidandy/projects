import { User, VEHICLE_SCENARIO } from '@marketplace/ui-kit/types';
import {
  VehicleFormData,
  VehicleFormSellValues,
  VehicleFormSellValuesMeeting,
  VehicleFormSellValuesProfile,
  VehicleFormValuesBase,
  VehicleFormValuesSell,
  VehicleFormValuesMedia,
  VehicleFormValuesOptions,
  VehicleFormSellValuesContacts,
  VehicleFormSellValuesAddress,
} from 'types/VehicleFormType';
import { getStore } from 'store/ssr';
import { AutostatData } from 'types/Autostat';
import {
  VehicleCreateAdvanced,
  VehicleCreateContacts,
  VehicleCreateImages,
  VehicleCreateParams,
  VehicleDrafContacts,
  VehicleDraft,
  VehicleDraftAdvanced,
  VehicleDraftData,
  VehicleOfferDraft,
  VehicleOfferDraftOptions,
  VehicleCallDraftAdvanced,
  VehicleCallDraft,
} from 'api/client/vehicle';
import { getCookieImpersonalization } from 'helpers/authCookies';
import { withoutCode } from 'helpers';

export const escapeDots = (str: string) => {
  const hasDots = str.includes('.');

  if (hasDots) return str.replaceAll('.', '_');

  return str;
};

type DataItem = {
  id: number;
  [key: string]: any;
};

export const getDataItem = <T extends DataItem>(arr: T[], targetId: number | string | null): T | undefined =>
  targetId ? arr.find(({ id }) => +id === +targetId) : undefined;

type DataOption = {
  value: any;
  [key: string]: any;
};

export const getDataOption = <T extends DataOption>(arr: T[], target: any): T | undefined =>
  target ? arr.find(({ value }) => value === target) : undefined;

export const mapVehicleToValues = (vehicle: Required<VehicleDraftData>): VehicleFormValuesBase => ({
  city: vehicle.cityId,
  brand: vehicle.brandId,
  model: vehicle.modelId,
  year: vehicle.productionYear,
  generation: vehicle.generationId,
  body: vehicle.bodyTypeId,
  transmission: vehicle.transmissionId,
  engine: vehicle.engineId,
  drive: vehicle.driveId,
  modification: null,
  condition: vehicle.condition,
  mileage: vehicle.mileage,
  vin: vehicle.vin,
  price: vehicle.price,
  color: vehicle.colorId,
  ownersNumber: vehicle.ownersNumber,
});

export const mapVehicleToValuesScenario = (scenario: VEHICLE_SCENARIO | null): { isC2B: boolean; isC2C: boolean } => {
  const scenariosStatusesMap = {
    [VEHICLE_SCENARIO.USED_AUCTION_AND_CLIENT]: { isC2B: true, isC2C: true },
    [VEHICLE_SCENARIO.USED_AUCTION]: { isC2B: true, isC2C: false },
    [VEHICLE_SCENARIO.USED_FROM_CLIENT]: { isC2B: false, isC2C: true },
  } as { [key in VEHICLE_SCENARIO]: { isC2B: boolean; isC2C: boolean } };
  return scenario ? scenariosStatusesMap[scenario] : { isC2B: false, isC2C: false };
};

export const mapVehicleToValuesMedia = (
  images: VehicleCreateImages | null,
  videoUrl: string | null,
): VehicleFormValuesMedia => ({
  videoUrl: videoUrl ? `https://www.youtube.com/watch?v=${videoUrl}` : null,
  imagesExterior: images?.exteriorImages.length ? images.exteriorImages.join(',') : null,
  imagesInterior: null,
  stsFront: images?.stsImages[0] ? images.stsImages[0] : null,
  stsBack: images?.stsImages[1] ? images.stsImages[1] : null,
});

export const mapVehicleToValuesOptions = (vehicleOptions: VehicleOfferDraftOptions[]): VehicleFormValuesOptions =>
  vehicleOptions.reduce((result, { id, subGroupId }) => {
    return { ...result, [`option-${subGroupId || id}`]: id };
  }, {} as VehicleFormValuesOptions);

export const parseVehicleValues = ({
  vehicle,
  images,
  options,
  stickersId,
}: VehicleOfferDraft): VehicleFormValuesSell => ({
  ...mapVehicleToValues(vehicle),
  ...mapVehicleToValuesMedia(images, vehicle.videoUrl),
  ...mapVehicleToValuesScenario(vehicle.scenario),
  ...mapVehicleToValuesOptions(options),
  stickers: stickersId || null,
  comment: vehicle.comment || null,
});

export const mapVehicleToValuesMeeting = (contacts: VehicleDrafContacts): VehicleFormSellValuesMeeting => ({
  meetFrom: contacts.timeFrom || 9,
  meetTo: contacts.timeTo || 21,
});

export const mapVehicleToValuesAddress = (contacts: VehicleDrafContacts): VehicleFormSellValuesAddress => {
  return {
    address:
      contacts.address && contacts.latitude && contacts.longitude
        ? { address: contacts.address, location: [contacts.latitude, contacts.longitude] }
        : null,
  };
};

export const mapUserToValuesProfile = (user: User): VehicleFormSellValuesProfile => ({
  phone: withoutCode(user.phone),
  email: user.email || null,
  firstName: user.firstName,
  lastName: user.lastName || null,
  middleName: user.patronymicName || null,
});

export const parseVehicleContacts = (
  user: User,
  contacts: VehicleDrafContacts,
  isAuthorized: boolean,
): VehicleFormSellValuesContacts => {
  return {
    ...mapUserToValuesProfile(user),
    ...mapVehicleToValuesMeeting(contacts),
    ...mapVehicleToValuesAddress(contacts),
    authSuccess: Number(isAuthorized),
  };
};

export const getInitialValues = (): VehicleFormSellValues => {
  const store = getStore();
  const {
    vehicleCreateSellValues: { values },
    user,
    city: { current: currentCity },
  } = store.getState();
  const initialValues: VehicleFormSellValues = { ...values };
  // fill user
  if (!values.authSuccess && user.isAuthorized && (user.firstName || getCookieImpersonalization())) {
    const contacts = mapUserToValuesProfile(user);
    Object.assign(initialValues, contacts, { authSuccess: 1 });
  }
  if (!initialValues.city) {
    Object.assign(initialValues, {
      // eslint-disable-next-line no-nested-ternary
      city: currentCity.id
        ? // Если выбраны Москва и МО или вся Россия, то Москва
          currentCity.id === 1 || currentCity.id === 2
          ? 17849
          : currentCity.id
        : null,
    });
  }
  return initialValues;
};

export const getMappedOptionsToArray = (values: VehicleFormValuesOptions): number[] | undefined => {
  // getting appropriate options from form values
  const options = Object.entries(values).filter(
    ([key, value]) => key.includes('option') && value && (Array.isArray(value) ? value.length : true),
  );

  const valuesArray = [];

  for (const [key, value] of options) {
    if (Array.isArray(value)) {
      const optionsIds = value.map((item: { label: string; value: number }) => item.value);
      valuesArray.push(...optionsIds);
      continue;
    }
    if (typeof value === 'boolean') {
      valuesArray.push(Number(key.replace('option-', '')));
      continue;
    }
    valuesArray.push(Number(value));
  }

  return valuesArray.length ? valuesArray : undefined;
};

const getScenario = (c2c: boolean, c2b: boolean): VEHICLE_SCENARIO | null => {
  const smap = [
    [true, true, VEHICLE_SCENARIO.USED_AUCTION_AND_CLIENT],
    [false, true, VEHICLE_SCENARIO.USED_AUCTION],
    [true, false, VEHICLE_SCENARIO.USED_FROM_CLIENT],
  ] as const;
  const res = smap.find(([c, b]) => c === c2c && b === c2b);
  return res ? res[2] : null;
};

const mapValuesToParamsAdvanced = (
  values: VehicleFormSellValues,
  extimatedCost: number,
): VehicleCreateAdvanced | VehicleDraftAdvanced | VehicleCallDraftAdvanced => ({
  scenario: getScenario(values.isC2C, values.isC2B),
  productionYear: values.year,
  price: values.price,
  estimatedCost: extimatedCost,
  mileage: values.mileage,
  condition: values.condition,
  ownersNumber: values.ownersNumber || 1,
  vin: values.vin || undefined,
  number: 'A000A000',
  comment: values.comment || undefined,
});

const mapValuesToParamsContacts = (values: VehicleFormSellValues): VehicleCreateContacts | VehicleDrafContacts => ({
  timeFrom: values.meetFrom || 9,
  timeTo: values.meetTo || 21,
  latitude: values.address?.location[0] || null,
  longitude: values.address?.location[1] || null,
  address: values.address?.address || 'неизвестен',
});

export const parseVehicleParams = (
  values: VehicleFormSellValues,
  data?: VehicleFormData,
  autostat?: AutostatData | null,
  id?: number | null,
): VehicleDraft | VehicleCreateParams | VehicleCallDraft => {
  const modification = data?.modification.find((mod) => mod.id === values.modification);
  return {
    vehicle: {
      ...mapValuesToParamsAdvanced(values, autostat?.priceAvg || autostat?.priceTradeIn || 0),
      id: values.id || id,
      cityId: values.city!,
      colorId: values.color,
      brandId: values.brand!,
      modelId: values.model!,
      generationId: values.generation,
      transmissionId: values.transmission,
      driveId: values.drive,
      bodyTypeId: values.body!,
      engineId: values.engine,
      videoUrl: values.videoUrl,
    },
    images: {
      exteriorImages: [...(values.imagesExterior?.split(',') || []), ...(values.imagesInterior?.split(',') || [])],
      stsImages: [values.stsFront, values.stsBack].filter<string>((i): i is string => !!i),
    },
    options: getMappedOptionsToArray(values),
    equipment: {
      avitoModificationId: modification?.id,
    },
    contacts: mapValuesToParamsContacts(values),
    user: {
      lastName: values.lastName || null,
      firstName: values.firstName!,
      patronymicName: values.middleName || null,
      email: values.email || null,
    },
    stickersId: values.stickers,
  };
};

export const getCreateParams = (
  values: VehicleFormSellValues,
  id?: number,
): VehicleCreateParams | VehicleDraft | VehicleCallDraft => {
  const { getState } = getStore();
  const {
    vehicleCreateData: { data },
    autostat: { data: autostatData },
  } = getState();
  return parseVehicleParams(values, data, autostatData, id);
};

export const getUpdateParams = getCreateParams;
