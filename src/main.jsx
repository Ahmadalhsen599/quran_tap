import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Navbar from './components/navbar/navbar.jsx'
import Verse from './components/verse/verse.jsx'
import Layout from './layouts/Layout.jsx'
import { AudioProvider } from './context/AudioContext.jsx'
import './App.css'
import { PopupProvider } from "../src/context/PopupContext.jsx";

createRoot(document.getElementById('root')).render(
 <AudioProvider>
  <PopupProvider>
    <Layout />
  </PopupProvider>
</AudioProvider>

 
 
)
