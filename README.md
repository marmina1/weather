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
| TC018 | UI loading state | Normal | App loaded | 1. Enter city<br>2. Click button<br>3. Observe during fetch | "Loading weather..." shown | Expected result | Pass |
| TC019 | UI error state | Normal | Trigger error | 1. Enter invalid city<br>2. Click button | Error message displayed | Expected result | Pass |
| TC020 | Multiple rapid clicks | Boundary | App loaded | 1. Click button multiple times quickly | Only one request processed (Redux handles) | All requests gets processed with API rate limit | Fail (old) |
| TC020.5 | Multiple rapid clicks | Boundary | App loaded | 1. Click button multiple times quickly | Only one request processed (Redux handles) | Only one request processed (frontend handles) | Pass (fixed) |
| TC021 | Browser back/forward | Edge | App loaded | 1. Navigate away and back | State preserved or reset appropriately | Expected result | Pass |
| TC022 | Mobile responsiveness | Edge | On mobile device | 1. Load app<br>2. Enter city | UI adapts to screen size | Expected result | Pass |
| TC023 | Accessibility (keyboard navigation) | Edge | App loaded | 1. Tab through elements<br>2. Enter city with keyboard | All interactive elements accessible | Expected result | Pass |
| TC024 | Browser compatibility (Chrome, Firefox, Safari) | Edge | Different browsers | 1. Load app<br>2. Test functionality | Works across browsers | Expected result with Chrome and Microsoft Edge | Pass |



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
