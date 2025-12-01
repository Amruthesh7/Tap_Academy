import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import leaveReducer from '../features/leaveSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    leaves: leaveReducer,
  },
});

export default store;


