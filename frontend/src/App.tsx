import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage }      from './pages/LoginPage'
import { RegisterPage }   from './pages/RegisterPage'
import { HomePage }       from './pages/HomePage'
import { DiagnosticoPage } from './pages/DiagnosticoPage'
import { ProtocoloPage }  from './pages/ProtocoloPage'
import { ResultadoPage }  from './pages/ResultadoPage'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/diagnostico" element={<ProtectedRoute><DiagnosticoPage /></ProtectedRoute>} />
          <Route path="/protocolo"   element={<ProtectedRoute><ProtocoloPage /></ProtectedRoute>} />
          <Route path="/resultado"   element={<ProtectedRoute><ResultadoPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
