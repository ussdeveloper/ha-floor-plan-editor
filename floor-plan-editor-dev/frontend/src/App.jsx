import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Toaster } from 'react-hot-toast'

import Layout from './components/Layout'
import Editor from './pages/Editor'
import Projects from './pages/Projects'
import Settings from './pages/Settings'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Layout>
            <Routes>
              <Route path="/" element={<Projects />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/editor/:projectId" element={<Editor />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </DndProvider>
  )
}

export default App