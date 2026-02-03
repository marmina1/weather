import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import weatherReducer from '../features/weather/weatherSlice'
import Home from './Home'

// Mock fetch globally
global.fetch = vi.fn()

describe('Home Component', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        weather: weatherReducer,
      },
    })
    vi.clearAllMocks()
  })

  const renderWithProvider = (component) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    )
  }

  // TC018: Invalid API response (Nominatim) - Mock API to return invalid JSON
  it('should handle invalid JSON from Nominatim API', async () => {
    // Mock Nominatim to return invalid JSON
    fetch.mockImplementation((url) => {
      if (url.includes('nominatim')) {
        return Promise.resolve({
          json: () => Promise.reject(new Error('Invalid JSON')),
        })
      }
      // For weather API, return valid data
      return Promise.resolve({
        json: () => Promise.resolve({
          current_weather: { temperature: 20, windspeed: 10, winddirection: 90, time: '2023-01-01T00:00' },
          hourly: { temperature_2m: [20], time: ['2023-01-01T00:00'] }
        }),
      })
    })

    renderWithProvider(<Home />)

    const input = screen.getByPlaceholderText(/city name/i)
    const button = screen.getByText(/citttyyy boyyy/i)

    fireEvent.change(input, { target: { value: 'London' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Error fetching city location/i)).toBeInTheDocument()
    })
  })

  // TC020: API returns empty results (Nominatim) - Mock API to return []
  it('should handle empty results from Nominatim API', async () => {
    fetch.mockImplementation((url) => {
      if (url.includes('nominatim')) {
        return Promise.resolve({
          json: () => Promise.resolve([]), // Empty array
        })
      }
      return Promise.resolve({
        json: () => Promise.resolve({
          current_weather: { temperature: 20, windspeed: 10, winddirection: 90, time: '2023-01-01T00:00' },
          hourly: { temperature_2m: [20], time: ['2023-01-01T00:00'] }
        }),
      })
    })

    renderWithProvider(<Home />)

    const input = screen.getByPlaceholderText(/city name/i)
    const button = screen.getByText(/citttyyy boyyy/i)

    fireEvent.change(input, { target: { value: 'NonExistentCity' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/City not found/i)).toBeInTheDocument()
    })
  })
})