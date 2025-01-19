import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Meet from './pages/meet'

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/start' element = {<Meet />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
