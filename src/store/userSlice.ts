// store/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  username: null,
  avatar: null,
  role: null,
  isSubscribed: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => ({ ...state, ...action.payload }),
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
