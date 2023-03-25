import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { ServiceStep } from 'types/Service';
import { setFieldDataOptions } from 'helpers/formUtils';
import { Filter, PageContainer } from '../../components';
import { useCarModel } from '../../hooks/api';
import { useStyles } from './SelectModel.styles';

type SelectModelProps = {
  initialValues: any;
  data: any;
  navigate: any;
  onChange: any;
  onSet: any;
  header: any;
};

export const SelectModel = ({ initialValues, data, navigate, onChange, onSet, header }: SelectModelProps) => {
  const s = useStyles();
  const { data: items } = useCarModel(data.brand?.id);
  const rawData = (items as any)?.data?.models || [];

  const handleChangeModel = (model: any) => {
    onChange({ values: { ...data, model } });
    navigate(ServiceStep.YEAR);
  };

  return (
    <PageContainer>
      {header}
      <Form onSubmit={onSet} initialValues={initialValues} mutators={{ setFieldDataOptions }} subscription={{}}>
        {({ handleSubmit }) => (
          <form name="form-model" onSubmit={handleSubmit}>
            <p className={s.label}>Выберите модель</p>
            <Filter placeholder="Модель" label="Все модели" limit={35} data={rawData} onChange={handleChangeModel} />
            <FormSpy subscription={{ values: true }} onChange={onChange} />
          </form>
        )}
      </Form>
    </PageContainer>
  );
};
