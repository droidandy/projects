import React, { FC, useState, useEffect } from 'react';
import cx from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@marketplace/ui-kit';
import { generate } from 'shortid';
import { AuthSteps } from 'types/Authentication';
import { actions as userActions, authenticateUser, selectUser } from 'store/user';
import { ModalLight } from 'components/ModalLight';
import { AuthForm } from 'components/AuthForm';
import { AuthFormData } from 'types/AuthFormData';
import { addFlashMessage } from 'store';
import { SuccessModal } from './SuccessModal';
import { useStyles } from './AuthenticationContainerC2C.styles';

export const AuthenticationContainerC2C: FC = () => {
  const s = useStyles();
  const dispatch = useDispatch();
  const { isAuthorized, phone, authModalC2COpen } = useSelector(selectUser);
  const { changeAuthModalC2CVisibility, removeOnAuthRedirect } = userActions;
  const [codeError, setCodeError] = useState('');

  useEffect(() => {
    dispatch(removeOnAuthRedirect());
  }, []);

  const handleOpened = (val: boolean) => {
    dispatch(changeAuthModalC2CVisibility(val));
  };

  const handleClose = () => {
    dispatch(changeAuthModalC2CVisibility(false));
  };

  const login = ({ phone: loginPhone, code }: AuthFormData) => {
    dispatch(authenticateUser(loginPhone, code))
      .then(() => {
        localStorage.removeItem('timeoutResetTime');
      })
      .catch((error: Error) => {
        setCodeError(error.message);
      });
  };

  const handleError = (message: string) => {
    dispatch(
      addFlashMessage({
        message,
        success: false,
        id: generate(),
      }),
    );
  };

  const showSuccessModal = isAuthorized && phone;

  return (
    <ModalLight
      key="authC2C"
      isOpen={authModalC2COpen}
      handleOpened={handleOpened}
      onClose={handleClose}
      showCloseIcon={!showSuccessModal}
      classes={{ root: cx({ [s.root]: showSuccessModal }) }}
    >
      {showSuccessModal ? (
        <SuccessModal onClose={handleClose} />
      ) : (
        <div>
          <div className={s.textWrapper}>
            <Typography component="pre" variant="h5">
              {'Подтвердите указанный номер\nс помощью SMS-кода'}
            </Typography>
          </div>

          <AuthForm
            authStep={AuthSteps.PHONE_CONFIRMATION}
            setAuthStep={() => {}}
            handleSubmitForm={login}
            codeError={codeError}
            handleError={handleError}
            phoneFromRedux={phone}
            shouldAutoSendSms={true}
            phoneEditable={false}
          />
        </div>
      )}
    </ModalLight>
  );
};
