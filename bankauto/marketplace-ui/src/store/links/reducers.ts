/* eslint-disable no-param-reassign */
import { LinkItem } from '@marketplace/ui-kit/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'links',
  initialState: initialState.links,
  reducers: {
    setLinks: (state, action: PayloadAction<{ links: LinkItem[] }>) => {
      state.items = action.payload?.links;
      state.loading = false;
    },

    ...baseReducers,
  },
});
