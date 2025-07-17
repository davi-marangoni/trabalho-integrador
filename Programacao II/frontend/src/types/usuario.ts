export interface Usuario {
  email: string
  tipo: number // 1 = forte, 2 = fraco
}

export interface UsuarioCompleto extends Usuario {
  senha?: string
}

export interface SolicitacaoLogin {
  email: string
  senha: string
}

export interface DadosLogin {
  usuario: Usuario
  token: string
}

// Tipo específico para resposta de login (compatibilidade com useAuth)
export interface RespostaLogin {
  success: boolean
  data: DadosLogin
  message: string
}
