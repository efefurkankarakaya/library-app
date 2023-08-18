import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UserState {
  isLoggedIn: boolean;
  isSU: boolean;
}

const initialState: UserState = {
  isLoggedIn: false,
  isSU: false,
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
    grantPermission: (state) => {
      state.isSU = true;
    },
    revokePermission: (state) => {
      state.isSU = false;
    },
  },
});

export const { logIn, logOut, grantPermission, revokePermission } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
