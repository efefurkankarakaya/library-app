import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import bookReducer from "./slices/bookSlice";

const middlewareConfig = {
  serializableCheck: false /* To store Realm.BSON.ObjectId */,
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    book: bookReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfig),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
