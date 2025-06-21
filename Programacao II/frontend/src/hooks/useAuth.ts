import { useState, useEffect } from 'react'
import { Usuario, SolicitacaoLogin, RespostaLogin } from '../types'

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Verificar se há um token salvo ao carregar
  useEffect(() => {
    const token = localStorage.getItem('tokenAuth')
    const dadosUsuario = localStorage.getItem('dadosUsuario')
    
    if (token && dadosUsuario) {
      try {
        setUsuario(JSON.parse(dadosUsuario))
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err)
        localStorage.removeItem('tokenAuth')
        localStorage.removeItem('dadosUsuario')
      }
    }
    
    setCarregando(false)
  }, [])

  const login = async (credenciais: SolicitacaoLogin): Promise<boolean> => {
    setCarregando(true)
    setErro(null)

    try {
      // TODO: Implementar chamada real para a API
      // const resposta = await servicoApi.post<RespostaLogin>('/auth/login', credenciais)
      
      // Simulação temporária
      const resposta: RespostaLogin = {
        token: 'fake-jwt-token',
        usuario: {
          id: 1,
          nome: 'Usuário Teste',
          email: credenciais.email,
          tipo: 'admin',
          ativo: true
        }
      }

      localStorage.setItem('tokenAuth', resposta.token)
      localStorage.setItem('dadosUsuario', JSON.stringify(resposta.usuario))
      setUsuario(resposta.usuario)
      
      return true
    } catch (err) {
      setErro('Erro ao fazer login')
      return false
    } finally {
      setCarregando(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('tokenAuth')
    localStorage.removeItem('dadosUsuario')
    setUsuario(null)
  }

  const estaAutenticado = !!usuario

  return {
    usuario,
    carregando,
    erro,
    login,
    logout,
    estaAutenticado,
  }
}
