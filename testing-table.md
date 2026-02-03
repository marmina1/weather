# Weather App Testing Table

This document outlines comprehensive test cases for the Weather App, focusing on boundary and edge cases. The app allows users to enter a city name, fetches coordinates via Nominatim API, and retrieves weather data via Open-Meteo API.

## Test Case Table

| Test Case ID | Description | Type | Preconditions | Steps | Expected Result | Actual Result | Pass/Fail |
|--------------|-------------|------|---------------|-------|-----------------|---------------|-----------|
| TC001 | Valid city name (common) | Normal | App loaded | 1. Enter "London" in input<br>2. Click button or trigger onBlur | Current weather and hourly forecast displayed | Expected result | Pass |
| TC002 | Valid city name (with spaces) | Normal | App loaded | 1. Enter "New York" in input<br>2. Click button | Weather data for New York displayed | Expected result | Pass |
| TC003 | Valid city name (accented characters) | Edge | App loaded | 1. Enter "München" in input<br>2. Click button | Weather data for Munich displayed | Expected result | Pass |
| TC004 | Valid city name (case insensitive) | Edge | App loaded | 1. Enter "PARIS" in input<br>2. Click button | Weather data for Paris displayed | Expected result | Pass |
| TC005 | Empty input | Boundary | App loaded | 1. Leave input empty<br>2. Click button | No action, no API calls | Expected result | Pass |
| TC006 | Input with only spaces | Boundary | App loaded | 1. Enter "   " in input<br>2. Click button | No action, no API calls | Expected result | Pass |
| TC007 | Non-existent city | Edge | App loaded | 1. Enter "NonExistentCity123" in input<br>2. Click button | Alert: "City not found. Please try again." | Expected result | Pass |
| TC008 | City name with numbers | Edge | App loaded | 1. Enter "City123" in input<br>2. Click button | Alert: "City not found. Please try again." (assuming no such city) | Expected result | Pass |
| TC009 | Very long city name | Boundary | App loaded | 1. Enter a string > 100 characters<br>2. Click button | API call made, but may fail or succeed based on API limits | Expected result | Pass |
| TC010 | Special characters in input | Edge | App loaded | 1. Enter "!@#$%^&*()" in input<br>2. Click button | Alert: "City not found. Please try again." | Expected result | Pass |
| TC011 | SQL injection attempt | Edge | App loaded | 1. Enter "'; DROP TABLE users; --" in input<br>2. Click button | No injection, treated as string, likely "City not found" | Expected result | Pass |
| TC012 | City at extreme latitude (North Pole) | Boundary | App loaded | 1. Enter "North Pole" or similar<br>2. Click button | Weather data displayed if coordinates found | Expected result | Pass |
| TC013 | City at extreme latitude (South Pole) | Boundary | App loaded | 1. Enter "South Pole" or similar<br>2. Click button | Weather data displayed if coordinates found | Expected result | Pass |
| TC014 | City near equator | Boundary | App loaded | 1. Enter "Quito" in input<br>2. Click button | Weather data displayed | Expected result | Pass |
| TC015 | Network failure (Nominatim) | Edge | Simulate offline | 1. Disconnect internet<br>2. Enter valid city<br>3. Click button | Alert: "Error fetching city location. Please try again later." | Expected result | Pass |
| TC016 | Network failure (Weather API) | Edge | Simulate offline after geocoding | 1. Enter city, get coordinates<br>2. Disconnect during weather fetch | Error message: "Weather error: [error message]" | Expected result | Pass |
| TC017 | API rate limit exceeded | Boundary | Exceed Nominatim rate limit | 1. Make multiple rapid requests | Alert or error handling | Expected result | Pass |
| TC018 | Invalid API response (Nominatim) | Edge | Mock API to return invalid JSON | 1. Enter city<br>2. Click button | Alert: "Error fetching city location. Please try again later." | | |
| TC019 | Invalid API response (Weather) | Edge | Mock API to return invalid JSON | 1. Enter city<br>2. Click button | Error message: "Weather error: [error message]" | | |
| TC020 | API returns empty results (Nominatim) | Edge | Mock API to return [] | 1. Enter city<br>2. Click button | Alert: "City not found. Please try again." | | |
| TC021 | API returns partial data (Weather) | Edge | Mock API to return incomplete data | 1. Enter city<br>2. Click button | App handles missing fields gracefully (e.g., no crash) | | |
| TC022 | Extreme temperature values | Boundary | Mock weather API with temp > 100°C or < -100°C | 1. Enter city<br>2. Click button | Displays extreme values without UI issues | | |
| TC023 | Negative wind speed | Boundary | Mock weather API with negative wind speed | 1. Enter city<br>2. Click button | Displays as is (may be invalid data) | | |
| TC024 | Invalid wind direction | Boundary | Mock weather API with wind direction > 360 | 1. Enter city<br>2. Click button | Displays as is | | |
| TC025 | Future timestamp in weather data | Boundary | Mock API with future time | 1. Enter city<br>2. Click button | Displays future time | | |
| TC026 | Past timestamp in weather data | Boundary | Mock API with past time | 1. Enter city<br>2. Click button | Displays past time | | |
| TC027 | Hourly forecast with less than 24 hours | Boundary | Mock API with fewer hourly data points | 1. Enter city<br>2. Click button | Displays available hours without error | | |
| TC028 | Hourly forecast with more than 24 hours | Boundary | Mock API with more data | 1. Enter city<br>2. Click button | Displays first 24 hours as per code | | |
| TC029 | UI loading state | Normal | App loaded | 1. Enter city<br>2. Click button<br>3. Observe during fetch | "Loading weather..." shown | Expected result | Pass |
| TC030 | UI error state | Normal | Trigger error | 1. Enter invalid city<br>2. Click button | Error message displayed | Expected result | Pass |
| TC031 | Multiple rapid clicks | Boundary | App loaded | 1. Click button multiple times quickly | Only one request processed (Redux handles) | All requests gets processed with API rate limit | Fail |
| TC032 | Browser back/forward | Edge | App loaded | 1. Navigate away and back | State preserved or reset appropriately | Expected result | Pass |
| TC033 | Mobile responsiveness | Edge | On mobile device | 1. Load app<br>2. Enter city | UI adapts to screen size | Expected result | Pass |
| TC034 | Accessibility (keyboard navigation) | Edge | App loaded | 1. Tab through elements<br>2. Enter city with keyboard | All interactive elements accessible | Expected result | Pass |
| TC035 | Browser compatibility (Chrome, Firefox, Safari) | Edge | Different browsers | 1. Load app<br>2. Test functionality | Works across browsers | Expected result with Chrome and Microsoft Edge | Pass |

## Notes
- Boundary cases include extreme inputs, API edge responses, and UI limits.
- Edge cases cover error conditions, invalid data, and unusual user inputs.
- Some tests may require mocking APIs or network conditions.
- **Mock API Explanation**: Mocking an API means simulating or faking the API's response to test how the app handles specific data scenarios without relying on the real API. This is useful for testing edge cases like invalid data or extreme values that the real API might not return.
- **How to Test Mock API Cases**:
  - **Option 1 (Code Modification)**: Temporarily edit the code (e.g., in `weatherSlice.js` or `Home.jsx`) to return fake data instead of calling the real API. For example, replace the fetch with a return statement that provides the desired mock response.
  - **Option 2 (Browser Tools)**: Use browser developer tools (e.g., Chrome DevTools Network tab) to intercept and modify API responses. Right-click on the API request and select "Override" or use extensions like "Requestly" to mock responses.
  - **Option 3 (Testing Framework)**: If using a testing library like Jest, write unit tests that mock the fetch function to return specific data.
  - After testing, revert any code changes to restore normal functionality.