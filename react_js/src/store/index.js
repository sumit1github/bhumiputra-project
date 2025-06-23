import { configureStore } from "@reduxjs/toolkit";
import roomSlice from "./Slices/Room/RoomSlice";
const store = configureStore({
  reducer: {
    room: roomSlice,
  },
});

export default store;
