import React, { useCallback, useState } from 'react';
import { ModalLight } from 'components/ModalLight';
import { useStyles } from './SubscriptionWizardModal.styles';
import { SubscriptionWizardInfoStepContent } from './SubscriptionWizardInfoStepContent';
import { SubscriptionWizardSuccessStepContent } from './SubscriptionWizardSuccessStepContent';
import { createApplicationSubscription } from '../../../../../../../api/lead';
import { useDispatch, useSelector } from 'react-redux';
import { actions as userActions, changeAuthModalVisibility } from '../../../../../../../store/user';
import { AuthSteps, RegistrationTypes } from '../../../../../../../types/Authentication';
import { StateModel } from '../../../../../../../store/types';

type SubscriptionWizardModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  vehicleId: number;
};

enum SubscriptionWizardSteps {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
}

export const SubscriptionWizardModal = ({ isOpen, setIsOpen, vehicleId }: SubscriptionWizardModalProps) => {
  const s = useStyles();

  const { isAuthorized } = useSelector((state: StateModel) => state.user);

  const [step, setStep] = useState<SubscriptionWizardSteps>(SubscriptionWizardSteps.INFO);

  const dispatch = useDispatch();

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setStep(SubscriptionWizardSteps.INFO);
  }, [setIsOpen]);

  const handleCreateApplicationSubscription = useCallback(() => {
    createApplicationSubscription(vehicleId).then(() => {
      setStep(SubscriptionWizardSteps.SUCCESS);
    });
  }, [vehicleId, setStep]);

  const handleUnauthorized = useCallback(() => {
    dispatch(userActions.setAuthStep(AuthSteps.SUBSCRIPTION));
    dispatch(
      changeAuthModalVisibility(true, {
        authModalText:
          'Подписка от #банкавто даст вам комфорт в эксплуатации авто и экономию на платежах\n\nУкажите номер своего телефона, чтобы войти или зарегистрироваться',
        handleOnCloseCallback(isAuth: boolean) {
          if (isAuth) {
            handleCreateApplicationSubscription();
          }
        },
        regType: RegistrationTypes.SUBSCRIPTION,
      }),
    );
  }, [dispatch, handleCreateApplicationSubscription]);

  const handleContinue = useCallback(() => {
    if (!isAuthorized) {
      handleUnauthorized();
      return;
    }

    handleCreateApplicationSubscription();
  }, [setStep, handleUnauthorized, handleCreateApplicationSubscription]);

  return (
    <ModalLight
      isOpen={isOpen}
      handleOpened={setIsOpen}
      onClose={handleCloseModal}
      classes={{
        root: s.root,
      }}
    >
      {step === SubscriptionWizardSteps.INFO && <SubscriptionWizardInfoStepContent onContinue={handleContinue} />}
      {step === SubscriptionWizardSteps.SUCCESS && <SubscriptionWizardSuccessStepContent onClose={handleCloseModal} />}
    </ModalLight>
  );
};
