import { AsyncAction } from 'types/AsyncAction';
import { initialDebitCardList } from 'containers/Finance/DebitCards/constants';
import { DebitCardName } from '../../types';
import { actions as specialProgramsActions } from './reducers';

export const fetchDebitCards = (): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    // УСТАНАВЛИВАЕМ КАРТЫ ИЗ КОНСТАНТЫ
    dispatch(specialProgramsActions.setItems({ items: initialDebitCardList, initial }));
  };
};

export const fetchDebitCard = (debitCardName: DebitCardName): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    const initialDebitCard =
      initialDebitCardList.find((card) => card.cardName === debitCardName) ?? initialDebitCardList[0];

    // УСТАНАВЛИВАЕМ КАРТУ ИЗ КОНСТАНТЫ
    dispatch(specialProgramsActions.setItem({ item: initialDebitCard, initial }));
  };
};
