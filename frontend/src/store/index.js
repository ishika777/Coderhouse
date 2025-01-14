import { configureStore } from '@reduxjs/toolkit';
import auth from './auth-slice';
import activate from './activate-slice';
import {thunk} from 'redux-thunk'; 

// Configure the store
export const store = configureStore({
  reducer: {
    auth,
    activate
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),  // A
});
