import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { useBreakpoints, Grid, Button } from '@marketplace/ui-kit';
import { InputKeyboardTime, InputKeyboardDate } from 'components/Fields';
import { ServiceStep } from 'types/Service';
import { setFieldDataOptions } from 'helpers/formUtils';
import { PageContainer } from '../../components';
import { useMapServices } from '../../hooks/api';
import { pushAnalyticsEvent } from '../../helpers';
import { useStyles } from './MapSearch.styles';
import { RButton } from './RButton';
import { YMap } from './YMap';

const radiuses = [5, 10, 25, 50, 100];

type MapSearchProps = {
  initialValues: any;
  data: any;
  navigate: any;
  onChange: any;
  onSet: any;
  header: any;
  withMap: boolean;
};

export const MapSearch = ({
  initialValues,
  data,
  navigate,
  onChange,
  onSet,
  header,
  withMap = true,
}: MapSearchProps) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const params = {
    lat: data.lat,
    long: data.long,
    radius: data.radius,
  };
  const { data: items } = useMapServices(params);
  const rawData = (items as any)?.data?.services || [];

  const handleChangeRadius = (radius: any) => {
    onChange({ values: { ...data, radius } });
  };

  const handleChangeAddress = ({ location }: any) => {
    const [lat, long] = location;
    onChange({ values: { ...data, lat, long } });
  };

  return (
    <PageContainer>
      {header}
      <Form onSubmit={onSet} initialValues={initialValues} mutators={{ setFieldDataOptions }} subscription={{}}>
        {({ handleSubmit }) => (
          <form name="form-map" onSubmit={handleSubmit}>
            {withMap && (
              <>
                <p className={s.label}>Выберите радиус поиска автосервиса</p>
                <YMap
                  radius={data.radius}
                  onAddressSelect={handleChangeAddress}
                  address={{
                    address: '',
                    location: [data.lat, data.long],
                  }}
                  points={rawData.map((p: { lat: number; long: number }) => [p.lat, p.long])}
                />
                <div className={s.radius}>
                  <div className={s.rLeft}>
                    <p className={s.radiusLabel}>Выберите радиус поиска, км</p>
                    <p className={s.countLabel}>
                      Найдено автосервисов: <b>{rawData.length}</b>
                    </p>
                  </div>
                  <div className={s.containerRadius}>
                    {radiuses.map((r) => (
                      <RButton label={r} active={r === data.radius} onClick={() => handleChangeRadius(r)} />
                    ))}
                  </div>
                </div>
              </>
            )}
            <p className={s.label}>Выберите дату и время</p>
            <Grid container direction={isMobile ? 'column' : 'row'} spacing={3} wrap="nowrap">
              <Grid item className={s.item}>
                <InputKeyboardDate
                  className={s.control}
                  name="date"
                  area="date"
                  label="Выберите дату"
                  inputVariant="outlined"
                />
              </Grid>
              <Grid item className={s.item}>
                <InputKeyboardTime
                  className={s.control}
                  name="time"
                  area="time"
                  label="Выберите удобное время"
                  inputVariant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Button
                fullWidth={isMobile}
                className={s.btn}
                variant="contained"
                color="primary"
                size="large"
                type="button"
                onClick={() => {
                  navigate(ServiceStep.CONFIRMATION);
                  pushAnalyticsEvent({ form_step: 3 });
                }}
              >
                Продолжить
              </Button>
            </Grid>
            <FormSpy subscription={{ values: true }} onChange={onChange} />
          </form>
        )}
      </Form>
    </PageContainer>
  );
};
