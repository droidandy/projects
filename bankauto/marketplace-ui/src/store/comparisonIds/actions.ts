import { AsyncAction } from 'types/AsyncAction';
import { getComparisonIds, updateComparisonIds } from 'api/client/comparison';
import { ComparisonIds, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { notify, notifyError } from 'store/notifications';
import { getFromLocalStorage, setInLocalStorage } from 'helpers/localStorage';
import { Notification } from 'types/Notification';
import { actions } from './reducers';

const localStorageKey = 'comparisonIds';

export const fetchComparisonIds = (): AsyncAction => (dispatch) => {
  dispatch(actions.setLoading(true));
  return getComparisonIds()
    .then(({ data }) => {
      const ids = data || { new: [], used: [] };
      setInLocalStorage(localStorageKey, ids);
      dispatch(actions.setData({ data: ids }));
    })
    .catch((err) => {
      const emptyData = { new: [], used: [] };
      setInLocalStorage(localStorageKey, emptyData);
      dispatch(actions.setError(err));
    });
};

export const addComparisonId =
  (offerId: number, type: VEHICLE_TYPE, notificationProps?: Notification['props']): AsyncAction =>
  (dispatch) => {
    dispatch(actions.setLoading(true));
    const current = getFromLocalStorage(localStorageKey) as ComparisonIds; // this key is always present in ls
    const MAX_NUMBER_OF_ITEMS = 20;

    if (current[type].includes(offerId)) {
      dispatch(notifyError('Эта машина уже есть в сравнениях'));
      return undefined;
    }

    const updated = {
      ...current,
      [type]: [...current[type], offerId],
    };

    if (updated[type].length > MAX_NUMBER_OF_ITEMS) {
      dispatch(
        notifyError(
          `Количество ${
            type === VEHICLE_TYPE.NEW ? 'новых' : 'подержанных'
          } машин в сравнениях не должно привышать ${MAX_NUMBER_OF_ITEMS}`,
        ),
      );
      return undefined;
    }

    return updateComparisonIds(updated)
      .then(() => {
        setInLocalStorage(localStorageKey, updated);
        dispatch(actions.setData({ data: updated }));
        dispatch(notify('Добавлено в сравнения', notificationProps));
      })
      .catch((err) => {
        dispatch(notifyError('Не удалось добавить в сравнения'));
        dispatch(actions.setError(err));
      });
  };

export const removeComparisonId =
  (offerId: number, type: VEHICLE_TYPE): AsyncAction<Promise<void>> =>
  (dispatch) => {
    dispatch(actions.setLoading(true));
    const current = getFromLocalStorage(localStorageKey) as ComparisonIds;

    const updated = {
      ...current,
      [type]: current[type].filter((id) => id !== offerId),
    };

    return updateComparisonIds(updated)
      .then(() => {
        setInLocalStorage(localStorageKey, updated);
        dispatch(actions.setData({ data: updated }));
        dispatch(notify('Удалено из сравнений'));
      })
      .catch((err) => {
        dispatch(notifyError('Не удалось удалить из сравнений'));
        dispatch(actions.setError(err));
      });
  };
