import { useStateBase } from 'store/utils';
import { actions as containerActions } from './reducers';
import { actions as vehicleActions } from './vehicle/reducers';
import { actions as simpleCreditActions } from './simpleCredit/reducers';
import * as containerThunkActions from './actions';
import * as vehicleThunkActions from './vehicle/actions';
import * as simpleCreditThunkActions from './simpleCredit/actions';

export const useApplication = () => {
  return useStateBase(
    'application',
    {
      ...containerActions,
      ...vehicleActions,
      ...simpleCreditActions,
    },
    {
      ...containerThunkActions,
      ...vehicleThunkActions,
      ...simpleCreditThunkActions,
    },
  );
};
