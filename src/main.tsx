
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ServiceWorkerNotification } from './components/ServiceWorkerNotification'

console.log("[main.tsx] React import is", React);
console.log("[main.tsx] React version is", React.version);

const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <App />
    <ServiceWorkerNotification />
  </React.StrictMode>
)
