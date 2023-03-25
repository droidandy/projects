import React, { FC, useEffect, useMemo, useState } from 'react';
import { INSURANCE_DRIVERS_COUNT, INSURANCE_FORM_TYPE, VEHICLE_OWNING_TYPE } from 'types/Insurance';
import useBreakpoints from '@marketplace/ui-kit/hooks/useBreakpoints';
import InputGroup from '@marketplace/ui-kit/components/InputGroup';
import { AutocompleteOption } from '@marketplace/ui-kit/components/Autocomplete';
import { APPLICATION_INSURANCE_TYPE, Node, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { Autocomplete, Input, InputPrice, Select } from 'components/Fields';
import { useForm } from 'react-final-form';
import chunk from 'lodash/chunk';
import { FormApi } from 'final-form';
import { actions } from 'store/insurance/application/reducers';
import { useDispatch } from 'react-redux';
import { useFieldValue } from 'components/Fields/helpers';
import { FORM_TYPES } from 'constants/insurance';
import { getVehicleCreateData } from 'api/catalog';

const mapFilterData = (i: Node) => ({ label: i.name, value: i.id });
const mapProductionYear = (i: number): AutocompleteOption => ({ label: `${i}`, value: i });
const mapBodyType = (i: Node): AutocompleteOption => ({ label: i.name, value: i.id });

const CITIES = [{ label: 'Москва', value: 'Moscow' }];
const VEHICLE_TYPES = [
  { label: 'С пробегом', value: VEHICLE_TYPE.USED },
  { label: 'Новый', value: VEHICLE_TYPE.NEW },
];
const VEHICLE_OWNING_TYPES = [
  { label: 'Нет', value: VEHICLE_OWNING_TYPE.OWNED },
  { label: 'Да', value: VEHICLE_OWNING_TYPE.CREDIT },
];
const INSURANCE_TYPE = [
  { label: 'Мультидрайв', value: INSURANCE_DRIVERS_COUNT.MULTIDRIVE },
  { label: 'Ограниченный', value: INSURANCE_DRIVERS_COUNT.SEVERAL },
];

const resetFormFields = (form: FormApi, fields: string[]) => {
  form.batch(() => {
    fields.forEach((field) => {
      form.change(field, null);
      form.resetFieldState(field);
    });
  });
};

const map = {
  [INSURANCE_FORM_TYPE.CASCO_OSAGO]: [APPLICATION_INSURANCE_TYPE.CASCO, APPLICATION_INSURANCE_TYPE.OSAGO],
  [INSURANCE_FORM_TYPE.OSAGO]: [APPLICATION_INSURANCE_TYPE.OSAGO],
  [INSURANCE_FORM_TYPE.CASCO]: [APPLICATION_INSURANCE_TYPE.CASCO],
};

const MainBlock: FC = () => {
  const { isMobile } = useBreakpoints();
  const dispatch = useDispatch();

  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formType = useFieldValue('formType');

  useEffect(() => {
    if (!formType) {
      dispatch(actions.setInsuranceApplications(null));
    }
    // @ts-ignore
    dispatch(actions.setInsuranceApplications(map[formType]));
  }, [formType, dispatch]);

  const templateAreas = useMemo(() => {
    const areas = [
      'city',
      'formType',
      'brand',
      'model',
      'productionYear',
      'bodyType',
      formType !== INSURANCE_FORM_TYPE.OSAGO && 'vehicleType',
      formType !== INSURANCE_FORM_TYPE.OSAGO && 'vehicleOwningType',
      formType !== INSURANCE_FORM_TYPE.OSAGO && 'price',
      'power',
      'insuranceType',
      !isMobile && 'insuranceType',
    ].filter((area) => typeof area === 'string') as string[];
    return chunk(areas, isMobile ? 1 : 3);
  }, [formType, isMobile]);

  const form = useForm();
  const brand = useFieldValue('brand');
  const model = useFieldValue('model');
  const productionYear = useFieldValue('productionYear');

  const fetchData = async (brandId?: any, modelId?: any, year?: any) => {
    const data = await getVehicleCreateData({
      brandId: brandId || null,
      modelId: modelId || null,
      year: year || null,
    });
    setIsLoading(false);
    setValues(data.data);
  };

  useEffect(() => {
    if (brand) {
      resetFormFields(form, ['model', 'productionYear', 'bodyType']);
      fetchData(brand.value);
    }
  }, [form, brand]);

  useEffect(() => {
    if (model) {
      resetFormFields(form, ['productionYear', 'bodyType']);
      fetchData(brand.value, model.value);
    }
  }, [form, brand, model]);

  useEffect(() => {
    if (productionYear) {
      resetFormFields(form, ['bodyType']);
      fetchData(brand.value, model.value, productionYear.value);
    }
  }, [form, brand, model, productionYear]);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const brands = useMemo(() => (values.brands || []).map(mapFilterData), [values.brands]);

  const models = useMemo(() => (values.models || []).map(mapFilterData), [values.models]);

  const productionYears = useMemo(() => (values.years || []).map(mapProductionYear), [values.years]);
  const bodyTypes = useMemo(() => (values.bodies || []).map(mapBodyType), [values.bodies]);

  return (
    <InputGroup templateAreas={templateAreas}>
      <Select area="city" placeholder="Город" name="city" options={CITIES} />
      <Select area="formType" placeholder="Тип продукта" name="formType" options={FORM_TYPES} />
      {formType !== INSURANCE_FORM_TYPE.OSAGO ? (
        <Select area="vehicleType" placeholder="Автомобиль" name="vehicleType" options={VEHICLE_TYPES} />
      ) : null}
      {formType !== INSURANCE_FORM_TYPE.OSAGO ? (
        <Select
          area="vehicleOwningType"
          placeholder="Автомобиль кредитный"
          name="vehicleOwningType"
          options={VEHICLE_OWNING_TYPES}
        />
      ) : null}
      <Autocomplete area="brand" placeholder="Марка" name="brand" options={brands} />
      <Autocomplete area="model" placeholder="Модель" name="model" options={models} disabled={!brand || isLoading} />
      <Autocomplete
        area="productionYear"
        placeholder="Год выпуска"
        name="productionYear"
        options={productionYears}
        disabled={!brand || !model || isLoading}
      />
      <Autocomplete
        placeholder="Тип кузова"
        name="bodyType"
        options={bodyTypes}
        disabled={!brand || !model || !productionYear}
      />
      <Input variant="outlined" type="number" min={0} area="power" placeholder="Мощность" name="power" />
      {formType !== INSURANCE_FORM_TYPE.OSAGO ? (
        <InputPrice variant="outlined" area="price" placeholder="Стоимость автомобиля" name="price" />
      ) : null}
      <Select area="insuranceType" placeholder="Тип страхования" name="insuranceType" options={INSURANCE_TYPE} />
    </InputGroup>
  );
};

export default MainBlock;
