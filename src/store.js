// Redux store configuration for the app.
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './features/weather/weatherSlice';

// Root store: currently only the weather slice.
export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});