// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import encryptedStorage from "./encryptedStorage"; // Use encrypted storage instead of default
import { combineReducers } from "redux";

import roomSlice from "./Slices/Room/RoomSlice";
import authSlice from "./Slices/Room/UserSlice";

// Combine reducers
const rootReducer = combineReducers({
  room: roomSlice,
  user: authSlice,
});

// Persist configuration with encrypted storage
const persistConfig = {
  key: "root",
  storage: encryptedStorage, // Use encrypted storage
  whitelist: ["user"], // only persist 'user' slice (e.g., auth info)
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;
