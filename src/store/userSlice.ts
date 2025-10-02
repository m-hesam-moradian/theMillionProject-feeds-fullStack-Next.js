import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  username: string;
  avatar: string;
  role: string;
  isSubscribed: boolean;
}

const initialState: UserState = {
  id: "",
  username: "",
  avatar: "",
  role: "USER",
  isSubscribed: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...action.payload };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
