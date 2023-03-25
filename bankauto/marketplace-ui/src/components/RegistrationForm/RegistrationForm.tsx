import React, { FC, useEffect, ChangeEvent } from 'react';
import { Formik, FormikErrors } from 'formik';
import { Button, Checkbox, Input, InputPhone } from '@marketplace/ui-kit';
import { FormProps } from 'types/FormProps';
import { RegistrationFormData } from 'types/RegistrationFormData';
import { AuthSteps } from 'types/Authentication';
import { ReactComponent as IconSuccess } from 'icons/iconSuccess.svg';
import { capitalizeInputValue } from 'helpers/capitalizeInputValue';
import { licenseDocumentsLinks } from 'constants/licenseDocumentsLinks';
import { useStyles } from './RegistrationForm.styles';
import { RegistrationFormSchema } from './RegistrationForm.schema';

const REGISTER_INITIAL_VALUES = {
  email: '',
  acceptTerms: true,
  acceptSubscription: true,
};

interface Props extends FormProps {
  handleSubmitForm: (values: RegistrationFormData) => void;
  phone: string;
  firstName: string;
  isLoading: boolean;
  setAuthStep: (val: AuthSteps) => void;
  handleFormValueChange: (val: string) => void;
}

export const formatPhone = (phone: string) =>
  `${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)}-${phone.slice(8, 10)}-${phone.slice(10)}`;

const RegistrationForm: FC<Props> = ({
  validationErrors,
  handleSubmitForm,
  phone,
  firstName,
  isLoading,
  setAuthStep,
  handleFormValueChange,
}) => {
  const s = useStyles();
  let errors: FormikErrors<RegistrationFormData> = {};

  useEffect(() => {
    setAuthStep(AuthSteps.REGISTRATION);
  }, [setAuthStep]);

  const onFomValueChange =
    (callback: (e: ChangeEvent<HTMLInputElement>) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      handleFormValueChange(name);
      callback(e);
    };

  return (
    <Formik
      initialValues={{ ...REGISTER_INITIAL_VALUES, name: firstName }}
      validationSchema={RegistrationFormSchema}
      onSubmit={handleSubmitForm}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        isValid,
        dirty,
        touched,
        errors: formErrors,
        setFieldValue,
        values: { name, email, acceptTerms, acceptSubscription },
      }) => {
        errors = { ...validationErrors, ...formErrors };

        return (
          <form onSubmit={handleSubmit} className={s.root}>
            <div data-area="phone" key="phone" className={s.phoneWrapper}>
              <InputPhone
                name="phone"
                variant="standard"
                value={formatPhone(phone)}
                InputProps={{
                  readOnly: true,
                }}
              />
              <IconSuccess className={s.successIcon} />
            </div>
            <Input
              key="name"
              area="name"
              placeholder="Имя"
              name="name"
              variant="standard"
              error={!!touched.name && !!errors.name}
              helperText={touched.name ? errors.name : undefined}
              value={name}
              handleChange={onFomValueChange(capitalizeInputValue(handleChange))}
              handleBlur={handleBlur}
            />
            <Input
              key="email"
              type="text"
              label="Email"
              placeholder="Email"
              variant="standard"
              name="email"
              onChange={onFomValueChange(handleChange)}
              onBlur={handleBlur}
              value={email}
              error={!!errors.email && !!touched.email}
              helperText={errors.email}
            />
            <div className={s.checkboxes}>
              <Checkbox
                label={
                  <div>
                    Я принимаю
                    <a href={licenseDocumentsLinks.agreement} rel="noreferrer" target="_blank">
                      {' '}
                      условия{' '}
                    </a>
                    использования сервиса bankauto.ru и
                    <a href={licenseDocumentsLinks.personalData} rel="noreferrer" target="_blank">
                      {' '}
                      политику{' '}
                    </a>
                    обработки персональных данных ПАО «РГС Банк»
                  </div>
                }
                checked={acceptTerms}
                onChange={(e, value) => setFieldValue('acceptTerms', value)}
                className={s.checkbox}
              />
              <Checkbox
                label="Хочу быть в курсе выгодных предложений bankauto.ru"
                checked={acceptSubscription}
                onChange={(e, value) => setFieldValue('acceptSubscription', value)}
                className={s.checkbox}
              />
            </div>
            <Button
              disabled={isLoading || (!firstName && !dirty) || !isValid}
              type="submit"
              variant="contained"
              size="large"
              color="primary"
              className={s.authButton}
            >
              Зарегистрироваться
            </Button>
          </form>
        );
      }}
    </Formik>
  );
};

export { RegistrationForm };
