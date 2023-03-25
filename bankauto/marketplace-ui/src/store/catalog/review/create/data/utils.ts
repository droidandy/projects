import isEqual from 'lodash/isEqual';
import { ReviewCreateFormData, ReviewCreateFormDataParams } from 'types/Review';

const ReviewCreateDataOrder: (keyof ReviewCreateFormData)[] = [
  'brand',
  'model',
  'year',
  'body',
  'generation',
  'engine',
  'drive',
  'transmission',
  'modification',
  'ownershipTerm',
];

const KeysCondition: Record<keyof ReviewCreateFormDataParams, keyof ReviewCreateFormData> = {
  brandId: 'brand',
  modelId: 'model',
  year: 'year',
  bodyTypeId: 'body',
  generationId: 'generation',
  engineId: 'engine',
  driveId: 'drive',
  transmissionId: 'transmission',
  modificationId: 'modification',
  ownershipTerm: 'ownershipTerm',
};

const exists = (v: any | undefined) => typeof v !== 'undefined';

const getParamByKey = (dataKey: keyof ReviewCreateFormData): keyof ReviewCreateFormDataParams | null => {
  const paramEntry = (
    Object.entries(KeysCondition) as [keyof ReviewCreateFormDataParams, keyof ReviewCreateFormData][]
  ).find(([, key]) => key === dataKey);
  return paramEntry ? paramEntry[0] : null;
};

export const PrepareNewDataAndParams = (
  data: ReviewCreateFormData,
  dataParams: ReviewCreateFormDataParams,
  previousData?: ReviewCreateFormData,
): { data: ReviewCreateFormData; params: ReviewCreateFormDataParams } => {
  // определяем первый не заполненный шаг.
  const FirstEmpty = (Object.keys(dataParams) as unknown as (keyof ReviewCreateFormDataParams)[]).find(
    (key) => !exists(dataParams[key]),
  );
  // Определяем индекс не заполненного шага в списке всех шагов.
  const CurrentStep = FirstEmpty
    ? ReviewCreateDataOrder.findIndex((key) => key === KeysCondition[FirstEmpty])
    : ReviewCreateDataOrder.length;
  // все свойства что попадут в FillSteps будут заполнены предыдущими, или текущими значениями дата
  // если индекс первого незаполненного параметра = 0 - безусловно заполняем только 1 свойство
  // в противном случае заполняем все предыдущие
  // данные по параметрам следующим за CurrentStep, будут заполнены по цепочке
  // цепочка прерывается на следующей итерации после текущего шага или шага с единственным значением
  const FillSteps = CurrentStep >= 0 ? ReviewCreateDataOrder.slice(0, CurrentStep || 1) : ReviewCreateDataOrder;
  const response = ReviewCreateDataOrder.reduce(
    ({ result, chain, params }, key) => {
      // заполняем до текущего шага формы
      // заполняем из предыдущего состояния данных то что не должно было меняться
      if (FillSteps.includes(key)) {
        return {
          result: {
            ...result,
            [key]: previousData && previousData[key]?.length ? previousData[key] : result[key],
          },
          chain: true,
          params,
        };
      }

      // берем порядковый номер текущего свойства данных и ключ предыдущего свойства
      const currentIndex = ReviewCreateDataOrder.findIndex((id) => id === key);
      const previousKey = ReviewCreateDataOrder[currentIndex - 1];
      const previousLength = currentIndex > 0 && result[previousKey]?.length;

      // сопоставляем ключ параметра по текущему свойству Дата для обновления параметров
      const paramKey = getParamByKey(key);

      // заполняем по цепочке
      if (chain && previousLength) {
        return {
          result,
          chain: false,
          params: params,
        };
      }

      // цепочка прервана - дальнейшие свойства результата очищаем
      return {
        result: {
          ...result,
          [key]: undefined,
        },
        chain: false,
        params: { ...params, ...(paramKey ? { [paramKey]: undefined } : {}) },
      };
    },
    { result: data, params: dataParams, chain: true },
  );
  return { data: response.result, params: response.params };
};

export const PrepareNewParams = (prev: ReviewCreateFormDataParams, next: ReviewCreateFormDataParams) => {
  return (Object.keys(next) as never as (keyof ReviewCreateFormDataParams)[]).reduce(
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
