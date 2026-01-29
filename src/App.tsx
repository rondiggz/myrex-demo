import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Vision from './pages/Vision'
import Assets from './pages/Assets'
import MediaLibrary from './pages/MediaLibrary'
import Calendar from './pages/Calendar'
import Users from './pages/Users'
import Settings from './pages/Settings'
import MarksEditor from './pages/MarksEditor'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="vision" element={<Vision />} />
          <Route path="assets" element={<Assets />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="marks" element={<MarksEditor />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App