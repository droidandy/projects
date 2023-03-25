import React, { useCallback, useEffect } from 'react';
import { FormApi, FormState } from 'final-form';
import { FormSpy, useForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import { useDebounce } from '@marketplace/ui-kit';
import { VehicleFormValuesBase, VehicleFormData, VehicleFormSellValues } from 'types/VehicleFormType';
import { useVehicleCreateData } from 'store/catalog/create/data';
import { useNotifications } from 'store/notifications';
import { useRouter } from 'next/router';
import { useFormVehicleContext } from './FormContext';
import { CreateVehicleValues } from '../../types/VehicleCreateNew';
import { useVehicleDraftData } from '../../store/catalog/vehicleDraft';

type ParseValueFunction = <K extends any, R extends any>(
  items: K[],
  current: R,
  mapper: (i: K) => R,
  condition?: (l: R, r: R) => boolean,
) => R | null;

export const ParseValue: ParseValueFunction = (items, current, mapper, condition) => {
  if (!items.length) {
    return null;
  }
  if (items.length === 1) {
    return mapper(items[0]);
  }
  return items.find((item) => {
    const mapped = mapper(item);
    // eslint-disable-next-line eqeqeq
    return condition ? condition(mapped, current) : mapped == current;
  })
    ? current
    : null;
};

type ConditionFunction = <R>(items: any[], current: R) => R | null;

const ParseDataValueRecord: { [x: string]: ConditionFunction } = {
  brand: (items, current) => ParseValue(items, current, (i) => i.value, isEqual),
  model: (items, current) => ParseValue(items, current, (i) => i.value, isEqual),
  year: (items, current) => ParseValue(items, current, (i) => i.value, isEqual),
  body: (items, current) => ParseValue(items, current, (i) => i.id),
  generation: (items, current) => ParseValue(items, current, (i) => i.id),
  drive: (items, current) => ParseValue(items, current, (i) => i.id),
  transmission: (items, current) => ParseValue(items, current, (i) => i.id),
  engine: (items, current) => ParseValue(items, current, (i) => i.id),
  modification: (items, current) => ParseValue(items, current, (i) => i.id),
};

export const fillOptionsByData = (form: FormApi<VehicleFormValuesBase>, data: VehicleFormData) => {
  if (form.mutators.setFieldDataOptions) {
    Object.entries(data).forEach(([key, value]) => {
      form.mutators.setFieldDataOptions(key, value);
    });
  }
};

export const fillValuesByData = (form: FormApi<VehicleFormValuesBase>, data: VehicleFormData) => {
  const { values } = form.getState();
  const nextValues = Object.entries(data).reduce((result, [dataKey, dataItem]) => {
    const parser = ParseDataValueRecord[dataKey];
    if (parser) {
      // here we know that dataKey is also keyof CreateVehicleDynamicProto
      return { ...result, [dataKey]: parser(dataItem as any[], result[dataKey as keyof typeof result]) };
    }
    return result;
  }, values);
  (Object.keys(nextValues) as (keyof VehicleFormValuesBase)[]).forEach((key) => {
    if (!isEqual(values[key], nextValues[key])) {
      form.change(key, nextValues[key]);
    }
  });
};

const PARAMETERS_FOR_DRAFT = [
  'brand',
  'model',
  'year',
  'body',
  'drive',
  'engine',
  'generation',
  'transmission',
] as (keyof VehicleFormSellValues)[];

export const FormSpyData = () => {
  const router = useRouter();
  const isEditForm = router.pathname.includes('edit');
  const isCreateForm = router.pathname.includes('create');
  const { notifyError } = useNotifications();
  const { catalogType } = useFormVehicleContext();
  const form = useForm<VehicleFormValuesBase>();
  const {
    state: { data, initial, params },
    updateData,
  } = useVehicleCreateData();
  const { sendVehicleCreateDataDraft, updateVehicleCreateDataDraft, isSent } = useVehicleDraftData();

  const debouncedSaveUpdateDataDraft = useDebounce((values: VehicleFormSellValues) => {
    updateVehicleCreateDataDraft(values).catch((e) => {
      console.log(e);
    });
  }, 5000);

  useEffect(() => {
    form.batch(() => {
      fillOptionsByData(form, data);
      if (initial === false) {
        fillValuesByData(form, data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, initial]);

  const handleChange = useCallback(
    async ({ values }: FormState<VehicleFormValuesBase | CreateVehicleValues>) => {
      const val = values as VehicleFormSellValues;
      // updates data if condition values were changed
      updateData(values as VehicleFormValuesBase, catalogType).catch((e) => notifyError(e));
      if (isCreateForm && !isEditForm) {
        const isExistEmptyParams = PARAMETERS_FOR_DRAFT.find((key) => !val[key]);
        if (!isExistEmptyParams) {
          if (!params.id || isSent) {
            sendVehicleCreateDataDraft(val, isSent).catch((e) => notifyError(e));
          } else {
            debouncedSaveUpdateDataDraft(val);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [catalogType, data, form, params, isEditForm, isCreateForm],
  );

  return <FormSpy subscription={{ values: true }} onChange={handleChange} />;
};
