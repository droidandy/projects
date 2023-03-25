import React, { FC, useEffect, useState, useCallback } from 'react';
import { Formik, FormikErrors } from 'formik';
import { ReactComponent as IconRefresh } from 'icons/iconRefresh.svg';
import { FormProps } from 'types/FormProps';
import { Button, Typography, InputPhone, Box, Icon } from '@marketplace/ui-kit';
import { AuthFormData } from 'types/AuthFormData';
import PhoneConfirmationCode from 'components/Inputs/PhoneConfirmationCode';
import { sendAuthSms, resendAuthSms } from 'api/auth';
import { addSeconds, format } from 'date-fns';
import { AuthSteps } from 'types/Authentication';
import { ReactComponent as IconPencilSimple } from 'icons/PencilSimple.svg';
import { useDispatch } from 'react-redux';
import { saveUserPhone } from 'store/user/actions';
import { analyticsAuthFormSendSms, analyticsAuthFormReSendSms } from 'helpers/analytics/events';
import { useStyles } from './AuthForm.styles';
import { AuthFormSchema } from './AuthForm.schema';
import { clearCookieImpersonalization, setCookieConfirmationToken } from 'helpers/authCookies';

interface Props extends FormProps {
  handleSubmitForm: (values: AuthFormData) => void;
  codeError: string;
  handleError: (message: string) => void;
  authStep: AuthSteps;
  setAuthStep: (val: AuthSteps) => void;
  additionalButtonText?: string;
  additionalButtonOnClick?: () => void;
  phoneFromRedux?: string;
  shouldAutoSendSms?: boolean;
  phoneEditable?: boolean;
}

const getTimerValue = (time: number) => {
  const date = addSeconds(new Date(0), time);
  return format(date, 'mm:ss');
};

export const AuthForm: FC<Props> = ({
  validationErrors,
  handleSubmitForm,
  codeError,
  handleError,
  authStep,
  setAuthStep,
  additionalButtonText,
  additionalButtonOnClick,
  phoneFromRedux,
  shouldAutoSendSms = false,
  phoneEditable = true,
}) => {
  const registerInitialValues = {
    phone: phoneFromRedux || '',
    code: '',
  };
  const s = useStyles();
  const dispatch = useDispatch();
  const storedResetTime = Number(localStorage.getItem('timeoutResetTime'));
  const storedPhone = localStorage.getItem('storedRegPhone');
  const [loading, setLoading] = useState(false);
  const [smsSent, setSmsSent] = useState(!!storedResetTime && Date.now() < storedResetTime);
  const [timeLeft, setTimeLeft] = useState(
    storedResetTime && Date.now() ? Math.ceil((storedResetTime - Date.now()) / 1000) : 0,
  );
  const [resetTime, setResetTime] = useState(storedResetTime && Date.now() < storedResetTime ? storedResetTime : 0);
  let errors: FormikErrors<AuthFormData> = {};

  useEffect(() => {
    let timeout: any;
    if (resetTime && timeLeft) {
      timeout = setTimeout(() => {
        setTimeLeft(resetTime > Date.now() ? Math.ceil((resetTime - Date.now()) / 1000) : 0);
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [resetTime, timeLeft]);

  const resendTimer = getTimerValue(timeLeft);

  const handleSendSms = useCallback(
    (phone = '') => {
      setLoading(true);
      dispatch(saveUserPhone(phone));
      clearCookieImpersonalization();

      const smsRequest = phone ? sendAuthSms(phone) : resendAuthSms();

      smsRequest
        .then(({ data: { token, retryTimeout, ttl } }) => {
          setCookieConfirmationToken(token, ttl);
          setSmsSent(true);
          setAuthStep(AuthSteps.PHONE_CONFIRMATION);
          setLoading(false);
          const timeoutResetTime = Date.now() + retryTimeout * 1000;
          localStorage.setItem('timeoutResetTime', timeoutResetTime.toString());
          localStorage.setItem('storedRegPhone', phone);
          setResetTime(timeoutResetTime);
          setTimeLeft(retryTimeout);
        })
        .catch(() => {
          handleError('Произошла ошибка при отправке SMS-кода.');
          setLoading(false);
        });
    },
    [dispatch, handleError, setAuthStep],
  );

  const backToFirstStep = () => {
    setSmsSent(false);
    localStorage.removeItem('timeoutResetTime');
    localStorage.removeItem('storedRegPhone');
    setAuthStep(AuthSteps.DEFAULT);
  };

  useEffect(() => {
    if (shouldAutoSendSms && phoneFromRedux) handleSendSms(phoneFromRedux);
  }, [handleSendSms, phoneFromRedux]);

  return (
    <Formik
      initialValues={registerInitialValues}
      validationSchema={AuthFormSchema}
      onSubmit={
        smsSent
          ? handleSubmitForm
          : ({ phone }) => {
              handleSendSms(phone);
            }
      }
    >
      {({ handleSubmit, handleChange, handleBlur, isValid, dirty, touched, errors: formErrors, values: { phone } }) => {
        errors = { ...validationErrors, ...formErrors };
        const sendSms = () => {
          analyticsAuthFormSendSms();
          handleSendSms(phone);
        };
        const reSendSms = () => {
          analyticsAuthFormReSendSms();
          handleSendSms();
        };
        const isDirty = phoneFromRedux ? true : dirty;
        return (
          <form onSubmit={handleSubmit} className={s.root}>
            <Box mb={5}>
              <Box position="relative">
                <InputPhone
                  key="phone"
                  area="phone"
                  name="phone"
                  variant="standard"
                  disabled={(!!phoneFromRedux && authStep !== AuthSteps.DEFAULT) || !phoneEditable}
                  error={!!touched.phone && !!errors.phone}
                  helperText={touched.phone ? errors.phone : undefined}
                  value={!!storedResetTime && Date.now() < storedResetTime ? storedPhone : phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  inputProps={{
                    readOnly: smsSent,
                  }}
                />
                {smsSent && phoneEditable && (
                  <div role="button" tabIndex={-1} onClick={backToFirstStep} className={s.editPhoneIcon}>
                    <Icon viewBox="0 0 24 24" component={IconPencilSimple} style={{ fill: 'none' }} />
                  </div>
                )}
              </Box>
              {smsSent && (
                <PhoneConfirmationCode
                  variant="standard"
                  key="code"
                  area="code"
                  name="code"
                  error={codeError}
                  handleConfirm={(value) => {
                    handleSubmitForm({ phone, code: value });
                  }}
                />
              )}
            </Box>
            {smsSent ? (
              <Button
                onClick={reSendSms}
                className={s.resendCodeButton}
                disabled={timeLeft !== 0 || loading}
                size="small"
                color="secondary"
              >
                <Typography color={timeLeft !== 0 || loading ? 'textSecondary' : 'primary'} className={s.resendCode}>
                  <IconRefresh className={s.refreshIcon} /> Отправить SMS-код повторно{' '}
                </Typography>
                {timeLeft !== 0 && <Typography color="textPrimary">{resendTimer}</Typography>}
              </Button>
            ) : (
              <>
                <Button
                  disabled={!isDirty || !isValid || loading}
                  type="button"
                  onClick={sendSms}
                  variant="contained"
                  size="large"
                  className={s.authButton}
                  color="primary"
                >
                  <Typography variant="h5" component="span">
                    Получить SMS-код
                  </Typography>
                </Button>
                {additionalButtonText && (
                  <Box pt="1.25rem" fontWeight="700">
                    <Button
                      type="button"
                      onClick={additionalButtonOnClick}
                      variant="outlined"
                      size="large"
                      color="primary"
                      fullWidth
                    >
                      {additionalButtonText}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </form>
        );
      }}
    </Formik>
  );
};
