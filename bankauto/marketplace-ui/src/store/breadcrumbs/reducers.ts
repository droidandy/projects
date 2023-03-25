import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/initial-state';
import { BreadCrumbsItem } from 'types/BreadCrumbs';

export const { reducer, actions } = createSlice({
  name: 'breadCrumbs',
  initialState: initialState.breadCrumbs,
  reducers: {
    setBreadCrumbs: (state, action: PayloadAction<{ items: BreadCrumbsItem[] }>) => {
      state.items = action.payload.items;
    },
  },
});
