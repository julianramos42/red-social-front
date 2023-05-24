import { configureStore } from "@reduxjs/toolkit";
import modalReducer from './NotificationsModal/reducer.js'

export const store = configureStore({
  reducer: {
    modalReducer
  },
});
