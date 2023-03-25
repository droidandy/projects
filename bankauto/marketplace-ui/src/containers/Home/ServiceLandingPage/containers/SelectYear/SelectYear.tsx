import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { ServiceStep } from 'types/Service';
import { setFieldDataOptions } from 'helpers/formUtils';
import { useStyles } from './SelectYear.styles';
import { Filter, PageContainer } from '../../components';
import { useCarYears } from '../../hooks/api';

type SelectYearProps = {
  initialValues: any;
  data: any;
  navigate: any;
  onChange: any;
  onSet: any;
  header: any;
};

export const SelectYear = ({ initialValues, data, navigate, onChange, onSet, header }: SelectYearProps) => {
  const s = useStyles();
  const { data: items } = useCarYears(data.model?.id);
  const rawData = (items as any)?.data?.years || [];

  const handleChangeYear = (year: any) => {
    onChange({ values: { ...data, year } });
    navigate(ServiceStep.CAR_INFO);
  };

  return (
    <PageContainer>
      {header}
      <Form onSubmit={onSet} initialValues={initialValues} mutators={{ setFieldDataOptions }} subscription={{}}>
        {({ handleSubmit }) => (
          <form name="form-year" onSubmit={handleSubmit}>
            <p className={s.label}>Выберите год выпуска</p>
            <Filter placeholder="Год" label="Все года" limit={29} data={rawData} onChange={handleChangeYear} />
            <FormSpy subscription={{ values: true }} onChange={onChange} />
          </form>
        )}
      </Form>
    </PageContainer>
  );
};
