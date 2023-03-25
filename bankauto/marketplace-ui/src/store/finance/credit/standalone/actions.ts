import {
  addAdditionalInfoSimpleCredit,
  addBasicInfoSimpleCredit,
  addEmploymentInfoSimpleCredit,
  bindUserAndApplication,
  createSimpleCredit,
  updateSimpleCreditStepsData,
} from 'api/application';
import { checkIsRegisteredUser } from 'api/auth';
import { actions as userActions, changeAuthModalVisibility } from 'store/user';
import { authModalTexts } from 'constants/authModalTexts';
import { CreditPurpose } from 'types/CreditPurpose';
import { AsyncAction } from 'types/AsyncAction';
import { Pending } from 'helpers/pendings';
import { getLeadInfo } from 'helpers/cookies';
import { StateError } from 'store/types';
import { SimpleCreditStep, SimpleCreditStepsData } from 'containers/Finance/Credit/types/CreditFormTypes';
import { PersonalData, EmploymentData, AdditionalData, PassportAndAddressData } from 'types/CreditFormDataTypes';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';
import { Condition } from 'containers/Finance/Credit/types/Condition';
import { SimpleCreditSubtype } from '@marketplace/ui-kit/types';
import { fireCreditBDAAnalytics } from 'helpers/analytics';
import { CONDITION_ANALYTICS_MAP } from 'containers/Finance/Credit/constants/conditions';
import { actions } from './reducers';
import {
  additionalDataMapper,
  creditCreateMapper,
  creditMainInfoMapper,
  employmentDataMapper,
  getStepsMappedData,
} from './mappers';
import { getCookieImpersonalization } from 'helpers/authCookies';

export function sendCreditStepsData(step: number, payload: SimpleCreditStepsData): AsyncAction {
  return async function (dispatch, getState) {
    const {
      application: {
        container: { uuid: simpleCreditUuid },
        simpleCredit: { id: simpleCreditId },
      },
      financeCreditStandalone: { id, uuid },
    } = getState();

    if (!id && !simpleCreditId) {
      dispatch(actions.setError(new Error('No credit id')));
      return;
    }

    try {
      await Pending(
        'updateSimpleCreditStepsData',
        updateSimpleCreditStepsData(
          simpleCreditId || id!,
          simpleCreditUuid || uuid!,
          getStepsMappedData(step, payload),
        ),
      );
    } catch (error) {
      console.error(error);
      dispatch(actions.setError(error as StateError));
    }
  };
}

export function fireStepAnalytics(step: number, category: string): AsyncAction {
  return function (dispatch, getState) {
    const { user } = getState();

    fireCreditBDAAnalytics(category, step, user.uuid);
  };
}

export function createCreditApplication(
  isAuto: boolean,
  lastCondition: Condition,
  stepsData: SimpleCreditStepsData,
): AsyncAction {
  return async function (dispatch, getState) {
    const {
      financeCreditStandalone: { amount, term, vehiclePrice, initialPayment, monthlyPayment, rate },
    } = getState();
    const sum = isAuto ? vehiclePrice - initialPayment : amount;
    let subtype: SimpleCreditSubtype;
    switch (lastCondition) {
      case Condition.AUTHORIZED_DEALER:
        subtype = SimpleCreditSubtype.VEHICLE_NEW;
        break;
      case Condition.C2C:
        subtype = SimpleCreditSubtype.VEHICLE_USED_C2C;
        break;
      default:
        subtype = SimpleCreditSubtype.JUST_MONEY;
    }
    try {
      const {
        data: { id, uuid },
      } = await createSimpleCredit(
        creditCreateMapper({
          amount: sum,
          subtype,
          term,
          monthlyPayment,
          rate,
          vehiclePrice: isAuto ? vehiclePrice : 0,
          initialPayment: isAuto ? initialPayment : 0,
        }),
      );
      dispatch(actions.setCreditId({ id, uuid }));
      if (!id) {
        dispatch(actions.setError(new Error('No credit id')));
        return;
      }
      await dispatch(sendCreditStepsData(SimpleCreditStep.Passport, stepsData));
      await dispatch(fireStepAnalytics(SimpleCreditStep.Passport, CONDITION_ANALYTICS_MAP[lastCondition]));
      dispatch(actions.setLoading(false));
      dispatch(actions.setCreditStep(SimpleCreditStep.Passport));
    } catch (error) {
      console.error(error);
      dispatch(actions.setError(error as StateError));
    }
  };
}

const getRegistrationType = (lastCondition: Condition) => {
  switch (lastCondition) {
    case Condition.AUTHORIZED_DEALER:
      return RegistrationTypes.CREDIT_NEW;
    case Condition.JUST_MONEY:
      return RegistrationTypes.CREDIT;
    case Condition.C2C:
      return RegistrationTypes.CREDIT_C2C;
    default:
      return undefined;
  }
};

function showModal(stepsData: SimpleCreditStepsData, isAuto: boolean, lastCondition: Condition): AsyncAction {
  return async function (dispatch) {
    const personalData = stepsData[SimpleCreditStep.Personal];
    dispatch(userActions.setUserPhone(`+7${(personalData as PersonalData).phone}`));
    dispatch(userActions.setAuthStep(AuthSteps.SUGGEST));
    dispatch(
      changeAuthModalVisibility(true, {
        authModalTitle: '',
        authModalText: authModalTexts[AuthSteps.SUGGEST].text,
        additionalButtonText: 'Продолжить без подтверждения',
        handleOnCloseCallback: () => {
          dispatch(createCreditApplication(isAuto, lastCondition, stepsData));
        },
        additionalButtonOnClick: () => {
          dispatch(userActions.setUserPhone(''));
          dispatch(changeAuthModalVisibility(false));
          dispatch(actions.setUserSkippedAuth(true));
        },
        regType: getRegistrationType(lastCondition),
      }),
    );
  };
}

export function sumbitCreditFirstStep(
  stepsData: SimpleCreditStepsData,
  isAuto: boolean,
  lastCondition: Condition,
): AsyncAction {
  return async function (dispatch, getState) {
    const { user } = getState();
    dispatch(actions.setLoading(true));
    const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());
    /* Если пользователь авторизован отправляем заявку, иначе проверяем зарегистрирован ли он в системе */
    if (isAuthorized) {
      dispatch(createCreditApplication(isAuto, lastCondition, stepsData));
    } else {
      try {
        const personalData = stepsData[SimpleCreditStep.Personal];
        const leadInfo = getLeadInfo() || undefined;
        const {
          data: { isPhoneVerified },
        } = await checkIsRegisteredUser(personalData as PersonalData, getRegistrationType(lastCondition), leadInfo);
        if (isPhoneVerified) {
          /* Если зарегистрирован, то показываем ему модальное окно, после закрытия которого отправляем заявку */
          dispatch(showModal(stepsData, isAuto, lastCondition));
        } else {
          /* Создаем заявку, так как не нашли пользователя */
          dispatch(createCreditApplication(isAuto, lastCondition, stepsData));
        }
      } catch (error) {
        console.error(error);
        dispatch(createCreditApplication(isAuto, lastCondition, stepsData));
      }
    }
  };
}

export function sendBasicCreditApplication(stepsData: SimpleCreditStepsData, lastCondition: Condition): AsyncAction {
  return async function (dispatch, getState) {
    const {
      application: {
        container: { uuid: simpleCreditUuid },
        simpleCredit: { id: simpleCreditId },
      },
      financeCreditStandalone: { id, uuid, amount, term, vehiclePrice, initialPayment },
      user,
    } = getState();
    dispatch(actions.setLoading(true));
    const personalData = stepsData[SimpleCreditStep.Personal];
    const phone = user.phone ? user.phone.slice(2) : (personalData as PersonalData).phone;

    const currentId = simpleCreditId || id;
    const currentUuid = simpleCreditUuid || uuid;

    if (!currentId || !currentUuid) {
      dispatch(actions.setError(new Error('No credit id or uuid')));
      return;
    }

    try {
      const amountForInsurance = lastCondition === Condition.JUST_MONEY ? amount : vehiclePrice - initialPayment;
      await addBasicInfoSimpleCredit(
        currentId,
        currentUuid,
        creditMainInfoMapper(
          {
            ...(stepsData[SimpleCreditStep.Personal] as PersonalData),
            ...(stepsData[SimpleCreditStep.Passport] as PassportAndAddressData),
            phone,
          },
          amountForInsurance,
          term,
        ),
      );
      await dispatch(sendCreditStepsData(SimpleCreditStep.Additional, stepsData));
      await dispatch(fireStepAnalytics(SimpleCreditStep.Additional, CONDITION_ANALYTICS_MAP[lastCondition]));
      dispatch(actions.setLoading(false));
      dispatch(actions.setCreditStep(SimpleCreditStep.Additional));
    } catch (error) {
      console.error(error);
      dispatch(actions.setError(error as StateError));
    }
  };
}

export function sendAdditionalInfo(
  stepsData: SimpleCreditStepsData,
  creditPurpose: CreditPurpose,
  lastCondition: Condition,
): AsyncAction {
  return async function (dispatch, getState) {
    const {
      application: {
        container: { uuid: simpleCreditUuid },
        simpleCredit: { id: simpleCreditId },
      },
      financeCreditStandalone: { id, uuid },
    } = getState();
    dispatch(actions.setLoading(true));

    const currentId = simpleCreditId || id;
    const currentUuid = simpleCreditUuid || uuid;

    if (!currentId || !currentUuid) {
      dispatch(actions.setError(new Error('No credit id or uuid')));
      return;
    }

    try {
      await addAdditionalInfoSimpleCredit(
        currentId,
        currentUuid,
        additionalDataMapper(stepsData[SimpleCreditStep.Additional] as AdditionalData, creditPurpose),
      );
      await dispatch(sendCreditStepsData(SimpleCreditStep.Employment, stepsData));
      await dispatch(fireStepAnalytics(SimpleCreditStep.Employment, CONDITION_ANALYTICS_MAP[lastCondition]));
      dispatch(actions.setLoading(false));
      dispatch(actions.setCreditStep(SimpleCreditStep.Employment));
    } catch (error) {
      console.error(error);
      dispatch(actions.setError(error as StateError));
    }
  };
}

export function sendEmploymentInfo(stepsData: SimpleCreditStepsData, lastCondition: Condition): AsyncAction {
  return async function (dispatch, getState) {
    const {
      application: {
        container: { uuid: simpleCreditUuid },
        simpleCredit: { id: simpleCreditId },
      },
      financeCreditStandalone: { id, uuid },
    } = getState();
    dispatch(actions.setLoading(true));

    const currentId = simpleCreditId || id;
    const currentUuid = simpleCreditUuid || uuid;

    if (!currentId || !currentUuid) {
      dispatch(actions.setError(new Error('No credit id or uuid')));
      return;
    }

    try {
      await addEmploymentInfoSimpleCredit(
        currentId,
        currentUuid,
        employmentDataMapper(stepsData[SimpleCreditStep.Employment] as EmploymentData),
      );
      dispatch(fireStepAnalytics(SimpleCreditStep.Employment + 1, CONDITION_ANALYTICS_MAP[lastCondition]));
      dispatch(actions.setLoading(false));
      dispatch(actions.setCreditStep(SimpleCreditStep.Final));
    } catch (error) {
      console.error(error);
      dispatch(actions.setError(error as StateError));
    }
  };
}

function tryBindUserAndApplication(stepsData: SimpleCreditStepsData, lastCondition: Condition): AsyncAction {
  return async function (dispatch, getState) {
    const { user } = getState();
    const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());
    /* Если пользователь авторизовался, связываем его аккаунт с заявкой */
    try {
      if (isAuthorized) {
        await bindUserAndApplication();
        dispatch(sendEmploymentInfo(stepsData, lastCondition));
      } else {
        dispatch(userActions.setUserPhone(''));
        dispatch(sendEmploymentInfo(stepsData, lastCondition));
      }
    } catch (error) {
      console.error(error);
      dispatch(actions.setError(error as StateError));
    }
  };
}

export function sendLastStep(stepsData: SimpleCreditStepsData, phone: string, lastCondition: Condition): AsyncAction {
  return async function (dispatch, getState) {
    const {
      user,
      financeCreditStandalone: { userSkippedAuth = false },
    } = getState();

    const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());
    /* Предлагаем пользователю авторизоваться если он не сделал это ранее */
    if (!isAuthorized && !userSkippedAuth) {
      dispatch(userActions.setUserPhone(phone));
      dispatch(userActions.setAuthStep(AuthSteps.SUGGEST));
      dispatch(
        changeAuthModalVisibility(true, {
          authModalTitle: '',
          authModalText:
            'Пожалуйста, подтвердите номер\n телефона, чтобы отслеживать статус\n вашей заявки в личном кабинете',
          additionalButtonText: 'Продолжить без подтверждения',
          handleOnCloseCallback: () => dispatch(tryBindUserAndApplication(stepsData, lastCondition)),
          additionalButtonOnClick: () => dispatch(changeAuthModalVisibility(false)),
          regType: getRegistrationType(lastCondition),
        }),
      );
    } else {
      dispatch(sendEmploymentInfo(stepsData, lastCondition));
    }
  };
}
