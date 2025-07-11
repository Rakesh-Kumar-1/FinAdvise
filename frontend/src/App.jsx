import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import Pages from './Pages'
import { UserProvider } from './Pages/Context/UserProvider'

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Pages/>
      </UserProvider>
    </Router>
  )
}

export default App