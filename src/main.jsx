import { createRoot } from 'react-dom/client'
import './reset.css'
import './tailwind.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter >
    <App />
  </BrowserRouter>,
)
