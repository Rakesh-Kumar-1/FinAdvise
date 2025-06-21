import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import Pages from './Pages'
import { CounterProvider } from './Pages/Context/UserContext'

const App = () => {
  return (
    <Router>
      <CounterProvider>
        <Pages/>
      </CounterProvider>
    </Router>
  )
}

export default App