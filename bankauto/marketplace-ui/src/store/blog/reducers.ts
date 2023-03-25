/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlogCategories, BlogPosts } from '@marketplace/ui-kit/types';
import { baseReducers } from 'store/utils/baseReducers';
import { initialState } from 'store/initial-state';

export const { reducer, actions } = createSlice({
  name: 'blog',
  initialState: initialState.blog,
  reducers: {
    setBlogPosts: (state, action: PayloadAction<{ posts: BlogPosts; initial: boolean | null }>) => {
      const items = action.payload?.posts?.items || [];
      state.posts = { count: 4, items };
      state.initial = action.payload.initial;
      state.loading = false;
    },
    setBlogCategories: (state, action: PayloadAction<{ blogCategories: BlogCategories }>) => {
      state.blogCategories = action.payload?.blogCategories;
      state.loading = false;
    },

    ...baseReducers,
  },
});
