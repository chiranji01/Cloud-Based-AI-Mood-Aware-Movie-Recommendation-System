import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './pages/mood.jsx'
import Mood from './pages/mood.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Mood />
  </StrictMode>,
)