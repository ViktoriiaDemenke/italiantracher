import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'
import App from './App.jsx'
import { PrefsProvider, bootUiPrefs } from './i18n.js'
import './index.css'

bootUiPrefs()

async function bootNativeShell() {
  if (!Capacitor.isNativePlatform()) return
  try {
    await StatusBar.setOverlaysWebView({ overlay: true })
    await StatusBar.setStyle({ style: Style.Light })
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#12181F' })
    }
  } catch {
    /* StatusBar is optional on web preview */
  }
  try {
    await SplashScreen.hide()
  } catch {
    /* SplashScreen is optional on web preview */
  }
}

void bootNativeShell()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
)
