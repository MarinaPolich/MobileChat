import { createSlice } from "@reduxjs/toolkit";

const state = [];

export const postsSlice = createSlice({
  name: "posts",
  initialState: state,
  reducers: {
    updatePosts: (state, { payload }) => {
      console.log("payload :>> ", payload);
      return payload;
    },
    updatePostById: (state, { payload }) => {
      const index = state.findIndex(({ id }) => id === payload.id);
      state[index] = { ...state[index], ...payload };
    },
  },
});

export const { updatePosts, updatePostById } = postsSlice.actions;
