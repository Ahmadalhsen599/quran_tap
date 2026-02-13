import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Navbar from './components/navbar/navbar.jsx'
import Verse from './components/verse/verse.jsx'
import Layout from './layouts/Layout.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  
  <Layout/>
 
)
