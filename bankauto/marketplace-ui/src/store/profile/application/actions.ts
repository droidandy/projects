import { APPLICATION_VEHICLE_STATUS } from '@marketplace/ui-kit/types';
import { AsyncAction } from 'types/AsyncAction';
import { checkApprovedCredit, getApplication } from 'api/application';
import {
  getContainerApplicationMappedData,
  getSimpleCreditApplicationMappedData,
  getVehicleApplicationMappedData,
} from 'store/profile/application/mappers';
import { actions as containerActions } from './reducers';
import { actions as vehicleActions } from './vehicle/reducers';
import { actions as simpleCreditActions } from './simpleCredit/reducers';
import { bookApplicationWithoutPayment } from '../../../api/application/bookApplicationWithoutPayment';
import { payForOrder as payForOrderAPI } from '../../../api/application/order/payForOrder';
import { bookApplicationWithPayment } from 'api/application/bookApplicationWithPayment';
import { initialState } from '../../initial-state';

export function fetchApplication(
  id?: string | number,
  silent: boolean = false,
  needCheckApprovedCredit = false,
): AsyncAction {
  return function (dispatch) {
    if (!silent) {
      dispatch(containerActions.setLoading(true));
    }

    if (!id) {
      dispatch(containerActions.setError(new Error('Application ID is not defined')));
    }

    if (needCheckApprovedCredit) {
      checkApprovedCredit()
        .then(({ data }) => {
          dispatch(containerActions.setApprovedCreditExists(data.exists));
        })
        .catch((err) => {
          dispatch(containerActions.setError(err));
        });
    }

    return getApplication(id!)
      .then(({ data }) => {
        dispatch(containerActions.setApplication(getContainerApplicationMappedData(data)));
        dispatch(vehicleActions.setApplication(getVehicleApplicationMappedData(data)));
        dispatch(simpleCreditActions.setSimpleCreditApplication(getSimpleCreditApplicationMappedData(data)));
        dispatch(containerActions.setLoading(false));
        dispatch(containerActions.setInitial(true));
      })
      .catch((err) => {
        dispatch(containerActions.setError(err));
      });
  };
}

export function setApplicationVehicleStatus(status: APPLICATION_VEHICLE_STATUS) {
  return vehicleActions.setApplicationVehicleStatus(status);
}

export function setApplicationDesiredDatetime(desiredDatetime: number) {
  return vehicleActions.setApplicationDesiredMeetingData(desiredDatetime);
}

export const payForOrder = (): AsyncAction => async (dispatch, getState) => {
  const {
    application: {
      vehicle: { id: vehicleId, status },
    },
  } = getState();
  if (status === APPLICATION_VEHICLE_STATUS.BOOKED) {
    await bookApplicationWithPayment(vehicleId!);
  }

  const res = await payForOrderAPI(vehicleId!);

  dispatch(setApplicationVehicleStatus(APPLICATION_VEHICLE_STATUS.BOOKED));

  return res;
};

export const confirmApplication = (): AsyncAction => async (dispatch, getState) => {
  const {
    application: {
      vehicle: { id: vehicleId },
    },
  } = getState();
  return bookApplicationWithoutPayment(vehicleId!).then(() =>
    dispatch(setApplicationVehicleStatus(APPLICATION_VEHICLE_STATUS.BOOKED)),
  );
};

export const cancelHolding = (): AsyncAction => async (dispatch, getState) => {
  const {
    application: {
      vehicle: { id: vehicleId },
    },
  } = getState();
  return bookApplicationWithPayment(vehicleId!).then(() => {
    const refundDate = Math.floor(new Date().getTime() / 1000);
    return dispatch(vehicleActions.setApplicationRefund(refundDate));
  });
};

export const clearApplication = (): AsyncAction => async (dispatch) => {
  return Promise.all([
    dispatch(containerActions.setApplicationState(initialState.application.container)),
    dispatch(vehicleActions.setApplicationState(initialState.application.vehicle)),
  ]);
};
