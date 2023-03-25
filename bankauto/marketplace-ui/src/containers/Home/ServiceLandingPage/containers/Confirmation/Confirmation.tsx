import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { Grid, Button, useBreakpoints } from '@marketplace/ui-kit';
import { format, getTime } from 'date-fns';
import { Checkbox, Input, InputPhone } from 'components/Fields';
import { ServiceStep } from 'types/Service';
import { user, orderCreate } from 'api/remont';
import { useQueryClient } from 'react-query';
import { setFieldDataOptions } from 'helpers/formUtils';
import { PageContainer } from '../../components';
import { ConfirmPhoneBySms } from './ConfirmPhoneBySms';
import { useStyles } from './Confirmation.styles';
import { ConfirmationSchema } from './Confirmation.schema';
import { AuthFormData } from '../../../../../types/AuthFormData';
import { pushAnalyticsEvent, getIds, getWorkTypeDescription } from '../../helpers';
import { uremontLinks } from '../../../../../constants/licenseDocumentsLinks';

type ConfirmationProps = {
  initialValues: any;
  data: any;
  navigate: any;
  onChange: any;
  onSet: any;
  onClear: any;
  orderCreated: any;
  header: any;
};

export const Confirmation = ({
  initialValues,
  data,
  navigate,
  onChange,
  onSet,
  header,
  onClear,
  orderCreated,
}: ConfirmationProps) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const queryClient = useQueryClient();

  const [confirmPhoneIsVisible, setConfirmPhoneIsVisible] = React.useState(false);
  const [codeError, setCodeError] = React.useState('');

  const onContinue = () => {
    setConfirmPhoneIsVisible(true);
    pushAnalyticsEvent({ form_step: 4 });
  };

  const handleSubmitForm = async ({ phone, code, token }: AuthFormData) => {
    if (token) {
      try {
        pushAnalyticsEvent({ form_step: 5 });
        const userData = {
          phone: phone.substring(1),
          code,
          token,
          first_name: data.firstName,
          email: data.email,
        };
        const userResponce = await queryClient.fetchQuery(['user', userData], () => user(userData));
        const orderCreateData = {
          auth_token: (userResponce as any)?.data?.auth_token,
          model_id: data.model?.id || data.model?.value,
          year: data.year?.value || data.year,
          work_ids: getIds(data.workType),
          lat: data.lat,
          long: data.long,
          radius: data.radius,
          service_id: data.serviceId,
          description: getWorkTypeDescription(data.workType),
          vin: data.vin,
          licence_plate: data.licensePlate,
          work_time: `${format(data.date, 'dd-MM-yyyy')} ${format(data.time, 'HH:mm')}`,
          desired_repair_time:
            getTime(new Date(`${format(data.date, 'yyyy-MM-dd')}T${format(data.time, 'HH:mm:ss')}`)) / 1000,
          need_evacuator: +data.isTruckRequired,
          own_spare_parts: +data.isOwnSpareParts,
        };
        await queryClient.fetchQuery(['orderCreate', orderCreateData], () => orderCreate(orderCreateData));
        setConfirmPhoneIsVisible(false);
        onClear();
        navigate(ServiceStep.WORK_TYPE);
        orderCreated();
      } catch (error) {
        setCodeError(error.toString());
      }
    }
  };

  return (
    <PageContainer>
      {header}
      <ConfirmPhoneBySms
        handleSubmitForm={handleSubmitForm}
        isVisible={confirmPhoneIsVisible}
        onSet={setConfirmPhoneIsVisible}
        codeError={codeError}
      />
      <Form
        onSubmit={onSet}
        validate={async (values) => {
          try {
            await ConfirmationSchema.validateSync(ConfirmationSchema.cast(values), { abortEarly: false });
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
          <form name="form-confirm" onSubmit={props.handleSubmit}>
            <p className={s.label}>Ваша заявка готова</p>
            <p>Укажите номер телефона, чтобы получать SMS с ответами от автосервисов</p>
            <p>Бесплатная услуга для автовладельцев!</p>
            <Grid
              className={s.container}
              container
              direction={isMobile ? 'column' : 'row'}
              spacing={3}
              wrap="nowrap"
              alignItems="center"
            >
              <Grid item className={s.item}>
                <InputPhone className={s.control} name="phone" area="phone" placeholder="Телефон" variant="outlined" />
              </Grid>
              <Grid item className={s.item}>
                <Input className={s.control} name="firstName" area="firstName" placeholder="Имя" variant="outlined" />
              </Grid>
            </Grid>
            <Grid className={s.container} container direction={isMobile ? 'column' : 'row'} spacing={3} wrap="nowrap">
              <Grid item className={s.item}>
                <Input className={s.control} name="email" area="email" placeholder="Email" variant="outlined" />
              </Grid>
              <Grid item className={s.item}></Grid>
            </Grid>
            <Grid container direction="column" spacing={3} wrap="nowrap">
              <Grid item>
                <Checkbox
                  name="istermsOfUseService"
                  color="primary"
                  label={
                    <div>
                      Я принимаю
                      <a href={uremontLinks.agreement} rel="noreferrer" target="_blank">
                        {' '}
                        условия{' '}
                      </a>
                      использования сервиса и даю
                      <a href={uremontLinks.privacy} rel="noreferrer" target="_blank">
                        {' '}
                        согласие{' '}
                      </a>
                      на обработку персональных данных
                    </div>
                  }
                />
              </Grid>
              <Grid item>
                <Checkbox
                  name="isReceiveServiceOffers"
                  color="primary"
                  label={
                    <div>
                      <a href={uremontLinks.agreement} rel="noreferrer" target="_blank">
                        Согласен{' '}
                      </a>
                      получать предложения сервиса
                    </div>
                  }
                />
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Button
                fullWidth={isMobile}
                className={s.btn}
                disabled={props.submitting || Boolean(Object.values(props.errors || {}).length)}
                variant="contained"
                color="primary"
                size="large"
                type="button"
                onClick={onContinue}
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
