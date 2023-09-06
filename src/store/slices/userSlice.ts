import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserDataComplete } from "../../types/commonTypes";
import { temporaryDataID } from "../../common/static";

interface UserState {
  isLoggedIn: boolean;
  isSU: boolean;
  data: Partial<UserDataComplete>;
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
    updateActiveUser: (state, action: PayloadAction<Partial<UserDataComplete>>) => {
      state.data = action.payload;
    },
    resetActiveUser: (state) => {
      state.isLoggedIn = false;
      state.isSU = false;
      state.data._id = temporaryDataID;
      state.data.fullName = "";
      state.data.email = "";
      state.data.phoneNumber = "";
    },
  },
});

export const { logIn, logOut, grantPermission, revokePermission, updateEmail, updateActiveUser, resetActiveUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
