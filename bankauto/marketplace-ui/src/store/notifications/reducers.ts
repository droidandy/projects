import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from 'types/Notification';
import { initialState } from '../initial-state';

export const { reducer, actions } = createSlice({
  name: 'notifications',
  initialState: initialState.notifications,
  reducers: {
    addMessage: (state, { payload }: PayloadAction<NotificationItem>) => ({
      ...state,
      messages: [...state.messages, payload],
    }),
    removeMessage: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      messages: state.messages.filter((m) => m.id !== payload),
    }),
    clearMessages: (state) => ({
      ...state,
      messages: [],
    }),
  },
});
