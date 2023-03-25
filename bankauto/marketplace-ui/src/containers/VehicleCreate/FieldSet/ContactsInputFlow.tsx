import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ValidationError } from 'yup';
import { Field, FieldRenderProps, useField, useForm, useFormState } from 'react-final-form';
import { Grid, InputPhone, InputBase, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { PhoneConfirmationCode, PhoneConfirmationSend } from 'components/FieldsConfirmation';
import { SelectNew as Select } from 'components/Fields';
import { capitalizeInputValueWC } from 'helpers/capitalizeInputValue';
import { setCookieConfirmationToken } from 'helpers/authCookies';
import { resendAuthSms, sendAuthSms } from 'api/auth';
import { VehicleFormSellValues, VehicleFormSellValuesContacts } from 'types/VehicleFormType';
import { sendVerifyPhoneCode } from 'api/profile';
import { authenticateAndRegister } from 'store/user';
import { useFormVehicleContext } from 'containers/VehicleCreate/FormContext';
import { RegistrationTypes } from 'types/Authentication';
import { AuthenticationSchema, RegistrationSchema } from './schema';

const ContactsSchema = RegistrationSchema.concat(AuthenticationSchema);

const hours = new Array(23)
  .fill({ label: '', value: 0 })
  .map((item, index) => ({ label: `${index + 1}:00`, value: index + 1 }));

const ContactsRequiredFields = ['phone', 'firstName', 'email'];

const IsAuthorizedField = ({
  input: { value, onChange, ...input },
  meta: { error, touched },
}: FieldRenderProps<number, HTMLInputElement>) => {
  return (
    <>
      <input type="hidden" value={value} {...input} />
      {error && touched ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : null}
    </>
  );
};

const ConfirmationFields = () => {
  const { isMobile } = useBreakpoints();
  const dispatch = useDispatch();
  const {
    input: { value: isAuthorized },
  } = useField('authSuccess', { subscription: { value: true } });

  const form = useForm<VehicleFormSellValuesContacts>();
  const { errors, touched } = useFormState<VehicleFormSellValues>({ subscription: { errors: true, touched: true } });

  const hasErrors = useMemo(() => {
    return !!ContactsRequiredFields.find((key) => errors && errors[key] && touched && touched[key]);
  }, [errors, touched]);

  const [sent, setSent] = useState<{ error?: string; isSent: boolean }>({ isSent: false });
  const [confirm, setConfirm] = useState<{ isSent: boolean; error?: string; loading: boolean }>({
    loading: false,
    isSent: false,
  });

  const handleSend = useCallback(() => {
    const {
      values: { phone, firstName, email },
    } = form.getState();
    setConfirm({ isSent: false, loading: false });
    ContactsSchema.validate({ phone, firstName, email }, { abortEarly: false })
      .then(() => {
        const smsRequest = sent.isSent ? sendAuthSms(phone!) : resendAuthSms();

        smsRequest
          .then(({ data: { token, ttl } }) => {
            setCookieConfirmationToken(token, ttl);
            setSent({ isSent: true });
          })
          .catch((error) => {
            setSent({ isSent: false, error: error.response?.data?.detail?.phone[0] || error.message });
          });
      })
      .catch((e: ValidationError) => {
        const errorKeys = e.inner.map((i) => i.path);
        if (form.mutators.setFieldTouched) {
          form.mutators.setFieldTouched(errorKeys);
        }
      });
  }, [form, setSent, setConfirm]);

  const handleResend = useCallback(() => {
    setConfirm({ isSent: false, loading: false });
    const {
      values: { phone },
    } = form.getState();
    sendVerifyPhoneCode(phone || '');
  }, [form, setConfirm]);

  const confirmSms = useCallback(
    (value: string) => {
      setConfirm({ isSent: true, loading: true });

      const {
        values: { phone, firstName, email },
      } = form.getState();

      dispatch(
        authenticateAndRegister({
          phone: phone!,
          code: value,
          firstName: firstName!,
          email: email || undefined,
          regType: RegistrationTypes.VEHICLE_C2C,
        }),
      ).catch((e: Error) => {
        setConfirm({ isSent: true, loading: false, error: e.message });
      });
    },
    [dispatch, form],
  );

  return (
    <>
      <Grid container spacing={isMobile ? 1 : 4} alignItems="center">
        {sent.isSent && !sent.error && !isAuthorized ? (
          <Grid item md={6} xs={12}>
            <PhoneConfirmationCode
              key="code"
              name="code"
              variant="outlined"
              handleConfirm={confirmSms}
              isConfirmed={false}
              error={confirm.error}
              loading={confirm.loading}
            />
          </Grid>
        ) : null}
        {!isAuthorized ? (
          <Grid item md={6} xs={12}>
            <PhoneConfirmationSend
              handleSend={handleSend}
              handleResend={handleResend}
              key="send"
              isSent={sent.isSent}
              error={sent.error}
              isConfirmed={false}
              disabled={hasErrors}
            />
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};

export const VehicleContactsFieldSet: FC = memo(() => {
  const { isMobile } = useBreakpoints();
  const { id: isEdition } = useFormVehicleContext();
  const {
    input: { value: isAuthorized },
  } = useField('authSuccess', { subscription: { value: true } });
  return (
    <Grid container spacing={isMobile ? 1 : 4}>
      <Grid item sm={4} xs={12}>
        <Field name="phone">
          {({ input, meta }) => (
            <InputPhone
              label="Телефон"
              placeholder="+7"
              variant="outlined"
              error={meta.touched && !!meta.error}
              name={input.name}
              value={input.value}
              onBlur={input.onBlur}
              onChange={input.onChange}
              disabled={!!isAuthorized}
            />
          )}
        </Field>
      </Grid>
      <Grid item sm={8} xs={12}>
        <ConfirmationFields />
        <Field name="authSuccess" component={IsAuthorizedField} />
      </Grid>
      <Grid item sm={4} xs={12}>
        <Field name="firstName" parse={capitalizeInputValueWC}>
          {({ input, meta }) => (
            <InputBase
              label="Имя"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
              name={input.name}
              value={input.value}
              onBlur={input.onBlur}
              onChange={input.onChange}
              disabled={!!isEdition}
            />
          )}
        </Field>
      </Grid>
      <Grid item sm={4} xs={12}>
        <Grid container spacing={isMobile ? 1 : 2}>
          <Grid item xs={6}>
            <Select name="meetFrom" placeholder="С" variant="outlined" options={hours} />
          </Grid>
          <Grid item xs={6}>
            <Select name="meetTo" placeholder="По" variant="outlined" options={hours} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={4} xs={12}>
        <Field name="email">
          {({ input, meta }) => (
            <InputBase
              label="Email"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
              InputProps={{
                endAdornment: (
                  <Typography variant="caption" color="textSecondary">
                    Необязательно
                  </Typography>
                ),
              }}
              disabled={!!isEdition}
              {...input}
            />
          )}
        </Field>
      </Grid>
    </Grid>
  );
});
