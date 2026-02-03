import { Provider } from 'react-redux'
import { store } from './store'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'


function App() {
  return (
    <Provider store={store}>
      <Router>
          <Routes>
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
