import React from 'react';
import { Formik, FormikErrors } from 'formik';
import { ReactComponent as IconRefresh } from 'icons/iconRefresh.svg';
import { FormProps } from 'types/FormProps';
import { Button, Typography, InputPhone, Box, Icon } from '@marketplace/ui-kit';
import { AuthFormData } from 'types/AuthFormData';
import PhoneConfirmationCode from 'components/Inputs/PhoneConfirmationCode';
import { getUser } from 'api/remont';
import { useQueryClient } from 'react-query';
import { addSeconds, format } from 'date-fns';
import { ReactComponent as IconPencilSimple } from 'icons/PencilSimple.svg';
import { useStyles } from './SmsForm.styles';
import { SmsFormSchema } from './SmsForm.schema';

interface Props extends FormProps {
  handleSubmitForm: (values: { code: string; phone: any; token: any }) => void;
  phoneFromRedux?: string;
  codeError?: string;
  shouldAutoSendSms?: boolean;
  phoneEditable?: boolean;
}

const getTimerValue = (time: number) => {
  const date = addSeconds(new Date(0), time);
  return format(date, 'mm:ss');
};

export const SmsForm = ({
  validationErrors,
  handleSubmitForm,
  phoneFromRedux,
  shouldAutoSendSms = false,
  phoneEditable = true,
  codeError,
}: Props) => {
  const registerInitialValues = {
    phone: phoneFromRedux || '',
    code: '',
  };
  const s = useStyles();
  const queryClient = useQueryClient();
  const storedResetTime = Number(localStorage.getItem('smstimeoutResetTime'));
  const storedPhone = localStorage.getItem('smsstoredRegPhone');
  const [token, setToken] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [smsSent, setSmsSent] = React.useState(!!storedResetTime && Date.now() < storedResetTime);
  const [timeLeft, setTimeLeft] = React.useState(
    storedResetTime && Date.now() ? Math.ceil((storedResetTime - Date.now()) / 1000) : 0,
  );
  const [resetTime, setResetTime] = React.useState(
    storedResetTime && Date.now() < storedResetTime ? storedResetTime : 0,
  );
  let errors: FormikErrors<AuthFormData> = {};

  React.useEffect(() => {
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

  const handleSendSms = React.useCallback(async (phone = '') => {
    setLoading(true);

    try {
      const responce = await queryClient.fetchQuery(['user phone', { phone: phone.substring(1) }], () =>
        getUser(phone.substring(1)),
      );
      setToken((responce as any)?.data?.token);
      setSmsSent(true);
      setLoading(false);
      const timeoutResetTime = Date.now() + 120 * 1000;
      localStorage.setItem('smstimeoutResetTime', timeoutResetTime.toString());
      localStorage.setItem('smsstoredRegPhone', phone);
      setResetTime(timeoutResetTime);
      setTimeLeft(120);
    } catch (error) {
      setToken(null);
      setLoading(false);
    }
  }, []);

  const backToFirstStep = () => {
    setSmsSent(false);
    localStorage.removeItem('smstimeoutResetTime');
    localStorage.removeItem('smsstoredRegPhone');
  };

  React.useEffect(() => {
    if (shouldAutoSendSms && phoneFromRedux) handleSendSms(phoneFromRedux);
  }, [handleSendSms, phoneFromRedux]);

  return (
    <Formik
      initialValues={registerInitialValues}
      validationSchema={SmsFormSchema}
      onSubmit={
        smsSent
          ? (form) => {
              handleSubmitForm({ ...form, token });
            }
          : ({ phone }) => {
              handleSendSms(phone);
            }
      }
    >
      {({ handleSubmit, handleChange, handleBlur, isValid, dirty, touched, errors: formErrors, values: { phone } }) => {
        errors = { ...validationErrors, ...formErrors };
        const sendSms = () => {
          handleSendSms(phone);
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
                  disabled={!phoneEditable}
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
                    handleSubmitForm({ phone, code: value, token });
                  }}
                />
              )}
            </Box>
            {smsSent ? (
              <Button
                onClick={sendSms}
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
              </>
            )}
          </form>
        );
      }}
    </Formik>
  );
};
