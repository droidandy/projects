import {
  Application,
  APPLICATION_INSURANCE_STATUS,
  APPLICATION_INSURANCE_TYPE,
  ApplicationInsurance,
} from '@marketplace/ui-kit/types';
import { initialState } from 'store/initial-state';
import {
  calculateInsurance,
  createSingleApplication,
  getApplication,
  getInsuranceApplicationPaymentLinks,
  importInsurance,
  updateInsuranceStatus as updateInsuranceStatusApi,
} from 'api/application';
import { getAbsoluteUrl } from 'helpers/getAbsoluteUrl';
import { ApplicationInsuranceCalculationData, INSURANCE_PAYMENT } from 'types/Insurance';
import {
  CalculateInsuranceResult,
  ERROR_INSURANCE_APPLICATION,
  ERROR_INSURANCE_SERVICE,
  ImportInsuranceResult,
  InsuranceApplicationActions,
  RECEIVE_INSURANCE_APPLICATION,
  RECEIVE_INSURANCE_PAYMENT_LINK,
  RECEIVE_INSURANCE_SERVICE,
  REQUEST_INSURANCE_APPLICATION,
  REQUEST_INSURANCE_PAYMENT_LINK,
  REQUEST_INSURANCE_SERVICE,
} from './types';

export const actions: InsuranceApplicationActions = {
  requestInsuranceApplication() {
    return {
      type: REQUEST_INSURANCE_APPLICATION,
    };
  },
  receiveInsuranceApplication(application) {
    return {
      type: RECEIVE_INSURANCE_APPLICATION,
      payload: application,
    };
  },
  errorInsuranceApplication(error: Error) {
    return {
      type: ERROR_INSURANCE_APPLICATION,
      payload: error,
    };
  },
  requestInsuranceService(type) {
    return {
      type: REQUEST_INSURANCE_SERVICE,
      payload: type,
    };
  },
  receiveInsuranceService(type) {
    return {
      type: RECEIVE_INSURANCE_SERVICE,
      payload: type,
    };
  },
  errorInsuranceService(type, error) {
    return {
      type: ERROR_INSURANCE_SERVICE,
      payload: { type, error },
    };
  },
  requestInsurancePaymentLink(type) {
    return {
      type: REQUEST_INSURANCE_PAYMENT_LINK,
      payload: type,
    };
  },
  receiveInsurancePaymentLink(link, type) {
    return {
      type: RECEIVE_INSURANCE_PAYMENT_LINK,
      payload: { link, type },
    };
  },
  fetchInsuranceApplication(uuid) {
    return async function (dispatch, getState) {
      const { insuranceApplication } = getState();
      let { application } = insuranceApplication;
      const fetchId = uuid || application.uuid;
      if (fetchId) {
        dispatch(actions.requestInsuranceApplication());
        const { data } = await getApplication(fetchId);
        application = data;
        dispatch(actions.receiveInsuranceApplication(application));
      } else {
        dispatch(actions.errorInsuranceApplication(new Error('application to fetch not found ')));
      }
      return application;
    };
  },
  createInsuranceApplication() {
    return async function (dispatch, getState) {
      const { insuranceApplication } = getState();
      await dispatch(actions.requestInsuranceApplication());
      try {
        const { data } = await createSingleApplication({
          insurance: insuranceApplication.application.insurance.map((insurance) => ({ type: insurance.type })),
        });
        dispatch(actions.receiveInsuranceApplication(data));
        return data;
      } catch (e) {
        dispatch(actions.errorInsuranceApplication(e));
      }
      return insuranceApplication.application;
    };
  },
  calculateInsuranceService(type, id, calculationValues) {
    return async function (dispatch) {
      dispatch(actions.requestInsuranceService(type));
      try {
        // eslint-disable-next-line no-await-in-loop
        const { data } = await calculateInsurance(id, calculationValues, type);
        dispatch(actions.receiveInsuranceService(type));
        return { ...data, type };
      } catch (e) {
        dispatch(actions.errorInsuranceService(type, e));
        return { id, type };
      }
    };
  },
  calculateInsuranceApplication(calculationValues: ApplicationInsuranceCalculationData) {
    return async function (dispatch, getState) {
      const { insuranceApplication } = getState();
      await dispatch(actions.requestInsuranceApplication());
      let { application } = insuranceApplication as { application: Application };

      // создаем если еще нет
      if (!insuranceApplication.initiated) {
        try {
          const { data } = await createSingleApplication({
            insurance: insuranceApplication.application.insurance.map((insurance) => ({ type: insurance.type })),
          });
          application = data;
        } catch (e) {
          dispatch(actions.errorInsuranceApplication(e));
          return [] as CalculateInsuranceResult[];
        }
      }

      // выбираем активные услуги
      const servicesToCalc = application.insurance.filter(
        (applicationItem) =>
          ![APPLICATION_INSURANCE_STATUS.CANCEL, APPLICATION_INSURANCE_STATUS.FROZEN].includes(applicationItem.status),
      );

      // производим рассчет
      // идея в том, что бы запустить их синхронно, но не словить исключений
      const results = await Promise.all(
        servicesToCalc.map(({ type, id }) => dispatch(actions.calculateInsuranceService(type, id, calculationValues))),
      );

      dispatch(
        actions.receiveInsuranceApplication({
          ...application,
          insurance: application.insurance.map((insurance) => {
            const itemResult = results.find((result) => +result.id === +insurance.id);
            return {
              ...insurance,
              status: itemResult?.price ? APPLICATION_INSURANCE_STATUS.CALCULATED : insurance.status,
            };
          }),
        }),
      );

      return results;
    };
  },
  importInsuranceService(type, id) {
    return async function (dispatch) {
      dispatch(actions.requestInsuranceService(type));
      try {
        // eslint-disable-next-line no-await-in-loop
        await importInsurance(id);
        dispatch(actions.receiveInsuranceService(type));
        return { id, type, imported: true };
      } catch (e) {
        dispatch(actions.errorInsuranceService(type, e));
        return { id, type, imported: false };
      }
    };
  },
  importInsuranceApplication() {
    return async function (dispatch, getState) {
      const { insuranceApplication } = getState();
      await dispatch(actions.requestInsuranceApplication());

      // отклоняем если еще нет заявки
      if (!insuranceApplication.initiated) {
        dispatch(actions.errorInsuranceApplication(new Error('You need to create application first')));
        return [] as ImportInsuranceResult[];
      }
      const { application } = insuranceApplication as { application: Application };

      // выбираем активные услуги
      const servicesToImport = application.insurance.filter(
        (applicationItem) =>
          ![APPLICATION_INSURANCE_STATUS.CANCEL, APPLICATION_INSURANCE_STATUS.FROZEN].includes(applicationItem.status),
      );

      // отправляем на подтверждение
      const results = await Promise.all(
        servicesToImport.map(({ type, id }) => dispatch(actions.importInsuranceService(type, id))),
      );

      // обновляем статусы
      await dispatch(
        actions.receiveInsuranceApplication({
          ...application,
          insurance: application.insurance.map((insurance) => {
            const itemResult = results.find((result) => +result.id === +insurance.id);
            return {
              ...insurance,
              status: itemResult?.imported ? APPLICATION_INSURANCE_STATUS.FROZEN : insurance.status,
            };
          }),
        }),
      );

      return results;
    };
  },
  saveInsuranceApplication(calculationValues: ApplicationInsuranceCalculationData) {
    return async function (dispatch, getState) {
      const { insuranceApplication } = getState();
      dispatch(actions.requestInsuranceApplication());
      let { application } = insuranceApplication as { application: Application };

      // лучше создавать с только включеными услугамии и доработать что бы при первом включении услуги она создавалась в заявке
      // создаем если еще нет
      try {
        const { data } = await createSingleApplication({
          insurance: insuranceApplication.application.insurance.map((insurance) => ({ type: insurance.type })),
        });
        application = data;
      } catch (e) {
        dispatch(actions.errorInsuranceApplication(e));
        return;
      }

      // выбираем активные услуги
      const servicesToCalc = application.insurance.filter(
        ({ status }) => ![APPLICATION_INSURANCE_STATUS.CANCEL, APPLICATION_INSURANCE_STATUS.FROZEN].includes(status),
      );
      // производим рассчет
      // идея в том, что бы запустить их синхронно, но не словить исключений
      await Promise.all(
        servicesToCalc.map(({ type, id }) => dispatch(actions.calculateInsuranceService(type, id, calculationValues))),
      );

      let intervalId: null | number = null;

      const interval = async () => {
        const res = await getApplication(application.uuid);
        const { insurance } = res.data;
        const isAllCalculated = !insurance.filter((el) => el.status === APPLICATION_INSURANCE_STATUS.NEW).length;
        const isAllImported = insurance.filter(
          (el) => el.status === APPLICATION_INSURANCE_STATUS.FROZEN || el.status === APPLICATION_INSURANCE_STATUS.DRAFT,
        ).length;
        if (isAllCalculated) {
          // отправляем на подтверждение
          await Promise.all(
            insurance
              .filter(({ status }) => status === APPLICATION_INSURANCE_STATUS.CALCULATED)
              .map(({ type, id }) => dispatch(actions.importInsuranceService(type, id))),
          );

          if (isAllImported) {
            clearInterval(intervalId!);
            dispatch(actions.receiveInsuranceApplication(res.data));
          }
        }
      };

      intervalId = window.setInterval(interval, 30000);
    };
  },
  fetchApplicationPaymentLinks(id, type) {
    return async function (dispatch, getState) {
      const { insuranceApplication } = getState();
      const applicationUuid = insuranceApplication.application.uuid;
      const applicationId = id || insuranceApplication.application.id;
      dispatch(actions.requestInsurancePaymentLink(type));
      if (applicationId) {
        const absoluteUrl = getAbsoluteUrl();
        const { data } = await getInsuranceApplicationPaymentLinks(
          applicationId,
          `${absoluteUrl}/insurance/calculate/${applicationUuid}/${type}?payment=${INSURANCE_PAYMENT.SUCCESS}`,
          `${absoluteUrl}/insurance/calculate/${applicationUuid}/${type}?payment=${INSURANCE_PAYMENT.FAIL}`,
        );
        const { link } = data;
        dispatch(actions.receiveInsurancePaymentLink(link, type));
      }
    };
  },
  setInsuranceServiceStatus(type, status) {
    return async function (dispatch, getState) {
      const {
        insuranceApplication: { application },
      } = getState();
      dispatch(actions.requestInsuranceApplication());
      const current = application.insurance.find((insurance) => insurance.type === type);
      if (current && current.id) {
        try {
          await updateInsuranceStatusApi(current.id, status);
        } catch (e) {
          dispatch(actions.errorInsuranceApplication(e));
          return;
        }
      }
      const newVariants = application.insurance.reduce(
        (s, i) => [...(i.type === type ? [...s, { ...i, status }] : [...s, i])],
        [] as ApplicationInsurance[],
      );
      dispatch(actions.receiveInsuranceApplication({ ...application, insurance: newVariants }));
    };
  },
  insuranceApplicationReseted() {
    return async function (dispatch) {
      dispatch(actions.receiveInsuranceApplication(initialState.insuranceApplication.application));
      dispatch(actions.receiveInsurancePaymentLink('', APPLICATION_INSURANCE_TYPE.CASCO));
      dispatch(actions.receiveInsurancePaymentLink('', APPLICATION_INSURANCE_TYPE.OSAGO));
    };
  },
};
