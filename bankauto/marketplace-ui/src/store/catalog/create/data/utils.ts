import isEqual from 'lodash/isEqual';
import { VehicleFormDataParams, VehicleFormData } from 'types/VehicleFormType';
import { DataParamsMap } from './mappers';

const CreateVehicleDataOrder: (keyof VehicleFormData)[] = [
  'brand',
  'model',
  'year',
  'body',
  'generation',
  'engine',
  'drive',
  'transmission',
  'modification',
];

const KeysCondition: Record<keyof Omit<VehicleFormDataParams, 'id'>, keyof VehicleFormData> = {
  brandId: 'brand',
  modelId: 'model',
  year: 'year',
  bodyTypeId: 'body',
  generationId: 'generation',
  engineId: 'engine',
  driveId: 'drive',
  transmissionId: 'transmission',
};

const exists = (v: any | undefined) => typeof v !== 'undefined';

const getParamByKey = (dataKey: keyof VehicleFormData): keyof VehicleFormDataParams | null => {
  const paramEntry = (Object.entries(KeysCondition) as [keyof VehicleFormDataParams, keyof VehicleFormData][]).find(
    ([, key]) => key === dataKey,
  );
  return paramEntry ? paramEntry[0] : null;
};

export const PrepareNewDataAndParams = (
  data: VehicleFormData,
  dataParams: Omit<VehicleFormDataParams, 'id'>,
  previousData?: VehicleFormData,
): { data: VehicleFormData; params: Omit<VehicleFormDataParams, 'id'> } => {
  // определяем Текущий шаг
  const FirstEmpty = (Object.keys(dataParams) as never as (keyof Omit<VehicleFormDataParams, 'id'>)[]).find(
    (key) => !exists(dataParams[key]),
  );
  const CurrentStep = FirstEmpty
    ? CreateVehicleDataOrder.findIndex((key) => key === KeysCondition[FirstEmpty])
    : CreateVehicleDataOrder.length;
  // все свойства что попадут в FillSteps будут заполнены предыдущими, или текущими значениями дата
  // если индекс первого незаполненного параметра = 0 - безусловно заполняем только 1 свойство
  // в противном случае заполняем все предыдущие
  // данные по параметрам следующим за CurrentStep, будут заполнены по цепочке
  // цепочка прерывается на следующей итерации после текущего шага или шага с единственным значением
  const FillSteps = CurrentStep >= 0 ? CreateVehicleDataOrder.slice(0, CurrentStep || 1) : CreateVehicleDataOrder;
  const response = CreateVehicleDataOrder.reduce(
    ({ result, chain, params }, key) => {
      // заполняем до текущего шага формы
      // заполняем из предыдущего состояния данных то что не должно было меняться
      if (FillSteps.includes(key)) {
        return {
          result: {
            ...result,
            [key]: previousData && previousData[key].length ? previousData[key] : result[key],
          },
          chain: true,
          params,
        };
      }

      // берем порядковый номер текущего свойства данных и ключ предыдущего свойства
      const currentIndex = CreateVehicleDataOrder.findIndex((id) => id === key);
      const previousKey = CreateVehicleDataOrder[currentIndex - 1];
      const previousLength = currentIndex > 0 && result[previousKey].length;

      // сопоставляем ключ параметра по текущему свойству Дата для обновления параметров
      const paramKey = getParamByKey(key);

      // заполняем по цепочке
      // сохраняем цепочку если текущее свойство содержит только 1 элемент
      // записываем значение в параметры т.к. подобные свойства считаются выбранными
      const isSolo = result[key].length === 1;
      if (chain && previousLength) {
        return {
          result,
          chain: isSolo,
          params:
            isSolo && paramKey && DataParamsMap[paramKey]
              ? { ...params, [paramKey]: DataParamsMap[paramKey]!(result[key][0]) }
              : params,
        };
      }

      // цепочка прервана - дальнейшие свойства результата очищаем
      return {
        result: {
          ...result,
          [key]: [],
        },
        chain: false,
        params: { ...params, ...(paramKey ? { [paramKey]: undefined } : {}) },
      };
    },
    { result: data, params: dataParams, chain: true },
  );
  return { data: response.result, params: response.params };
};

export const PrepareNewParams = (prev: VehicleFormDataParams, next: VehicleFormDataParams) => {
  return (Object.keys(next) as never as (keyof VehicleFormDataParams)[]).reduce(
    ({ result, chain, dirty }, key) => {
      const equal = isEqual(next[key], prev[key]);
      return {
        result: chain ? result : { ...result, [key]: equal ? undefined : next[key] },
        chain: chain && equal,
        dirty: dirty || exists(next[key]) || exists(prev[key]),
      };
    },
    { result: next, chain: true, dirty: false },
  );
};
