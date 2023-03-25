import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { AutocompleteOption } from '@marketplace/ui-kit/components/Autocomplete';
import { VEHICLE_CONDITION, VEHICLE_SCENARIO } from '@marketplace/ui-kit/types';
import { getVehicleCreateData, getVehicleCreateOptions, getVehicleEditData } from 'api/catalog';
import { createTradeInVehicle } from 'api/client';
import { initialState } from 'store/initial-state';
import { AsyncAction } from 'types/AsyncAction';
import {
  CreateVehicleContacts,
  CreateVehicleData,
  CreateVehicleDataDTO,
  CreateVehicleDataParams,
  CreateVehicleValues,
} from 'types/VehicleCreateNew';
import { VehicleCreateParams } from 'types/VehicleCreate';
import { createClientVehicle, createClientVehicleExt, CreateClientVehicleParams } from 'api/client/vehicles';
import { VehicleCreateState } from 'store/types';
import { colors } from './mockData';
import { actions } from './reducers';
import { VehicleWithContacts } from 'types/Vehicle';

const DataNodeMapper = (node: { name: string; id: string | number }): AutocompleteOption => ({
  label: node.name,
  value: node.id,
});

const DataMapper = (data: CreateVehicleDataDTO): CreateVehicleData => ({
  brands: data.brands.map(DataNodeMapper),
  models: data.models.sort((a, b) => a.name.localeCompare(b.name)).map(DataNodeMapper),
  years: data.years.map((year) => ({ label: `${year}`, value: `${year}` })).reverse(),
  cities: data.cities.sort((a, b) => a.name.localeCompare(b.name)).map(DataNodeMapper),
  colors,
  conditions: data.modifications.length
    ? [
        { label: 'Отличное', value: VEHICLE_CONDITION.GREAT },
        { label: 'Хорошее', value: VEHICLE_CONDITION.GOOD },
        { label: 'Среднее', value: VEHICLE_CONDITION.MIDDLE },
        { label: 'Требуется ремонт', value: VEHICLE_CONDITION.REPAIR_REQUIRED },
      ]
    : [],
  ...pick(data, ['generations', 'bodies', 'transmissions', 'engines', 'drives', 'modifications']),
});

const GetDataKeysSaved = (lastUpdated: keyof CreateVehicleValues | null): (keyof CreateVehicleData)[] => {
  if (!lastUpdated) {
    return [];
  }
  switch (lastUpdated) {
    case 'brand':
      return ['brands'];
    case 'model':
      return ['brands', 'models'];
    case 'year':
      return ['brands', 'models', 'years'];
    case 'bodyId':
      return ['brands', 'models', 'years', 'bodies'];
    case 'generationId':
      return ['brands', 'models', 'years', 'bodies', 'generations'];
    case 'engineId':
      return ['brands', 'models', 'years', 'bodies', 'generations', 'engines'];
    case 'driveId':
      return ['brands', 'models', 'years', 'bodies', 'generations', 'engines', 'drives'];
    default:
      return ['brands', 'models', 'years', 'bodies', 'generations', 'engines', 'drives', 'transmissions'];
  }
};

const GetParamsByValues = (values: CreateVehicleValues): CreateVehicleDataParams => ({
  brandId: values.brand ? values.brand : undefined,
  modelId: values.model ? values.model : undefined,
  year: values.year || undefined,
  bodyTypeId: values.bodyId !== null ? values.bodyId : undefined,
  generationId: values.generationId !== null ? values.generationId : undefined,
  engineId: values.engineId !== null ? values.engineId : undefined,
  driveId: values.driveId !== null ? values.driveId : undefined,
  transmissionId: values.transmissionId !== null ? values.transmissionId : undefined,
  colorId: values.colorId !== null ? values.colorId : undefined,
});

const GetParamsKeys = (lastUpdated: keyof CreateVehicleValues | null): (keyof CreateVehicleDataParams)[] => {
  if (!lastUpdated) {
    return [];
  }
  switch (lastUpdated) {
    case 'brand':
      return ['brandId'];
    case 'model':
      return ['brandId', 'modelId'];
    case 'year':
      return ['brandId', 'modelId', 'year'];
    case 'bodyId':
      return ['brandId', 'modelId', 'year', 'bodyTypeId'];
    case 'generationId':
      return ['brandId', 'modelId', 'year', 'bodyTypeId', 'generationId'];
    case 'engineId':
      return ['brandId', 'modelId', 'year', 'bodyTypeId', 'generationId', 'engineId'];
    case 'driveId':
      return ['brandId', 'modelId', 'year', 'bodyTypeId', 'generationId', 'engineId', 'driveId'];
    default:
      return ['brandId', 'modelId', 'year', 'bodyTypeId', 'generationId', 'engineId', 'driveId', 'transmissionId'];
  }
};

export const onlyGetFilterData = (values: any, isEdition?: boolean) => {
  const params = GetParamsByValues(values);
  return isEdition ? getVehicleEditData(params) : getVehicleCreateData(params);
};

export const setFilterData =
  (responseData: any, fields: (keyof CreateVehicleValues)[]): AsyncAction =>
  async (dispatch, getState, { initial }) => {
    const {
      vehicleCreate: { data, lastUpdated },
    } = getState();
    const response = DataMapper(responseData);
    const savedData = pick(data, GetDataKeysSaved(lastUpdated));
    const result: CreateVehicleData = { ...savedData, ...pick(response, [...fields, 'conditions']) };
    dispatch(actions.setData({ data: result, initial }));
  };

export const clearFilterData =
  (fields: (keyof CreateVehicleValues)[]): AsyncAction =>
  async (dispatch, getState, { initial }) => {
    const {
      vehicleCreate: { data },
    } = getState();
    const result: CreateVehicleData = { ...data, ...pick(initialState.vehicleCreate.data, fields) };
    dispatch(actions.setData({ data: result, initial }));
  };

export const fetchDataAction =
  (ignoreSave?: boolean, isEdition?: boolean): AsyncAction =>
  async (dispatch, getState, { initial }) => {
    const {
      vehicleCreate: { values, lastUpdated, data },
    } = getState();
    const params = pick(GetParamsByValues(values), GetParamsKeys(lastUpdated));
    const savedData = pick(data, GetDataKeysSaved(lastUpdated));
    dispatch(actions.setLoading(true));
    return isEdition
      ? getVehicleEditData(params)
      : getVehicleCreateData(params)
          .then(({ data: responseData }) => {
            const response = DataMapper(responseData);
            const result: CreateVehicleData = ignoreSave ? response : { ...response, ...savedData };
            dispatch(actions.setData({ data: result, initial }));
          })
          .catch((err) => {
            dispatch(actions.setError(err));
          });
  };

export const fetchOptionsAction =
  (): AsyncAction =>
  async (dispatch, getState, { initial }) => {
    return getVehicleCreateOptions()
      .then(({ data: options }) => {
        dispatch(actions.setDataOptions({ options, initial }));
      })
      .catch((err) => {
        dispatch(actions.setError(err));
      });
  };

const IMPORTANT_CURRENT_NEXT_KEYS = [
  ['brand', 'model'],
  ['model', 'year'],
  ['year', 'bodyId'],
  ['bodyId', 'generationId'],
  ['generationId', 'engineId'],
  ['engineId', 'driveId'],
  ['driveId', 'transmissionId'],
  ['transmissionId', 'modificationId'],
];

const isCurrentStep = <T, Y>(prevData: T, currentData: T, nextFilesNewData: Y) => {
  if (!prevData || (prevData && prevData !== currentData) || (prevData && !nextFilesNewData)) {
    return true;
  }
  return false;
};

const GetLastUpdated = (
  lastState: CreateVehicleValues,
  newState: CreateVehicleValues,
): keyof CreateVehicleValues | null => {
  if (!newState.brand) {
    return null;
  }

  let lastKey: keyof CreateVehicleValues = 'price';

  // eslint-disable-next-line no-restricted-syntax
  for (const keys of IMPORTANT_CURRENT_NEXT_KEYS) {
    const keyCurrent = keys[0] as keyof CreateVehicleValues;
    const keyNext = keys[1] as keyof CreateVehicleValues;
    let isCurrent: boolean;
    if (lastState[keyCurrent] && typeof lastState[keyCurrent] === 'object') {
      const prevFieldData = (lastState[keyCurrent] as AutocompleteOption).value;
      const currentFieldData = (newState[keyCurrent] as AutocompleteOption).value;
      const nexData =
        typeof newState[keyNext] === 'object'
          ? newState[keyNext] && (newState[keyNext] as AutocompleteOption).value
          : newState[keyNext];
      isCurrent = isCurrentStep(prevFieldData, currentFieldData, nexData);
    } else {
      isCurrent = isCurrentStep(lastState[keyCurrent], newState[keyCurrent], newState[keyNext]);
    }
    if (isCurrent) {
      lastKey = keyCurrent;
      break;
    }
  }
  return lastKey;
};

const ShouldDataUpdate = (lastUpdated: keyof CreateVehicleValues | null): boolean => {
  return (
    !!lastUpdated &&
    ['brand', 'model', 'year', 'bodyId', 'generationId', 'engineId', 'driveId', 'transmissionId'].includes(
      <string>lastUpdated,
    )
  );
};

const GetValuesSavedKeys = (lastUpdated: keyof CreateVehicleValues | null): (keyof CreateVehicleValues)[] => {
  if (!lastUpdated) {
    return [];
  }
  switch (lastUpdated) {
    case 'brand':
      return ['city', 'brand'];
    case 'model':
      return ['city', 'brand', 'model'];
    case 'year':
      return ['city', 'brand', 'model', 'year'];
    case 'bodyId':
      return ['city', 'brand', 'model', 'year', 'bodyId'];
    case 'generationId':
      return ['city', 'brand', 'model', 'year', 'bodyId', 'generationId'];
    case 'engineId':
      return ['city', 'brand', 'model', 'year', 'bodyId', 'generationId', 'engineId'];
    case 'driveId':
      return ['city', 'brand', 'model', 'year', 'bodyId', 'generationId', 'engineId', 'driveId'];
    case 'transmissionId':
      return ['city', 'brand', 'model', 'year', 'bodyId', 'generationId', 'engineId', 'driveId', 'transmissionId'];
    default:
      return Object.keys(initialState.vehicleCreate.values) as (keyof CreateVehicleValues)[];
  }
};

const hasOptionsChanged = (currentValues: CreateVehicleValues, lastValues: CreateVehicleValues): boolean => {
  const currentOptionsKeys = Object.keys(currentValues).filter((key) => key.includes('option'));
  const lastOptionsKeys = Object.keys(lastValues).filter((key) => key.includes('option'));

  return (
    currentOptionsKeys.length !== lastOptionsKeys.length ||
    currentOptionsKeys.some((key) => !isEqual(currentValues[key], lastValues[key]))
  );
};

const FlushValuesByKey = (
  values: CreateVehicleValues,
  lastUpdated: keyof CreateVehicleValues | null,
): CreateVehicleValues => {
  const savedKeys = GetValuesSavedKeys(lastUpdated);
  return savedKeys.length ? { ...initialState.vehicleCreate.values, ...pick(values, savedKeys) } : values;
};

export const setValuesAction =
  (values: CreateVehicleValues, valid?: boolean | null, fetchData: boolean = true): AsyncAction =>
  async (dispatch, getState) => {
    const {
      vehicleCreate: { values: lastValues, valid: lastValid, lastUpdated },
    } = getState();

    if (hasOptionsChanged(values, lastValues)) {
      dispatch(actions.setValues({ values, lastUpdated, valid }));
      return; // we don't need to run the rest of the code if it was an option that was changed
    }

    if (!isEqual(lastValues, values) || (typeof valid !== 'undefined' && valid !== lastValid)) {
      const lastUpdatedKey = GetLastUpdated(lastValues, values);
      await dispatch(
        actions.setValues({ values: FlushValuesByKey(values, lastUpdatedKey), lastUpdated: lastUpdatedKey, valid }),
      );
      if (fetchData && ShouldDataUpdate(lastUpdatedKey)) {
        dispatch(fetchDataAction());
      }
    }
  };

export const setContactsAction =
  (values: CreateVehicleContacts, valid?: boolean | null): AsyncAction =>
  async (dispatch, getState) => {
    const {
      vehicleCreate: { contacts: lastValues, valid: lastValid },
    } = getState();
    if (!isEqual(lastValues, values) || valid !== lastValid) {
      await dispatch(actions.setContacts({ values, valid }));
    }
  };

export const createVehicleTradeInAction =
  (callback?: (id: number) => void): AsyncAction =>
  async (dispatch, getState) => {
    const {
      vehicleCreate: { values, data: formData },
      city: {
        current: { id: cityId },
      },
      autostat: { data: autostatData },
    } = getState();

    const modification = formData.modifications.find((mod) => mod.id === values.modificationId);

    const { data } = await createTradeInVehicle({
      production_year: +values.year!,
      brand: `${values.brand}`,
      model: `${values.model}`,
      body: `${values.bodyId!}`,
      generation: `${values.generationId!}`,
      color: '1183',
      drive: `${values.driveId!}`,
      engine: `${values.engineId!}`,
      transmission: `${values.transmissionId!}`,
      engine_volume: `${modification!.volume}`,
      engine_hp: +modification!.power,
      mileage: +values.mileage!,
      estimated_cost: +(autostatData?.priceAvg || autostatData?.priceTradeIn || 0),
      city: `${cityId}`,
      condition: values.condition!,
    });
    if (callback) {
      callback(data.id);
    }
  };

export const getMappedOptions = (values: CreateVehicleValues): string => {
  // getting appropriate options from form values
  const options = Object.entries(values).filter(
    ([key, value]) => key.includes('option') && value && (Array.isArray(value) ? value.length : true),
  );

  return options
    .map(([key, value]) => {
      const optionName = key.split('-').slice(1).join('-');
      const convertedName = optionName.replaceAll('_', '.');

      const isCheckbox = typeof value === 'boolean';
      const isSelect = typeof value === 'string';

      return (
        (isCheckbox && convertedName) ||
        (isSelect && value) ||
        value.map((item: AutocompleteOption) => item.label).join(', ')
      );
    })
    .join(', ');
};

const getClientVehicleParams = (
  vehicleParams: VehicleCreateParams,
  formParams: VehicleCreateState,
): CreateClientVehicleParams => {
  const { values, contacts, data: formData } = formParams;

  const modification = formData.modifications.find((mod) => mod.id === values.modificationId);

  return {
    uuid: vehicleParams.uuid,
    type: vehicleParams.typeId!,
    scenario: vehicleParams.scenario!,
    city: values.city!,
    phone: contacts.phone!,
    number: 'а123аа77',
    vin: values.vin!,
    brand: `${values.brand}`,
    model: `${values.model}`,
    generation: `${values.generationId!}`,
    transmission: `${values.transmissionId!}`,
    drive: `${values.driveId!}`,
    body: `${values.bodyId!}`,
    engine: `${values.engineId!}`,
    engine_hp: `${modification!.power}`,
    engine_volume: `${modification!.volume}`,
    production_year: `${values.year}`!,
    mileage: `${values.mileage!}`,
    price: `${values.price!}`,
    color: values.colorId ? `${values.colorId}` : undefined,
    condition: values.condition!,
    owners_number: values.ownersNumber || undefined,
    images_url: [...(values.imagesExterior || []), ...(values.imagesInterior || [])].join(','),
    sts_url: [...(values.stsFront || []), ...(values.stsBack || [])].join(','),
    video_url: values.videoUrl || undefined,
  };
};

export const createVehicleSellExtAction = (): AsyncAction => async (dispatch, getState) => {
  const {
    vehicleCreate: { values, contacts, data, scenario },
    autostat: { data: autostatData },
  } = getState();

  const modification = data.modifications.find((mod) => mod.id === values.modificationId);
  const mappedOptions = getMappedOptions(values); // bad api

  dispatch(actions.setLoading(true));
  return createClientVehicleExt({
    vehicle: {
      scenario: `${scenario}`,
      vin: values.vin!,
      production_year: values.year!,
      brand: `${values.brand}`,
      model: `${values.model}`,
      generation: `${values.generationId!}`,
      drive: `${values.driveId!}`,
      body: `${values.bodyId!}`,
      engine: `${values.engineId!}`,
      transmission: `${values.transmissionId!}`,
      engine_hp: `${modification!.power}`,
      engine_volume: `${modification!.volume}`,
      mileage: `${values.mileage!}`,
      number: 'A000A000',
      images_url: [...(values.imagesExterior || []), ...(values.imagesInterior || [])].join(','),
      price: values.price!,
      estimated_cost: autostatData?.priceAvg || autostatData?.priceTradeIn || 0,
      city: `${values.city}`,
      condition: `${values.condition!}`,
      owners_number: values.ownersNumber || 1,
      sts_url: [...(values.stsFront || []), ...(values.stsBack || [])].join(','),
      color: `${values.colorId}`,
      video_url: values.videoUrl || undefined,
      comment: undefined,
      options: mappedOptions,
    },
    contacts: {
      time_from: contacts.meetFrom!,
      time_to: contacts.meetTo!,
      latitude: contacts.latitude,
      longitude: contacts.longitude,
      address: contacts.address,
    },
    user: {
      last_name: contacts.lastName || null,
      first_name: contacts.firstName!,
      patronymic_name: contacts.middleName || null,
      email: contacts.email || null,
    },
  }).finally(() => {
    dispatch(actions.setLoading(false));
  });
};

export const setScenario =
  (scenario: VEHICLE_SCENARIO): AsyncAction =>
  async (dispatch) => {
    await dispatch(actions.setScenario({ scenario }));
  };

export const createVehicleSellAction =
  (params: VehicleCreateParams, callback?: () => void): AsyncAction =>
  async (dispatch, getState) => {
    const { vehicleCreate } = getState();

    dispatch(actions.setLoading(true));

    createClientVehicle(getClientVehicleParams(params, vehicleCreate))
      .then(() => {
        dispatch(actions.setLoading(false));
        if (callback) {
          callback();
        }
      })
      .catch(() => {
        dispatch(actions.setLoading(false));
      });
  };

export const setValuesByVehicle =
  ({ vehicle, contacts }: VehicleWithContacts): AsyncAction =>
  async (dispatch, getState) => {
    const {
      user,
      vehicleCreate: { values },
    } = getState();
    await dispatch(
      actions.setValues({
        values: {
          city: values.city,
          brand: vehicle.brandId,
          model: vehicle.modelId,
          year: vehicle.productionYear,
          generationId: vehicle.generationId,
          bodyId: vehicle.bodyTypeId,
          transmissionId: vehicle.transmissionId,
          engineId: vehicle.engineId,
          driveId: vehicle.driveId,
          modificationId: vehicle.equipmentId,
          condition: vehicle.condition || null,
          mileage: vehicle.mileage,
          vin: vehicle.vin,
          price: vehicle.price,
          colorId: vehicle.colorId,
          videoUrl: vehicle.videoUrl || null,
          imagesExterior: vehicle.exteriorImages,
          imagesInterior: null,
          stsFront: vehicle.stsImages && vehicle.stsImages[0] ? [vehicle.stsImages[0]] : null,
          stsBack: vehicle.stsImages && vehicle.stsImages[1] ? [vehicle.stsImages[1]] : null,
          ownersNumber: vehicle.ownersNumber || null,
        },
        valid: true,
        lastUpdated: 'modificationId',
      }),
    );
    await dispatch(
      actions.setScenario({
        scenario: !vehicle.scenario
          ? VEHICLE_SCENARIO.USED_AUCTION_AND_CLIENT
          : (`${vehicle.scenario}` as VEHICLE_SCENARIO),
      }),
    );
    dispatch(fetchDataAction(true));
    await dispatch(
      setContactsAction(
        {
          firstName: user.firstName,
          lastName: user.lastName || null,
          middleName: user.patronymicName || null,
          phone: user.phone,
          meetFrom: contacts.timeFrom || 9,
          meetTo: contacts.timeTo || 21,
          email: user.email || null,
          latitude: contacts.latitude || null,
          longitude: contacts.longitude || null,
          address: contacts.address || null,
        },
        true,
      ),
    );
  };
