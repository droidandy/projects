import { APPLICATION_CREDIT_STATUS } from '@marketplace/ui-kit/types';
import {
  addAdditionalCreditInfo,
  addBasicCreditInfo,
  addEmploymentCreditInfo,
  createCreditApplication,
  updateCreditStepsData,
  bindUserAndApplication,
} from 'api/application';
import { checkIsRegisteredUser } from 'api/auth';
import { changeAuthModalVisibility, actions as userActions } from 'store/user';
import { authModalTexts } from 'constants/authModalTexts';
import { messageModalActions } from 'store/message-modal';
import { AsyncAction } from 'types/AsyncAction';
import { Pending } from 'helpers/pendings';
import { getLeadInfo } from 'helpers/cookies';
import { CreditMainInfoData, CreditStep, StepsData } from 'containers/Finance/Credit/types/CreditFormTypes';
import { AdditionalData, EmploymentData, PersonalData } from 'types/CreditFormDataTypes';
import { MessageModalName } from 'types/MessageModal';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';
import { StateError } from 'store/types';
import { fireCreditBDAAnalytics } from 'helpers/analytics';
import { getInitialPaymentByMaxCreditAmount } from 'helpers/credit';
import { Condition } from 'containers/Finance/Credit/types/Condition';
import { CONDITION_ANALYTICS_MAP } from 'containers/Finance/Credit/constants/conditions';
import {
  getCreateMappedData,
  getBasicMappedData,
  getAdditionalMappedData,
  getEmploymentMappedData,
  getStepsMappedData,
} from './mappers';
import { actions } from './reducers';
import { getCookieImpersonalization } from 'helpers/authCookies';

/** Специальные машина и офис для С2С */
const VEHICLE_ID = 33780;
const OFFICE_ID = 3751;

export function fireStepAnalytics(step: number, category: string): AsyncAction {
  return function (dispatch, getState) {
    const { user } = getState();

    fireCreditBDAAnalytics(category, step, user.uuid);
  };
}

export function createApplication(creditMax: number): AsyncAction {
  return async function (dispatch, getState) {
    const {
      financeCreditVehicle: { initialPayment, vehiclePrice, term, monthlyPayment, rate, amount },
    } = getState();

    try {
      const { data: creditData } = await createCreditApplication(
        getCreateMappedData({
          vehicleId: VEHICLE_ID,
          salesOfficeId: OFFICE_ID,
          initialPayment: getInitialPaymentByMaxCreditAmount(initialPayment, amount, term, creditMax),
          vehiclePrice,
          term,
          monthlyPayment,
          rate,
        }),
      );
      dispatch(
        actions.setCreditApplication({
          id: creditData.id,
          uuid: creditData.uuid,
          status: APPLICATION_CREDIT_STATUS.CREATED,
        }),
      );
      dispatch(actions.setLoading(false));
      dispatch(actions.setCreditStep(CreditStep.Passport));
    } catch (err) {
      dispatch(actions.setError(err as StateError));
    }
  };
}

export function sendBasicCreditApplication(mainInfo: CreditMainInfoData): AsyncAction {
  return async function (dispatch, getState) {
    const {
      financeCreditVehicle: { id, uuid, term },
      user,
    } = getState();
    dispatch(actions.setLoading(true));
    const phone = user.phone ? user.phone.slice(2) : mainInfo.phone;

    if (!id || !uuid) {
      dispatch(actions.setError(new Error('No credit id or uuid')));
      return;
    }

    try {
      // Данные по заявке
      await addBasicCreditInfo(id, getBasicMappedData({ ...mainInfo, phone }, term), uuid);
      dispatch(actions.setLoading(false));
      dispatch(actions.setCreditStep(CreditStep.Additional));
    } catch ({ message }) {
      dispatch(actions.setError(message));
    }
  };
}

function showModal(phone: string, creditMax: number): AsyncAction {
  return async function (dispatch) {
    dispatch(userActions.setUserPhone(phone));
    dispatch(userActions.setAuthStep(AuthSteps.SUGGEST));
    dispatch(
      changeAuthModalVisibility(true, {
        authModalText: authModalTexts[AuthSteps.SUGGEST].text,
        additionalButtonText: 'Продолжить без подтверждения',
        handleOnCloseCallback: () => {
          dispatch(createApplication(creditMax));
        },
        additionalButtonOnClick: () => {
          dispatch(userActions.setUserPhone(''));
          dispatch(changeAuthModalVisibility(false));
          dispatch(actions.setUserSkippedAuth(true));
        },
        regType: RegistrationTypes.CREDIT_VEHICLE_C2C,
      }),
    );
  };
}

export function sumbitCreditFirstStep(personal: PersonalData, creditMax: number): AsyncAction {
  return async function (dispatch, getState) {
    const { user } = getState();
    dispatch(actions.setLoading(true));
    const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());
    /* Если пользователь авторизован отправляем заявку, иначе проверяем зарегистрирован ли он в системе */
    if (!isAuthorized) {
      try {
        const leadInfo = getLeadInfo() || undefined;
        const {
          data: { isPhoneVerified },
        } = await checkIsRegisteredUser(personal, RegistrationTypes.CREDIT_VEHICLE_C2C, leadInfo);
        if (isPhoneVerified) {
          /* Если зарегистрирован, то показываем ему модальное окно, после закрытия которого отправляем заявку */
          dispatch(showModal(`+7${personal.phone}`, creditMax));
        } else {
          /* Создаем заявку, так как не нашли пользователя */
          dispatch(createApplication(creditMax));
        }
      } catch (err) {
        dispatch(createApplication(creditMax));
      }
    } else {
      dispatch(createApplication(creditMax));
    }
  };
}

export function sendCreditStepsData(step: number, payload: StepsData): AsyncAction {
  return async function (dispatch, getState) {
    const {
      financeCreditVehicle: { id, uuid },
    } = getState();

    if (!id || !uuid) {
      dispatch(actions.setError(new Error('No credit id')));
      return;
    }

    try {
      await Pending('updateCreditStepsData', updateCreditStepsData(id, getStepsMappedData(step, payload), uuid));
    } catch (err) {
      dispatch(actions.setError(err));
    }
  };
}

export function sendAdditionalInfo(additionalInfo: AdditionalData): AsyncAction {
  return async function (dispatch, getState) {
    const {
      financeCreditVehicle: { id, uuid },
    } = getState();
    dispatch(actions.setLoading(true));

    if (!id || !uuid) {
      dispatch(actions.setError(new Error('No credit id')));
      return;
    }

    try {
      await addAdditionalCreditInfo(id, getAdditionalMappedData(additionalInfo), uuid);
      dispatch(actions.setCreditStep(CreditStep.Employment));
      dispatch(actions.setLoading(false));
    } catch (err) {
      dispatch(actions.setError(err));
    }
  };
}

export function submitCreditApplication(
  employment: EmploymentData,
  lastCondition: Condition,
  onClosePopup: () => void,
): AsyncAction {
  return async function (dispatch, getState) {
    const {
      financeCreditVehicle: { id, uuid },
    } = getState();
    dispatch(actions.setLoading(true));

    if (!id || !uuid) {
      dispatch(actions.setError(new Error('No credit id')));
      return;
    }

    try {
      await addEmploymentCreditInfo(id, getEmploymentMappedData(employment), uuid);
      dispatch(fireStepAnalytics(CreditStep.Employment + 1, CONDITION_ANALYTICS_MAP[lastCondition]));
      dispatch(actions.setLoading(false));
      dispatch(
        messageModalActions.openWithCallback({
          name: MessageModalName.CREDIT_APPLICATION_CREATED,
          callbackOnClose: onClosePopup,
        }),
      );
    } catch (err) {
      dispatch(actions.setError(err));
    }
  };
}

function tryBindUserAndApplication(
  employmentInfo: EmploymentData,
  lastCondition: Condition,
  onClosePopup: () => void,
): AsyncAction {
  return async function (dispatch, getState) {
    const { user } = getState();
    const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());
    /* Если пользователь авторизовался, связываем его аккаунт с заявкой */
    try {
      if (isAuthorized) {
        await bindUserAndApplication();
        dispatch(submitCreditApplication(employmentInfo, lastCondition, onClosePopup));
      } else {
        dispatch(userActions.setUserPhone(''));
        dispatch(submitCreditApplication(employmentInfo, lastCondition, onClosePopup));
      }
    } catch (err) {
      dispatch(actions.setError(err));
    }
  };
}

export function sendLastStep(
  employmentInfo: EmploymentData,
  onClosePopup: () => void,
  phone: string,
  lastCondition: Condition,
): AsyncAction {
  return async function (dispatch, getState) {
    const {
      user,
      financeCreditVehicle: { userSkippedAuth = false },
    } = getState();

    const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());
    /* Предлагаем пользователю авторизоваться если он не сделал это ранее */
    if (!isAuthorized && !userSkippedAuth) {
      dispatch(userActions.setUserPhone(phone));
      dispatch(userActions.setAuthStep(AuthSteps.SUGGEST));
      dispatch(
        changeAuthModalVisibility(true, {
          authModalText:
            'Пожалуйста, подтвердите номер\n телефона, чтобы отслеживать статус\n вашей заявки в личном кабинете',
          additionalButtonText: 'Продолжить без подтверждения',
          handleOnCloseCallback: () => dispatch(tryBindUserAndApplication(employmentInfo, lastCondition, onClosePopup)),
          additionalButtonOnClick: () => dispatch(changeAuthModalVisibility(false)),
          regType: RegistrationTypes.CREDIT_VEHICLE_C2C,
        }),
      );
    } else {
      dispatch(submitCreditApplication(employmentInfo, lastCondition, onClosePopup));
    }
  };
}
