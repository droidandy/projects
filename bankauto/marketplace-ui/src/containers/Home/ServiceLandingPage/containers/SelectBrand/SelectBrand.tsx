import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { useBreakpoints, Grid } from '@marketplace/ui-kit';
import { ServiceStep, VehicleType } from 'types/Service';
import { setFieldDataOptions } from 'helpers/formUtils';
import { VehicleButton } from './VehicleButton';
import { Filter, PageContainer } from '../../components';
import { useCarBrand } from '../../hooks/api';
import { LightTransport, CommercialTransport } from './icons';
import { useStyles } from './SelectBrand.styles';

type SelectBrandProps = {
  initialValues: any;
  data: any;
  navigate: any;
  onChange: any;
  onSet: any;
  header: any;
};

const vehicleTypes = [
  {
    type: VehicleType.PASSENGER,
    label: 'Легковые автомобили',
    icon: LightTransport,
  },
  {
    type: VehicleType.COMMERCIAL,
    label: 'Коммерческий транспорт',
    icon: CommercialTransport,
  },
];

export const SelectBrand = ({ initialValues, data, navigate, onChange, onSet, header }: SelectBrandProps) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const [type, setType] = React.useState(VehicleType.PASSENGER);
  const { data: items } = useCarBrand(type);
  const rawData = (items as any)?.data?.marks || [];

  const handleChangeBrand = (brand: any) => {
    onChange({ values: { ...data, brand } });
    navigate(ServiceStep.MODEL);
  };

  return (
    <PageContainer>
      {header}
      <Form onSubmit={onSet} initialValues={initialValues} mutators={{ setFieldDataOptions }} subscription={{}}>
        {({ handleSubmit }) => (
          <form name="form-brand" onSubmit={handleSubmit}>
            <p className={s.label}>Тип транспортного средства</p>
            <Grid container direction={isMobile ? 'column' : 'row'} spacing={3} wrap="nowrap">
              {vehicleTypes.map((i) => (
                <Grid item className={s.item}>
                  <VehicleButton {...i} active={type === i.type} onClick={() => setType(i.type)} />
                </Grid>
              ))}
            </Grid>
            <p className={s.label}>Выберите марку</p>
            <Filter limit={34} data={rawData} onChange={handleChangeBrand} />
            <FormSpy subscription={{ values: true }} onChange={onChange} />
          </form>
        )}
      </Form>
    </PageContainer>
  );
};
