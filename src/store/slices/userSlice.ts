import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserDataComplete } from "../../types/commonTypes";

interface UserState {
  isLoggedIn: boolean;
  isSU: boolean;
  data: UserDataComplete;
}

const initialState: UserState = {
  isLoggedIn: false,
  isSU: false,
  data: {},
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
    updateEmail: (state, action: PayloadAction<string>) => {
      state.data.email = action.payload;
    },
    updateActiveUser: (state, action: PayloadAction<UserDataComplete>) => {
      state.data = action.payload;
    },
  },
});

export const { logIn, logOut, grantPermission, revokePermission, updateEmail, updateActiveUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
