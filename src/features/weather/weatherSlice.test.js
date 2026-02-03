import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import weatherReducer, { fetchWeather } from './weatherSlice'

// Mock fetch globally
global.fetch = vi.fn()

describe('weatherSlice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        weather: weatherReducer,
      },
    })
    vi.clearAllMocks()
  })

  it('should handle fetchWeather.pending', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ current_weather: { temperature: 20 }, hourly: { temperature_2m: [20, 21], time: ['2023-01-01T00:00', '2023-01-01T01:00'] } }),
    })

    await store.dispatch(fetchWeather({ latitude: 51.5, longitude: -0.1 }))

    const state = store.getState().weather
    expect(state.loading).toBe(false)
    expect(state.data).toBeDefined()
  })

  // TC018: Invalid API response (Weather) - Mock API to return invalid JSON
  it('should handle invalid JSON response from weather API', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(new Error('Invalid JSON')),
    })

    await store.dispatch(fetchWeather({ latitude: 51.5, longitude: -0.1 }))

    const state = store.getState().weather
    expect(state.loading).toBe(false)
    expect(state.error).toBeDefined()
  })

  // TC021: API returns partial data (Weather) - Mock API to return incomplete data
  it('should handle partial data from weather API', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ current_weather: { temperature: 20 } }), // Missing hourly
    })

    await store.dispatch(fetchWeather({ latitude: 51.5, longitude: -0.1 }))

    const state = store.getState().weather
    expect(state.loading).toBe(false)
    expect(state.data.current_weather).toBeDefined()
    // App should handle missing hourly gracefully
  })

  // TC022: Extreme temperature values - Mock weather API with temp > 100°C or < -100°C
  it('should handle extreme temperature values', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        current_weather: { temperature: 150, windspeed: 10, winddirection: 90, time: '2023-01-01T00:00' },
        hourly: { temperature_2m: [150, -200], time: ['2023-01-01T00:00', '2023-01-01T01:00'] }
      }),
    })

    await store.dispatch(fetchWeather({ latitude: 51.5, longitude: -0.1 }))

    const state = store.getState().weather
    expect(state.loading).toBe(false)
    expect(state.data.current_weather.temperature).toBe(150)
    expect(state.data.hourly.temperature_2m[1]).toBe(-200)
  })

  // TC023: Negative wind speed - Mock weather API with negative wind speed
  it('should handle negative wind speed', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        current_weather: { temperature: 20, windspeed: -5, winddirection: 90, time: '2023-01-01T00:00' },
        hourly: { temperature_2m: [20], time: ['2023-01-01T00:00'] }
      }),
    })

    await store.dispatch(fetchWeather({ latitude: 51.5, longitude: -0.1 }))

    const state = store.getState().weather
    expect(state.data.current_weather.windspeed).toBe(-5)
  })

  // TC024: Invalid wind direction - Mock weather API with wind direction > 360
  it('should handle invalid wind direction > 360', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        current_weather: { temperature: 20, windspeed: 10, winddirection: 400, time: '2023-01-01T00:00' },
        hourly: { temperature_2m: [20], time: ['2023-01-01T00:00'] }
      }),
    })

    await store.dispatch(fetchWeather({ latitude: 51.5, longitude: -0.1 }))

    const state = store.getState().weather
    expect(state.data.current_weather.winddirection).toBe(400)
  })

  // TC025: Future timestamp in weather data - Mock API with future time
  it('should handle future timestamp', async () => {
    const futureTime = new Date(Date.now() + 86400000).toISOString() // Tomorrow
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        current_weather: { temperature: 20, windspeed: 10, winddirection: 90, time: futureTime },
        hourly: { temperature_2m: [20], time: [futureTime] }
      }),
    })

    await store.dispatch(fetchWeather({ latitude: 51.5, longitude: -0.1 }))

    const state = store.getState().weather
    expect(state.data.current_weather.time).toBe(futureTime)
  })

  // TC026: Past timestamp in weather data - Mock API with past time
  it('should handle past timestamp', async () => {
    const pastTime = '2020-01-01T00:00'
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        current_weather: { temperature: 20, windspeed: 10, winddirection: 90, time: pastTime },
        hourly: { temperature_2m: [20], time: [pastTime] }
      }),
    })

    await store.dispatch(fetchWeather({ latitude: 51.5, longitude: -0.1 }))

    const state = store.getState().weather
    expect(state.data.current_weather.time).toBe(pastTime)
  })

  // TC027: Hourly forecast with less than 24 hours - Mock API with fewer hourly data points
  it('should handle fewer than 24 hourly data points', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        current_weather: { temperature: 20, windspeed: 10, winddirection: 90, time: '2023-01-01T00:00' },
        hourly: { temperature_2m: [20, 21, 22], time: ['2023-01-01T00:00', '2023-01-01T01:00', '2023-01-01T02:00'] }
      }),
    })

    await store.dispatch(fetchWeather({ latitude: 51.5, longitude: -0.1 }))

    const state = store.getState().weather
    expect(state.data.hourly.temperature_2m).toHaveLength(3)
  })

  // TC028: Hourly forecast with more than 24 hours - Mock API with more data
  it('should handle more than 24 hourly data points', async () => {
    const temps = Array.from({ length: 30 }, (_, i) => 20 + i)
    const times = Array.from({ length: 30 }, (_, i) => `2023-01-01T${i.toString().padStart(2, '0')}:00`)
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        current_weather: { temperature: 20, windspeed: 10, winddirection: 90, time: '2023-01-01T00:00' },
        hourly: { temperature_2m: temps, time: times }
      }),
    })

    await store.dispatch(fetchWeather({ latitude: 51.5, longitude: -0.1 }))

    const state = store.getState().weather
    expect(state.data.hourly.temperature_2m).toHaveLength(30)
  })
})