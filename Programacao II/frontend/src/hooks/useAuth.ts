import { useState, useEffect } from 'react'
import { Usuario, SolicitacaoLogin, RespostaLogin } from '../types'
import { servicoApi } from '../services/api'

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
      // Usa o método POST genérico
      const resposta = await servicoApi.post<RespostaLogin>('/usuarios/login', {
        email: credenciais.email,
        senha: credenciais.senha
      })

      if (!resposta.success) {
        setErro(resposta.message || 'Erro ao fazer login')
        return false
      }

      // Salva os dados no localStorage
      localStorage.setItem('tokenAuth', resposta.data.token)
      localStorage.setItem('dadosUsuario', JSON.stringify(resposta.data.usuario))
      setUsuario(resposta.data.usuario)

      return true
    } catch (err) {
      console.error('Erro no login:', err)
      setErro('Erro ao fazer login. Verifique suas credenciais.')
      return false
    } finally {
      setCarregando(false)
    }
  }

  const logout = async () => {
    try {
      // Tenta fazer logout na API se houver token usando o método POST genérico
      const token = localStorage.getItem('tokenAuth')
      if (token) {
        await servicoApi.post('/usuarios/logout')
      }
    } catch (err) {
      console.error('Erro ao fazer logout na API:', err)
      // Continua com o logout local mesmo se a API falhar
    } finally {
      // Remove dados locais
      localStorage.removeItem('tokenAuth')
      localStorage.removeItem('dadosUsuario')
      setUsuario(null)
    }
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
