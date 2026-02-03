// Redux slice for weather data and async fetch logic.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching weather data
// Async thunk: fetch weather by coordinates from Open-Meteo API.
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async ({ latitude, longitude }) => {
    // Open-Meteo API returns current weather + hourly temps.
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true&timezone=auto`);
    const data = await response.json();
    return data;
  }
);

// Core weather slice state and reducers.
const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Clears weather data/errors (optional UI reset).
    clearWeather: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending: request in-flight.
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
      })
      // Fulfilled: store API response.
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      // Rejected: capture error message.
      .addCase(fetchWeather.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;
