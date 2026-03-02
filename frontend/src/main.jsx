import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import { store } from './Redux/Store.js'
import './index.css'
import App from './App.jsx'
import { AlertProvider } from './alerts/context/AlertContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AlertProvider>
    <Provider store={store}>
    <App />
    </Provider>
    </AlertProvider>
  </StrictMode>,
)
