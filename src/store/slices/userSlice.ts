import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UserState {
  isLoggedIn: boolean;
  token: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  token: null,
} as UserState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state) => {
      state.isLoggedIn = true;
    },
    logOut: (state) => {
      state.isLoggedIn = false;
    },
    // TODO: Remove this fn
    fn: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
