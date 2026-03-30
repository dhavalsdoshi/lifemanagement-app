import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { IS_TAURI, initTauriStorage } from './utils/storage.js'

async function bootstrap() {
  await initTauriStorage()

  const Router = IS_TAURI ? HashRouter : BrowserRouter
  const basename = IS_TAURI ? undefined : import.meta.env.BASE_URL

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Router basename={basename}>
        <App />
      </Router>
    </StrictMode>,
  )
}

bootstrap()
