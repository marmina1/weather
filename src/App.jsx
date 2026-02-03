// Root app shell: provides Redux store + routing.
import { Provider } from 'react-redux'
import { store } from './store'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'


// App component wires global providers and routes.
function App() {
  return (
    // Global Redux store provider for the entire app.
    <Provider store={store}>
      {/* Client-side routing for pages. */}
      <Router>
          <Routes>
          {/* Fallback route for unknown paths. */}
          <Route path='*' quote="true" element={<h1>404 Not Found</h1>} />
            <Route path="/" element={
                <Home />   
            } />
             <Route path="/about" element={
                <About />   
            } />
          </Routes>
        </Router>
    </Provider>
  )
}

export default App
