import { StateMiddleware } from 'store/types';
import { isSsr } from 'helpers/isSsr';
import { StateSession } from './types';
import { actions } from './reducers';
import { refresh } from './actions';

// export const impersonalisationSkipAuthRefresh = (): StateMiddleware<StateModel> => {
//   return ({ getState }) =>
//     (next) => {
//       return (action) => {
//         if (typeof action === 'function' && action.name === 'refreshAction') {
//           if (getState().user.impersonalizated) {
//             return Promise.reject();
//           }
//         }
//         return next(action);
//       };
//     };
// };

export const authSessionWorkers = (): StateMiddleware<StateSession> => {
  let timeoutId: number | null = null;
  return (store) => (next) => (action) => {
    if (!isSsr) {
      const { dispatch, getState } = store;

      if (action.type === actions.fillUser.toString()) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        const {
          user: { expiresIn = 3600 },
        } = getState();

        timeoutId = Number(
          setTimeout(() => {
            dispatch(refresh());
          }, (expiresIn! - 60 * 5) * 1000),
        );
      }

      if (action.type === actions.authorizeUser.toString() && timeoutId) {
        clearTimeout(timeoutId);
      }
    }

    return next(action);
  };
};
