import React, { FC, useCallback, useEffect, useMemo } from 'react';
import Typography from '@marketplace/ui-kit/components/Typography';
import ButtonAdvanced from '@marketplace/ui-kit/components/ButtonAdvanced';
import Grid from '@material-ui/core/Grid';
import { Token, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { useBreakpoints } from '@marketplace/ui-kit';
import { withoutCode } from 'helpers';
import { StateModel } from 'store/types';
import {
  INSURANCE_DRIVERS_COUNT,
  INSURANCE_FORM_TYPE,
  InsuranceFilterFormValues,
  InsuranceFormType,
  VEHICLE_OWNING_TYPE,
  AvailableUserInfo,
} from 'types/Insurance';
import { Field, Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Checkbox } from 'components/Fields';
import { useSelector } from 'react-redux';
import { makeValidateSync } from 'components/Fields/validation';
import { createForm } from 'final-form';
import Fieldset from 'components/Fields/Fieldset';
import createDecorator from 'final-form-focus';
import { useStyles } from './InsuranceForm.styles';
import AdvancedBlock from './blocks/AdvancedBlock';
import MainBlock from './blocks/MainBlock';
import InsuranceFormSchema from './InsuranceFormSchema';
import PersonBlock from './blocks/PersonBlock';
import UserBlock from './blocks/UserBlock';
import EmailBlock from './blocks/EmailBlock';
import DriversBlock from './blocks/DriversBlock';

export interface Props {
  loading?: boolean;
  disabled?: boolean;
  filter?: InsuranceFilterFormValues;
  handleLogin: ({ token }: Token & { expiresIn: number }) => void;
  handleSubmit?: (values: InsuranceFormType) => void;
  handleReset?: () => void;
}

const driverDefaultValues = {
  lastName: '',
  firstName: '',
  middleName: '',
  dateOfBirth: '',
  sexCode: '',
  driverLicenseNumber: '',
  drivingExperienceDateStart: '',
};

const validate = makeValidateSync(InsuranceFormSchema);

const InsuranceForm: FC<Props> = ({ loading, disabled, handleSubmit: submit, handleReset, filter }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const user = useSelector((state: StateModel) => state.user);
  const isUserAuthorized = user.isAuthorized;

  const focusOnError = createDecorator<InsuranceFormType>();

  const onSubmit = useCallback(
    (values) => {
      if (submit) {
        const data: InsuranceFormType = {
          main: {
            city: values.city,
            formType: values.formType,
            insuranceType: values.insuranceType,
            vehicleType: values.vehicleType,
            vehicleOwningType: values.vehicleOwningType,
            brand: values.brand,
            model: values.model,
            productionYear: values.productionYear,
            bodyType: values.bodyType,
            power: values.power,
            price: values.price,
          },
          contacts: {
            phone: values.phone,
            email: values.email,
          },
          insurant: {
            ...values.insurant,
            firstName: values.firstName,
            lastName: values.lastName,
            middleName: values.middleName,
            dateStart: values.insuranceIssuedAt,
          },
          ...(!values.isInsurantOwner && { owner: values.owner }),
          drivers: values.insuranceType === INSURANCE_DRIVERS_COUNT.SEVERAL ? values.drivers : [],
          advanced: {
            registered: !values.isVehicleNotRegistered,
            series: values.series,
            vin: values.vin,
            ptsSeries: values.ptsSeries,
            ptsIssuedAt: values.ptsIssuedAt,
          },
        };
        submit(data);
      }
    },
    [submit],
  );

  const initialValues = {
    city: filter?.city,
    formType: filter?.formType || INSURANCE_FORM_TYPE.CASCO_OSAGO,
    insuranceType: INSURANCE_DRIVERS_COUNT.SEVERAL,
    vehicleType: filter?.vehicleType || VEHICLE_TYPE.USED,
    vehicleOwningType: filter?.vehicleOwningType || VEHICLE_OWNING_TYPE.OWNED,
    brand: null,
    model: null,
    productionYear: null,
    bodyType: '',
    power: '',
    price: null,

    isInsurantOwner: true,
    isInsurantDriver: true,
    isVehicleNotRegistered: false,

    firstName: user?.firstName,
    lastName: user?.lastName,
    middleName: user?.patronymicName,
    isConfirmed: !!user,
    phone: user?.phone ? withoutCode(user.phone) : undefined,

    drivers: [{ ...driverDefaultValues }],

    email: user?.email,

    registered: true,
    series: '',
    vin: '',
    ptsSeries: '',
    ptsIssuedAt: '',
    insuranceIssuedAt: '',
    isValid: true,
  };

  const form = useMemo(
    () =>
      // TODO: need to add full type of valid form values
      createForm<AvailableUserInfo>({
        onSubmit,
        validate,
        initialValues,
        validateOnBlur: true,
        mutators: { ...arrayMutators } as any,
      }),
    [],
  );

  useEffect(() => {
    if (user.phone) {
      form.change('phone', user.phone.replace(/^(\+?7)|8/, ''));
      form.change('firstName', user.firstName);
      form.change('lastName', user.lastName);
      form.change('middleName', user.patronymicName);
      form.change('email', user.email);
      form.focus('phone');
    }
  }, [user]);

  return (
    <Form onSubmit={onSubmit} subscription={{ submitting: true }} form={form} decorators={[focusOnError as any]}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Fieldset disabled={loading || !!disabled}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <MainBlock />
              </Grid>
              <Grid item>
                <Grid container spacing={2} justify="space-between" className={s.subtitle}>
                  <Grid item>
                    <Typography variant="body1">
                      <b>Контактные данные страхователя</b>
                    </Typography>
                  </Grid>
                  <Grid item />
                </Grid>
              </Grid>
              <Grid item>
                <UserBlock />
              </Grid>
              {isUserAuthorized && (
                <>
                  <Grid item>
                    <Grid
                      container
                      spacing={2}
                      justify="space-between"
                      className={s.subtitle}
                      direction={isMobile ? 'column' : 'row'}
                    >
                      <Grid item>
                        <Typography variant="body1">
                          <b>Страхователь</b>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Checkbox name="isInsurantOwner" color="primary" label="Страхователь является собственником" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <PersonBlock hideInitials prefix="insurant" />
                  </Grid>
                  <Field name="isInsurantOwner" subscription={{ value: true }}>
                    {({ input: { value } }) =>
                      value === false ? (
                        <>
                          <Grid item>
                            <Grid container spacing={2} justify="space-between" className={s.subtitle}>
                              <Grid item>
                                <Typography variant="body1">
                                  <b>Собственник</b>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <PersonBlock hideInitials={false} prefix="owner" />
                          </Grid>
                        </>
                      ) : null
                    }
                  </Field>
                  <Field name="insuranceType" subscription={{ value: true }}>
                    {({ input: { value } }) => (value === INSURANCE_DRIVERS_COUNT.SEVERAL ? <DriversBlock /> : null)}
                  </Field>
                  <Grid item>
                    <Grid container spacing={2} justify="space-between" className={s.subtitle}>
                      <Grid item>
                        <Typography variant="body1">
                          <b>Дополнительные данные по автомобилю</b>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Checkbox
                          name="isVehicleNotRegistered"
                          color="primary"
                          label="Автомобиль не поставлен на учет"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <AdvancedBlock />
                  </Grid>
                  <Grid item>
                    <EmailBlock />
                  </Grid>
                  <Grid item>
                    <Grid container spacing={3}>
                      <Grid item className={s.buttonWrapper}>
                        {handleReset ? (
                          <ButtonAdvanced
                            className={s.button}
                            color="primary"
                            variant="contained"
                            size="large"
                            onClick={handleReset}
                            fullWidth={isMobile}
                          >
                            Создать новую заявку
                          </ButtonAdvanced>
                        ) : (
                          <ButtonAdvanced
                            className={s.button}
                            color="primary"
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading}
                            loading={loading}
                            fullWidth={isMobile}
                          >
                            Получить предложения
                          </ButtonAdvanced>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Fieldset>
        </form>
      )}
    </Form>
  );
};

export { InsuranceForm };
