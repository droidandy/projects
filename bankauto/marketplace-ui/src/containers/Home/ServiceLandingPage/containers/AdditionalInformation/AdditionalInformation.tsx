import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { useBreakpoints, Grid, Button } from '@marketplace/ui-kit';
import { Checkbox, InputVehicleVin, InputVehicleNumber } from 'components/Fields';
import { ServiceStep } from 'types/Service';
import { setFieldDataOptions } from 'helpers/formUtils';
import { PageContainer } from '../../components';
import { pushAnalyticsEvent } from '../../helpers';
import { useStyles } from './AdditionalInformation.styles';
import { AdditionalInformationSchema } from './AdditionalInformation.schema';

type AdditionalInformationProps = {
  initialValues: any;
  data: any;
  navigate: any;
  onChange: any;
  onSet: any;
  header: any;
};

export const AdditionalInformation = ({
  initialValues,
  data,
  navigate,
  onChange,
  onSet,
  header,
}: AdditionalInformationProps) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <PageContainer>
      {header}
      <Form
        onSubmit={onSet}
        validate={async (values) => {
          console.log('values', values);
          try {
            await AdditionalInformationSchema.validateSync(AdditionalInformationSchema.cast(values), {
              abortEarly: false,
            });
          } catch (err) {
            return err.inner.reduce(
              (formError: any, innerError: any) => ({
                ...formError,
                [innerError.path]: [innerError.message],
              }),
              {},
            );
          }
        }}
        initialValues={initialValues}
        mutators={{ setFieldDataOptions }}
        subscription={{ submitting: true, errors: true }}
      >
        {(props) => (
          <form name="form-info" onSubmit={props.handleSubmit}>
            <p className={s.label}>Дополнительная информация</p>
            <p>Рекомендуем указать вам больше информации - так автосервисы смогут точнее оценить ремонт.</p>
            <Grid className={s.container} container direction={isMobile ? 'column' : 'row'} spacing={3} wrap="nowrap">
              <Grid item className={s.item}>
                <InputVehicleNumber
                  className={s.control}
                  name="licensePlate"
                  area="licensePlate"
                  placeholder="Госномер автомобиля"
                  variant="outlined"
                />
              </Grid>
              <Grid item className={s.item}>
                <InputVehicleVin
                  maskPlaceholder={''}
                  className={s.control}
                  name="vin"
                  area="vin"
                  placeholder="VIN-код автомобиля"
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container direction={isMobile ? 'column' : 'row'} spacing={3} wrap="nowrap">
              <Grid item>
                <Checkbox name="isTruckRequired" color="primary" label="Необходим эвакуатор" />
              </Grid>
              <Grid item>
                <Checkbox name="isOwnSpareParts" color="primary" label="Собственные запчасти" />
              </Grid>
            </Grid>
            <Grid className={s.container} container justify="center">
              <Button
                fullWidth={isMobile}
                disabled={props.submitting || Boolean(Object.values(props.errors || {}).length)}
                variant="contained"
                color="primary"
                size="large"
                type="button"
                onClick={() => {
                  navigate(ServiceStep.SEARCH_MAP);
                  pushAnalyticsEvent({ form_step: 2 });
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
