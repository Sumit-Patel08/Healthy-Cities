import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Air from './pages/Air'
import Heat from './pages/Heat'
import Water from './pages/Water'
import Urban from './pages/Urban'
import Indices from './pages/Indices'
import About from './pages/About'

// Components
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import AlertBanner from './components/AlertBanner'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)

  const addAlert = (alert) => {
    setAlerts(prev => [...prev, { ...alert, id: Date.now() }])
  }

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  return (
    <Router>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={
            <div className="flex h-screen overflow-hidden">
              {/* Sidebar */}
              <Sidebar 
                collapsed={sidebarCollapsed} 
                onToggle={toggleSidebar}
              />
              
              {/* Main Content */}
              <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                sidebarCollapsed ? 'ml-16' : 'ml-64'
              }`}>
                {/* Navbar */}
                <Navbar 
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                  onToggleSidebar={toggleSidebar}
                />
                
                {/* Alert Banners */}
                <AnimatePresence>
                  {alerts.map(alert => (
                    <AlertBanner
                      key={alert.id}
                      alert={alert}
                      onClose={() => removeAlert(alert.id)}
                    />
                  ))}
                </AnimatePresence>
                
                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard onAlert={addAlert} />} />
                      <Route path="/air" element={<Air onAlert={addAlert} />} />
                      <Route path="/heat" element={<Heat onAlert={addAlert} />} />
                      <Route path="/water" element={<Water onAlert={addAlert} />} />
                      <Route path="/urban" element={<Urban onAlert={addAlert} />} />
                      <Route path="/indices" element={<Indices onAlert={addAlert} />} />
                      <Route path="/about" element={<About />} />
                    </Routes>
                  </AnimatePresence>
                </main>
                
                {/* Footer */}
                <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span>Data Sources: NASA, USGS, CPCB</span>
                      <span>•</span>
                      <span>Last Updated: {new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <a 
                        href="https://github.com/cityforge/mumbai-pulse" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-cyan-500 transition-colors"
                      >
                        GitHub
                      </a>
                      <span>•</span>
                      <span>CityForge v1.0</span>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
