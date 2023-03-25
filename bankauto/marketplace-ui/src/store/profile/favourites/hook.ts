import { useSelector } from 'react-redux';
import { useStateBase } from 'store/utils';
import { StateModel } from 'store/types';
import * as thunkActions from './actions';
import { actions } from './reducers';

export const useFavourites = () => {
  return useStateBase('favourites', actions, thunkActions);
};

export const useIsInFavorites = (id: number) => {
  return useSelector<StateModel, boolean>((store) => !!store.favourites.items.find((item) => item.id === id));
};
