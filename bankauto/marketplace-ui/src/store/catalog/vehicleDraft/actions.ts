import { AsyncAction } from 'types/AsyncAction';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { actions as vehiclesCreateDataActions } from '../create/data';
import { actions as vehicleCreateDraftActions } from '.';
import {
  getClientVehicleDraft,
  saveClientVehicleDraft,
  updateClientVehicleDraft,
  createClientVehicleCallDraft,
  VehicleDraft,
  VehicleCallDraft,
} from 'api/client/vehicle';
import { getCreateParams, parseVehicleParams } from 'containers/VehicleCreate/utils';

export const sendVehicleCreateDataDraft =
  (values: VehicleFormSellValues, isSent: boolean): AsyncAction<Promise<any | null>> =>
  (dispatch, getState) => {
    const {
      vehicleCreateData: { data },
    } = getState();

    if (isSent) dispatch(vehicleCreateDraftActions.setSentStatus(false));

    const vehicleData = parseVehicleParams(values, data) as VehicleDraft;
    return saveClientVehicleDraft(vehicleData)
      .then((res) => {
        return dispatch(vehiclesCreateDataActions.setId({ id: res.data.vehicle.id! }));
      })
      .catch(() => {
        throw new Error('Не удалось обновить данные формы');
      });
  };

export const updateVehicleCreateDataDraft =
  (values: VehicleFormSellValues, isABTest: boolean = false): AsyncAction<Promise<any | null>> =>
  (dispatch, getState) => {
    const {
      vehicleCreateData: { data, params },
      autostat: { data: autostatData },
      vehicleDraftData: { isSent },
    } = getState();
    if (isSent) {
      return Promise.resolve();
    }
    const vehicleData = parseVehicleParams(values, data, autostatData, params.id) as VehicleDraft;
    return updateClientVehicleDraft(vehicleData, isABTest).catch(() => {
      throw new Error('Не удалось обновить данные черновика');
    });
  };

export const sendVehicleCallDraftCreate =
  (values: VehicleFormSellValues): AsyncAction<Promise<any | null>> =>
  (dispatch, getState) => {
    const {
      vehicleCreateSellValues: { values: prevValues },
      user: { phone, firstName, lastName, patronymicName, email },
    } = getState();

    const params = getCreateParams({
      ...{
        ...values,
        city: values.city || prevValues.city,
        brand: values.brand || prevValues.brand,
        model: values.model || prevValues.model,
      },
      phone,
      firstName,
      lastName: lastName || null,
      patronymicName,
      email: email || null,
    }) as VehicleCallDraft;

    return createClientVehicleCallDraft(params)
      .then((res) => {
        dispatch(vehiclesCreateDataActions.setId({ id: res.data.vehicle.id! }));
      })
      .catch(() => {
        throw new Error('Не удалось обновить данные формы');
      });
  };

export const getVehicleDraftValues =
  (offerId: number): AsyncAction<Promise<any | null>> =>
  (dispatch) => {
    return getClientVehicleDraft(offerId)
      .then((res) => {
        return dispatch(vehicleCreateDraftActions.setDraftData({ draftData: res.data }));
      })
      .catch((err) => {
        dispatch(vehiclesCreateDataActions.setError(err));
        throw new Error('Не удалось обновить данные формы');
      });
  };

export const clearVehicleDraftValues = (): AsyncAction => (dispatch) => {
  return dispatch(vehicleCreateDraftActions.setInitialItem());
};
