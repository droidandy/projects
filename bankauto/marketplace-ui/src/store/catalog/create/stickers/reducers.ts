import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StickerData } from '@marketplace/ui-kit/types';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'vehicleCreateStickers',
  initialState: initialState.vehicleCreateStickers,
  reducers: {
    setStickers: (
      state,
      { payload: { stickers, initial } }: PayloadAction<{ stickers: StickerData[]; initial: boolean | null }>,
    ) => ({
      ...state,
      stickers,
      loading: false,
      initial,
    }),
    ...baseReducers,
  },
});
