import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import RotaProtegida from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Veiculos from './pages/Vehicles'
import VehicleForm from './pages/VehicleForm'
import Frotas from './pages/Frotas'
import FrotaForm from './pages/FrotaForm'
import Lancamentos from './pages/Entry'
import Usuarios from './pages/Users'
import UserForm from './pages/UserForm'
import PasswordEditForm from './pages/PasswordEditForm'
import PaginaNaoEncontrada from './pages/NotFound'
import Reports from './pages/Reports'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <RotaProtegida>
            <Layout />
          </RotaProtegida>
        }>
          <Route index element={<Dashboard />} />
          <Route path="veiculos" element={<Veiculos />} />
          <Route path="veiculos/cadastrar" element={<VehicleForm />} />
          <Route path="veiculos/editar/:placa" element={<VehicleForm />} />
          <Route path="frotas" element={<Frotas />} />
          <Route path="frotas/cadastrar" element={<FrotaForm />} />
          <Route path="lancamentos" element={<Lancamentos />} />
          <Route path="relatorios" element={<Reports />} />
          <Route path="usuarios" element={<AdminRoute><Usuarios /></AdminRoute>} />
          <Route path="usuarios/cadastrar" element={<AdminRoute><UserForm /></AdminRoute>} />
          <Route path="usuarios/editar-senha/:email" element={<AdminRoute><PasswordEditForm /></AdminRoute>} />
        </Route>
          <Route path="*" element={<PaginaNaoEncontrada />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
