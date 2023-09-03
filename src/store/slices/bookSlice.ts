import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Store } from "@reduxjs/toolkit";
import { BookDataComplete, TBase64 } from "../../types/commonTypes";
import { temporaryDataID } from "../../common/static";
import { logWithTime } from "../../utils/utils";

// TODO: Refactor here
interface BookState {
  base64: TBase64;
  data: BookDataComplete;
}

const initialState: BookState = {
  base64: null, // TODO: Should be string only.
  data: {},
} as BookState;

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    updateImageInStore: (state, action: PayloadAction<TBase64>) => {
      state.data.bookImage = action.payload;
    },
    updateBookInStore: (state, action: PayloadAction<BookDataComplete>) => {
      state.data = action.payload;
    },
    resetBook: (state) => {
      logWithTime("[Book | Reset]");
      state.data = {
        _id: temporaryDataID,
        bookName: "",
        bookImage: "",
        bookDescription: "",
        isbn: "",
        authors: "",
        genres: "",
        isHardcover: false,
      };
    },
  },
});

export const { updateImageInStore, updateBookInStore, resetBook } = bookSlice.actions;

export default bookSlice.reducer;
