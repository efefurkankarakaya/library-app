import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Store } from "@reduxjs/toolkit";
import type { ImagePickerAsset } from "expo-image-picker";
import { BookData } from "../../types/commonTypes";

type TBase64 = ImagePickerAsset["base64"];

// TODO: Refactor here
interface StoreBookData extends BookData {
  _id: Realm.BSON.ObjectId;
  bookImage: TBase64;
}

// TODO: Refactor here
interface BookState {
  base64: TBase64;
  data: StoreBookData;
  authors: string;
  genres: string;
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
      state.base64 = action.payload;
    },
    updateBookInStore: (state, action: PayloadAction<StoreBookData>) => {
      state.data = action.payload;
    },
  },
});

export const { updateImageInStore, updateBookInStore } = bookSlice.actions;

export default bookSlice.reducer;
