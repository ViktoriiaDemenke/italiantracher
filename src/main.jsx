import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { PrefsProvider, bootUiPrefs } from './i18n.js'
import './index.css'

bootUiPrefs()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
)
