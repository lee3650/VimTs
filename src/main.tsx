import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import PlayGround from './pages/PlayGroundPage'
import HomePage from './pages/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LessonPage from './pages/LessonPage/LessonPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route path="/playground/*" element={<PlayGround />} />
        <Route path="/learning/*" element={<LessonPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
