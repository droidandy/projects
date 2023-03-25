import { AsyncAction } from 'types/AsyncAction';
import { getVehicleCreateData } from 'api/catalog/createData';
import {
  VehicleFormDataParams,
  VehicleFormData,
  VehicleFormValuesBase,
  VehicleFormCatalogType,
} from 'types/VehicleFormType';
import { initialState } from 'store/initial-state';
import { PrepareNewParams, PrepareNewDataAndParams } from './utils';
import { DataMapper, ValuesParamsMapper } from './mappers';
import { actions as vehiclesCreateDataActions } from './reducers';

export const fetchVehicleCreateData =
  (
    params: VehicleFormDataParams,
    catalogType: VehicleFormCatalogType,
    setInitial?: boolean | null,
  ): AsyncAction<Promise<VehicleFormData>> =>
  (dispatch, getState, { initial }) => {
    const {
      vehicleCreateData: { data: previousData, catalogType: previousCatalogType },
    } = getState();

    // dispatch(vehiclesCreateDataActions.setLoading(true));
    return getVehicleCreateData(params, catalogType)
      .then(async ({ data }) => {
        const mappedData = DataMapper(data);
        const payload = PrepareNewDataAndParams(
          mappedData,
          params,
          previousCatalogType === catalogType ? previousData : undefined,
        );
        await dispatch(vehiclesCreateDataActions.setData({ ...payload, catalogType, initial: initial || setInitial }));
        return payload.data;
      })
      .catch(async (err) => {
        await dispatch(vehiclesCreateDataActions.setError(err));
        throw new Error('Не удалось обновить данные формы');
      });
  };

export const initData =
  (values: VehicleFormValuesBase, catalogType?: VehicleFormCatalogType): AsyncAction<Promise<VehicleFormData>> =>
  (dispatch) => {
    const { catalogType: initialCatalogType } = initialState.vehicleCreateData;
    const nextParams = ValuesParamsMapper(values);
    return dispatch(fetchVehicleCreateData(nextParams, catalogType || initialCatalogType, true));
  };

export const updateData =
  (values: VehicleFormValuesBase, catalogType?: VehicleFormCatalogType): AsyncAction<Promise<VehicleFormData | null>> =>
  (dispatch, getState) => {
    const {
      vehicleCreateData: { params: previousParams, catalogType: previousCatalogType },
    } = getState();
    const nextParams = ValuesParamsMapper(values);
    if (catalogType && catalogType !== previousCatalogType) {
      return dispatch(fetchVehicleCreateData(nextParams, catalogType));
    }
    const { result: currentParams, chain: paramsIsEqual, dirty } = PrepareNewParams(previousParams, nextParams);
    if (!paramsIsEqual || !dirty) {
      return dispatch(fetchVehicleCreateData(currentParams, previousCatalogType));
    }
    return new Promise((r) => r(null));
  };
