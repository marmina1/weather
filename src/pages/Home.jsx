// Core UI for searching a city and displaying current + hourly weather.
import { fetchWeather } from '../features/weather/weatherSlice'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import React from 'react';

// Home page: owns search input and renders weather results from Redux.
function Home() {
  const weather = useSelector((state) => state.weather)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  // Local input state for city name search.
  const [city, setCity] = useState('')

  // Core flow: geocode city -> dispatch weather fetch by coordinates.
  const fetchWeatherForCity = async (cityName) => {
    if (loading) return; // Prevent multiple simultaneous fetches
    if (!cityName.trim()) return;

    setLoading(true);
    try {
      // Nominatim geocoding API for city -> lat/lon.
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`);
      const data = await response.json();
      if (data.length > 0) {
        // Convert first result to numeric coordinates.
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        // Trigger async weather fetch in Redux.
        dispatch(fetchWeather({ latitude, longitude }));
      } else {
        // User feedback when no match is found.
        alert('City not found. Please try again.');
      }
    } catch (error) {
      // Network or parsing error in geocoding.
      console.error('Error fetching city location:', error);
      alert('Error fetching city location. Please try again later.');

    }
    setLoading(false);
  }
  // Derived data from Redux store for display.
  const currentWeather = weather.data?.current_weather
  const hourly = weather.data?.hourly

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Weather App</h1>
      <div>
        <input 
        type='text' 
        placeholder="city name (e.g., London)" 
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={weather.loading}
        // Optional search on blur for quicker UX.
        onBlur={(e) => { fetchWeatherForCity(e.target.value) }}
        /> <button disabled={weather.loading} onClick={() => { fetchWeatherForCity(city);  }}>citttyyy boyyy</button>
      </div>
      <div>
        <h2>Current Weather</h2>
        {/* UI state: loading + error from Redux. */}
        {weather.loading && <p>Loading weather...</p>}
        {weather.error && <p>Weather error: {weather.error}</p>}
        {currentWeather && (
          <div>
            {/* Core weather fields from Open-Meteo. */}
            <p><strong>Temperature:</strong> {currentWeather.temperature}°C</p>
            <p><strong>Wind Speed:</strong> {currentWeather.windspeed} km/h</p>
            <p><strong>Wind Direction:</strong> {currentWeather.winddirection}°</p>
            <p><strong>Time:</strong> {new Date(currentWeather.time).toLocaleString()}</p>
          </div>
        )}
      </div>
      {hourly && (
        <div>
          <h2>Hourly Forecast (Next 24 hours)</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {/* Render first 24 hours of hourly temps. */}
            {hourly.temperature_2m.slice(0, 24).map((temp, index) => (
              <div key={index} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                <p><strong>{new Date(hourly.time[index]).toLocaleTimeString()}</strong></p>
                <p>{temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home