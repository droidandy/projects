import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimpleModalControl } from 'components/SimpleModal';
import { MessageModalName } from 'types/MessageModal';
import { initialState } from '../initial-state';

export const { reducer, actions } = createSlice({
  name: 'messageModal',
  initialState: initialState.messageModal,
  reducers: {
    open(state, action: PayloadAction<MessageModalName>) {
      return {
        ...state,
        open: true,
        variant: action.payload,
      };
    },
    openWithControls(state, action: PayloadAction<{ name: MessageModalName; controls: SimpleModalControl[] }>) {
      return {
        ...state,
        open: true,
        variant: action.payload.name,
        controls: action.payload.controls,
      };
    },
    openWithCallback(state, action: PayloadAction<{ name: MessageModalName; callbackOnClose: () => void }>) {
      return { ...state, open: true, variant: action.payload.name, callbackOnClose: action.payload.callbackOnClose };
    },
    close(state) {
      if (state.callbackOnClose) state.callbackOnClose();
      return { ...state, open: false, controls: [], callbackOnClose: undefined };
    },
  },
});
