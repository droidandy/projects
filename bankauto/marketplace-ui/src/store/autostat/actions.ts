import { Dispatch } from 'redux';
import axios, { AxiosError } from 'axios';
import isEqual from 'lodash/isEqual';
import { AsyncAction } from 'types/AsyncAction';
import { AutostatParamsAccurate } from 'types/Autostat';
import { Pending } from 'helpers/pendings';
import { getAutostatDataByParams } from 'api/autostat';
import { actions as autoStatActions } from './reducers';

const handleError = (error: Error | AxiosError) => (dispatch: Dispatch) => {
  if (axios.isCancel(error)) {
    return Promise.reject();
  }

  return dispatch(autoStatActions.setError(error));
};

export const fetchAutostatDataByParams = (params: AutostatParamsAccurate): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    const {
      autostat: { paramsAccurate: paramsState },
    } = getState();
    if (!isEqual(paramsState, params)) {
      dispatch(autoStatActions.setLoading(true));
      dispatch(autoStatActions.setParamsAccurate({ params, initial }));
      Pending('get-autostat-data-by-params', getAutostatDataByParams(params))
        .then(({ data }) => {
          dispatch(
            autoStatActions.setData({
              data: {
                priceTradeIn: null,
                priceAvg: data.price,
              },
              initial,
            }),
          );
        })
        .catch((err) => {
          dispatch(handleError(err));
        });
    }
  };
};

export const fetchAutostatTradeInDataByParams = (params: AutostatParamsAccurate): AsyncAction => {
  return async function (dispatch, getState, { initial }) {
    dispatch(autoStatActions.setLoading(true));
    dispatch(autoStatActions.setParamsAccurate({ params, initial }));
    await getAutostatDataByParams(params)
      .then(({ data }) => {
        dispatch(
          autoStatActions.setData({
            data: {
              priceTradeIn: null,
              priceAvg: data.price,
            },
            initial,
          }),
        );
      })
      .catch((err) => {
        dispatch(handleError(err));
      });
  };
};
