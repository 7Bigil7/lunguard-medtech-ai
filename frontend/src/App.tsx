import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Header } from './components/layout/Header'
import { DemoModeBanner } from './components/layout/DemoModeBanner'
import { Footer } from './components/layout/Footer'
import { Landing } from './pages/Landing'
import { Workspace } from './pages/Workspace'
import { Evaluation } from './pages/Evaluation'

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900">
          {/* Global Mode Banner */}
          <DemoModeBanner />

          {/* Persistent Clinical Navigation */}
          <Header />

          {/* Main Route Content */}
          <main className="flex-1" id="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/evaluation" element={<Evaluation />} />
              <Route path="/safety-engine" element={<Navigate to="/workspace" replace />} />
              {/* Fallback to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Persistent Clinical Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
