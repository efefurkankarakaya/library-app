import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ImagePickerAsset } from "expo-image-picker";

type TBase64 = ImagePickerAsset["base64"];

interface BookState {
  bookImage: TBase64;
}

const initialState: BookState = {
  bookImage: null, // TODO: Should be string only.
} as BookState;

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    updateImageInStore: (state, action: PayloadAction<TBase64>) => {
      state.bookImage = action.payload;
    },
  },
});

export const { updateImageInStore } = bookSlice.actions;

export default bookSlice.reducer;
