import React, { FC, useState, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputGroup from '@marketplace/ui-kit/components/InputGroup';
import { useBreakpoints } from '@marketplace/ui-kit';
import { RegisterByPhoneFormValues } from 'types/Registration';
import PhoneConfirmationCode from 'components/Inputs/PhoneConfirmationCode';
import PhoneConfirmationSend from 'components/Inputs/PhoneConfirmationSend';
import { quickRegistration } from 'api/auth';
import { sendVerifyPhoneCode } from 'api/profile';
import { verifyPhone, fireRegistrationCompleteAnalytics } from 'store/user';
import { Input } from 'components/Fields';
import { useField } from 'react-final-form';
import { PHONE_INPUT_FORMAT } from 'constants/inputFormats';
import { StateModel } from 'store/types';
import { analyticsInsuranceSendSms } from 'helpers/analytics/events/analyticsInsuranceSendSms';
import { useLayoutEffect } from 'hooks/useLayoutEffectPoly';

interface SmsConfirmation {
  phone: string;
}

type RegisterUser = (values: RegisterByPhoneFormValues) => Promise<string | null | void>;
const registerUser: RegisterUser = async (values) => {
  const { firstName, lastName, middleName, phone } = values;
  if (firstName && lastName && middleName && phone) {
    return quickRegistration(firstName, lastName, middleName, `7${phone}`).then(() => {
      return phone;
    });
  }
  return Promise.resolve(null);
};

const capitalizeInputValue = (value: string) => {
  return value.replace(/(?:^|\s)./g, (letter) => letter.toUpperCase());
};

const FIELD_SUBSCRIPTION = { value: true, valid: true, touched: true };

const UserBlock: FC = () => {
  const { isMobile } = useBreakpoints();
  const dispatch = useDispatch();
  const user = useSelector((state: StateModel) => state.user);
  const authSuccess = useMemo(() => user?.isAuthorized, [user]);

  const [sent, setSent] = useState<Partial<SmsConfirmation> & { error?: string; isSent: boolean }>({
    isSent: false,
  });
  const [confirm, setConfirm] = useState<{ isSent: boolean; error?: string; loading: boolean }>({
    loading: false,
    isSent: false,
  });

  const firstValidValues = useRef<any>({});

  const lastNameField = useField('lastName', { subscription: FIELD_SUBSCRIPTION });
  const firstNameField = useField('firstName', { subscription: FIELD_SUBSCRIPTION });
  const middleNameField = useField('middleName', { subscription: FIELD_SUBSCRIPTION });
  const phoneField = useField('phone', { subscription: FIELD_SUBSCRIPTION });

  const isValid =
    lastNameField.meta.valid &&
    firstNameField.meta.valid &&
    middleNameField.meta.valid &&
    phoneField.meta.valid &&
    lastNameField.meta.touched &&
    firstNameField.meta.touched &&
    middleNameField.meta.touched &&
    phoneField.meta.touched;

  useLayoutEffect(() => {
    if (isValid) {
      firstValidValues.current = {
        lastName: lastNameField.input.value,
        firstName: firstNameField.input.value,
        middleName: middleNameField.input.value,
        phone: phoneField.input.value,
      };
    }
  }, [isValid]);

  const handleSend = useCallback(() => {
    analyticsInsuranceSendSms();
    setConfirm({ isSent: false, loading: false });
    if (sent.isSent && phoneField.input.value) {
      // resend sms
      sendVerifyPhoneCode(`+7${phoneField.input.value}`);
    } else if (isValid) {
      registerUser(firstValidValues.current as RegisterByPhoneFormValues)
        .then((sentPhone) => {
          if (sentPhone) {
            setSent({ phone: sentPhone, isSent: true });
          }
        })
        .catch((error) => {
          setSent({ isSent: true, error: error.response?.data?.detail?.phone[0] || error.message });
        });
    }
  }, [isValid, phoneField.input.value, sent.isSent]);

  const confirmSms = useCallback(
    (value: string) => {
      if (sent.phone) {
        setConfirm({ isSent: true, loading: true });
        dispatch(
          verifyPhone(sent.phone, value, (error?: Error) => {
            setConfirm({ isSent: true, loading: false, error: error?.message });
            dispatch(fireRegistrationCompleteAnalytics());
          }),
        );
      }
    },
    [dispatch, sent, setConfirm],
  );

  const areas = useMemo(
    () => [
      ['lastName', 'firstName', 'middleName'],
      authSuccess ? ['phone', '.', '.'] : ['phone', sent.isSent ? 'code' : 'send', 'send'],
    ],
    [sent, authSuccess],
  );
  const areasMobile = useMemo(() => {
    const items = [['lastName'], ['firstName'], ['middleName'], ['phone']];

    if (sent.isSent && !sent.error && !authSuccess) {
      items.push(['code']);
    }

    if (!authSuccess) {
      items.push(['send']);
    }

    return items;
  }, [sent, authSuccess]);

  return (
    <InputGroup templateAreas={isMobile ? areasMobile : areas}>
      <Input variant="outlined" area="lastName" placeholder="Фамилия" name="lastName" parse={capitalizeInputValue} />
      <Input variant="outlined" area="firstName" placeholder="Имя" name="firstName" parse={capitalizeInputValue} />
      <Input
        variant="outlined"
        area="middleName"
        placeholder="Отчество"
        name="middleName"
        parse={capitalizeInputValue}
      />
      <Input
        variant="outlined"
        area="phone"
        placeholder="Мобильный телефон"
        name="phone"
        mask={PHONE_INPUT_FORMAT}
        disabled={authSuccess}
      />
      {sent.isSent && !sent.error && !authSuccess ? (
        <PhoneConfirmationCode
          area="code"
          name="code"
          handleConfirm={confirmSms}
          isConfirmed={false}
          error={confirm.error}
          loading={confirm.loading}
          // disabled={!sent.phone || !!sent.error}
        />
      ) : null}
      {!authSuccess ? (
        <PhoneConfirmationSend
          handleSend={handleSend}
          area="send"
          isSent={sent.isSent}
          error={sent.error}
          isConfirmed={false}
          disabled={!isValid}
        />
      ) : null}
    </InputGroup>
  );
};

export default UserBlock;
