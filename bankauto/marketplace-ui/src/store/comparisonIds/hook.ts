import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { useStateBase } from 'store/utils';
import { useSelector } from 'react-redux';
import { StateModel } from 'store/types';
import * as thunkActions from './actions';
import { actions } from './reducers';

export const useComparisonIds = () => {
  return useStateBase('comparisonIds', actions, thunkActions);
};

export const useIsInComparison = (id: number, type: VEHICLE_TYPE): boolean => {
  return useSelector<StateModel, boolean>((state) => state.comparisonIds.data[type].includes(id));
};
