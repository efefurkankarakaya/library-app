import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logJSON } from "../../utils/utils";
import Loan from "../../models/Loan";

type TLoanResults = Realm.Results<Loan & Realm.Object<unknown, never>> | null;

interface LoanState {
  loans: TLoanResults;
}

const initialState: LoanState = {
  loans: null,
} as LoanState;

export const loanSlice = createSlice({
  name: "loan",
  initialState,
  reducers: {
    updateLoansInStore: (state, action: PayloadAction<TLoanResults>) => {
      logJSON(action.payload, "[Store]");
      state.loans = action.payload;
    },
  },
});

export const { updateLoansInStore } = loanSlice.actions;

export default loanSlice.reducer;
