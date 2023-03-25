import React, { FC, memo, useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AuthForm } from 'components/AuthForm';
import { formatPhone, RegistrationForm } from 'components/RegistrationForm';
import {
  actions as userActions,
  authenticateUser,
  changeAuthModalVisibility,
  fireRegistrationCompleteAnalytics,
  getUser,
  selectUser,
} from 'store/user';
import { Pending } from 'helpers/pendings';
import { AuthFormData } from 'types/AuthFormData';
import { generate } from 'shortid';
import { addFlashMessage } from 'store/flash-messages';
import { RegistrationFormData } from 'types/RegistrationFormData';
import { registerUserByPhone } from 'api/auth';
import { FormValidationErrors } from 'types/FormValidationErrors';
import { AuthSteps } from 'types/Authentication';
import { ModalLight } from 'components/ModalLight/ModalLight';
import { useRouter } from 'next/router';
import { authModalTexts } from 'constants/authModalTexts';
import { Box, Typography } from '@marketplace/ui-kit';
import { analyticsAuthFormRegistrationComplete } from 'helpers/analytics/events';
import { DEFAULT_CITY_ID } from 'constants/defaultCity';
import { getCookieImpersonalization } from 'helpers/authCookies';
import { useStyles } from './AuthenticationContainer.styles';

const getModalText = (stepIndex: AuthSteps, phoneNumber = '', title = '', text = '') => {
  switch (stepIndex) {
    case AuthSteps.AUTH:
      return { text, title };
    case AuthSteps.PHONE_CONFIRMATION:
    case AuthSteps.FAVOURITES:
    case AuthSteps.COMPARISON:
    case AuthSteps.TEST_DRIVE:
    case AuthSteps.DEFAULT:
      return authModalTexts[stepIndex];
    case AuthSteps.REGISTRATION:
      return {
        ...authModalTexts[stepIndex],
        text: `Ваш номер телефона ${formatPhone(
          phoneNumber,
        )} подтвержден. \nОсталось указать имя и адрес электронной почты.`,
      };
    default:
      return {
        text,
        title,
      };
  }
};

const AuthenticationContainerRoot: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const s = useStyles();

  const user = useSelector(selectUser);
  const {
    authModalOpen,
    authModalTitle,
    authModalText,
    isAuthorized,
    firstName,
    onAuthRedirect,
    phone,
    callbackApplicationParams,
    authStep,
    additionalButtonText,
    additionalButtonOnClick,
    regType,
    cityId,
    onCloseCallback,
    shouldAutoSendSms,
    phoneEditable,
  } = user;
  const userName = useRef('');

  // Необходимо для заполнения поля с именем в форме регистрации
  useEffect(() => {
    if (firstName) userName.current = firstName;
  }, [firstName]);

  const { setAuthStep: setAuthStepAction, removeStoreApplicationParams, removeOnAuthRedirect } = userActions;
  const modalAdditionalText = React.useMemo(() => {
    return callbackApplicationParams && callbackApplicationParams.acquiringBookingParams ? (
      <>
        Для бронирования на <span className={s.colorMain}>#банкавто:</span>{' '}
      </>
    ) : (
      <>
        Бронирование на <span className={s.colorMain}>#банкавто</span> не требует
        <br />
        предоплаты
      </>
    );
  }, [callbackApplicationParams]);
  const setAuthStep = useCallback(
    (val: AuthSteps) => {
      dispatch(setAuthStepAction(val));
    },
    [dispatch, setAuthStepAction],
  );

  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState('');

  const { text: modalText } = getModalText(authStep, phone, authModalTitle, authModalText);
  const handleCloseAuthModal = useCallback(() => {
    dispatch(changeAuthModalVisibility(false));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(changeAuthModalVisibility(false));
    if (callbackApplicationParams) dispatch(removeStoreApplicationParams());
    onCloseCallback?.(false);
  }, [dispatch, callbackApplicationParams, removeStoreApplicationParams, onCloseCallback]);

  useEffect(() => {
    if (router.pathname === '/impersonalization') {
      return;
    }

    dispatch(getUser(true)).catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (isAuthorized && (firstName || getCookieImpersonalization())) {
      handleCloseAuthModal();
      setAuthStep(AuthSteps.AUTH);
    } else if (isAuthorized && phone) {
      setAuthStep(AuthSteps.REGISTRATION);
    }
  }, [isAuthorized, firstName, handleCloseAuthModal, authStep, phone, setAuthStep]);

  useEffect(() => {
    if (isAuthorized && (firstName || getCookieImpersonalization()) && !authModalOpen && onAuthRedirect) {
      router.push(`${onAuthRedirect}`);
      dispatch(removeOnAuthRedirect());
    }
  }, [router, dispatch, isAuthorized, authModalOpen, firstName, onAuthRedirect, removeOnAuthRedirect]);

  const [registrationErrors, setRegistrationErrors] = useState<FormValidationErrors>({});
  const onRegistrationFormFieldChange = (fieldName: string) => {
    const errors = { ...registrationErrors };
    delete errors[fieldName];
    setRegistrationErrors(errors);
  };

  const handleError = useCallback(
    (message: string) => {
      dispatch(
        addFlashMessage({
          message,
          success: false,
          id: generate(),
        }),
      );
    },
    [dispatch],
  );

  const login = ({ phone: loginPhone, code }: AuthFormData) => {
    dispatch(authenticateUser(loginPhone, code))
      .then(() => {
        localStorage.removeItem('timeoutResetTime');
      })
      .catch((error: Error) => {
        setCodeError(error.message);
      });
  };

  const handleSubmitRegistrationForm = useCallback(
    (data: RegistrationFormData): void => {
      setIsLoading(true);
      setRegistrationErrors({});
      const consentTo = data.acceptSubscription ? 1 : 0;
      Pending(
        'register-user',
        registerUserByPhone(data.name, data.email, cityId || DEFAULT_CITY_ID, consentTo, regType),
      )
        .then(({ data: { uuid } }) => {
          analyticsAuthFormRegistrationComplete();
          dispatch(fireRegistrationCompleteAnalytics(uuid));
          setIsLoading(false);
          dispatch(
            addFlashMessage({
              message: 'Вы были успешно зарегистрированы',
              success: true,
              id: generate(),
            }),
          );
          dispatch(getUser());
          handleCloseAuthModal();
        })
        .catch(({ response }) => {
          setRegistrationErrors(
            response?.data?.reduce((acc: any, { field, message }: { field: string; message: string }) => {
              return { ...acc, [field]: message };
            }, {}),
          );
          handleError('При регистрации произошла ошибка');
          setIsLoading(false);
        });
    },
    [cityId, regType, dispatch, handleCloseAuthModal, handleError],
  );

  const handleOpened = (val: boolean) => {
    changeAuthModalVisibility(val);
  };

  return (
    <ModalLight key="auth" isOpen={authModalOpen} handleOpened={handleOpened} onClose={handleClose}>
      <Box className={s.root}>
        {callbackApplicationParams ? (
          <Box pb={2.5}>
            <Typography variant="h5" component="p">
              {modalAdditionalText}
            </Typography>
          </Box>
        ) : null}
        <Box mb={3.5} mr={2.5}>
          <span className={s.pre}>
            <Typography variant="h5" component="p">
              {modalText}
            </Typography>
          </span>
        </Box>
        {authStep === AuthSteps.REGISTRATION ? (
          <RegistrationForm
            setAuthStep={setAuthStep}
            isLoading={isLoading}
            phone={phone}
            firstName={userName.current}
            handleSubmitForm={handleSubmitRegistrationForm}
            validationErrors={registrationErrors}
            handleFormValueChange={onRegistrationFormFieldChange}
          />
        ) : (
          <AuthForm
            authStep={authStep}
            setAuthStep={setAuthStep}
            handleSubmitForm={login}
            codeError={codeError}
            handleError={handleError}
            additionalButtonText={additionalButtonText}
            additionalButtonOnClick={additionalButtonOnClick}
            phoneFromRedux={phone}
            shouldAutoSendSms={shouldAutoSendSms}
            phoneEditable={phoneEditable}
          />
        )}
      </Box>
    </ModalLight>
  );
};

const AuthenticationContainer = memo(AuthenticationContainerRoot);

export { AuthenticationContainer };
