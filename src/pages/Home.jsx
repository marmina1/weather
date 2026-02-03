import { fetchWeather } from '../features/weather/weatherSlice'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import React from 'react';

function Home() {
  const weather = useSelector((state) => state.weather)
  const dispatch = useDispatch()
  const [city, setCity] = useState('')

  const fetchWeatherForCity = async (cityName) => {
    if (!cityName.trim()) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`);
      const data = await response.json();
      if (data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        dispatch(fetchWeather({ latitude, longitude }));
      } else {
        alert('City not found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching city location:', error);
      alert('Error fetching city location. Please try again later.');
    }
  }

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
        onBlur={(e) => { fetchWeatherForCity(e.target.value) }}
        /> <button onClick={() => { fetchWeatherForCity(city); }}>citttyyy boyyy</button>
      </div>
      <div>
        <h2>Current Weather</h2>
        {weather.loading && <p>Loading weather...</p>}
        {weather.error && <p>Weather error: {weather.error}</p>}
        {currentWeather && (
          <div>
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