import { AsyncAction } from 'types/AsyncAction';
import { initialState } from 'store/initial-state';
import { actions as serviceRequestActions } from './reducers';

export const setServiceStep = (step: any): AsyncAction<Promise<any>> => {
  return async (dispatch) => {
    await dispatch(serviceRequestActions.setStep({ step }));
    return step;
  };
};

export const setServiceRequest = (values: any, setInitial?: boolean | null): AsyncAction<Promise<any>> => {
  return async (dispatch, getState, { initial }) => {
    await dispatch(
      serviceRequestActions.setValues({
        values,
        initial: typeof setInitial !== 'undefined' ? setInitial : initial,
      }),
    );
    return values;
  };
};

export const updateServiceRequest = (values: Partial<any>, setInitial?: boolean | null): AsyncAction<Promise<any>> => {
  return async (dispatch, getState, { initial }) => {
    const {
      serviceRequest: { values: valuesLast },
    } = getState();
    const newValues = { ...valuesLast, ...values };
    await dispatch(
      serviceRequestActions.setValues({
        values: newValues,
        initial: typeof setInitial !== 'undefined' ? setInitial : initial,
      }),
    );
    return newValues;
  };
};

export const clearServiceRequest = (): AsyncAction => {
  return async (dispatch) => {
    const { values } = initialState.serviceRequest;
    dispatch(
      serviceRequestActions.setValues({
        values,
        initial: null,
      }),
    );
  };
};
