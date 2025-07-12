import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Configuração base da API
const URL_BASE_API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ServicoApi {
  private axiosInstance: AxiosInstance

  constructor(urlBase: string = URL_BASE_API) {
    this.axiosInstance = axios.create({
      baseURL: urlBase,
      timeout: 10000, // 10 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Interceptor para adicionar token de autenticação
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('tokenAuth')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Log da requisição (apenas em desenvolvimento)
        if (import.meta.env.DEV) {
          console.log(`🔄 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '')
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Interceptor para tratamento de respostas
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log da resposta (apenas em desenvolvimento)
        if (import.meta.env.DEV) {
          console.log(`📡 ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url} - Status: ${response.status}`)
          console.log(`📦 Dados recebidos:`, response.data)
        }

        // Verifica se a API retornou success: false
        if (response.data?.hasOwnProperty('success') && !response.data.success) {
          throw new Error(response.data.message || 'Erro na operação')
        }

        return response
      },
      (error) => {
        // Log do erro (apenas em desenvolvimento)
        if (import.meta.env.DEV) {
          console.error(`❌ Erro na requisição:`, error)
        }

        if (error.response) {
          // Erro com resposta do servidor
          const status = error.response.status
          const dadosResposta = error.response.data

          if (status >= 500) {
            // Erro do servidor (500+)
            throw new Error(dadosResposta?.message || `Erro interno do servidor (${status})`)
          }

          if (status === 404) {
            // Not Found
            throw new Error(dadosResposta?.message || 'Recurso não encontrado')
          }

          if (status === 401) {
            // Unauthorized - remove token inválido
            localStorage.removeItem('tokenAuth')
            localStorage.removeItem('dadosUsuario')
            throw new Error(dadosResposta?.message || 'Token inválido ou expirado. Faça login novamente.')
          }

          if (status === 403) {
            // Forbidden
            throw new Error(dadosResposta?.message || 'Acesso negado')
          }

          // Outros erros HTTP
          throw new Error(dadosResposta?.message || `Erro HTTP ${status}`)
        } else if (error.request) {
          // Erro de rede (sem resposta)
          if (error.code === 'ECONNABORTED') {
            throw new Error('Timeout na requisição. Tente novamente.')
          }
          throw new Error('Erro de conexão. Contate o Administrador.')
        } else {
          // Outros erros
          throw new Error(error.message || 'Erro desconhecido')
        }
      }
    )
  }

  private async requisicao<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request({
        url: endpoint,
        ...config,
      })
      return response.data as T
    } catch (error) {
      throw error
    }
  }

  // Métodos HTTP genéricos - podem ser usados em qualquer parte da aplicação

  /**
   * Método GET genérico
   * @param endpoint - Endpoint da API (ex: '/usuarios', '/veiculos')
   * @returns Promise com a resposta da API
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.requisicao<T>(endpoint, { method: 'GET' })
  }

  /**
   * Método POST genérico
   * @param endpoint - Endpoint da API (ex: '/usuarios/login', '/veiculos')
   * @param dados - Dados a serem enviados no body da requisição
   * @returns Promise com a resposta da API
   */
  async post<T>(endpoint: string, dados?: any): Promise<T> {
    return this.requisicao<T>(endpoint, {
      method: 'POST',
      data: dados,
    })
  }

  /**
   * Método PUT genérico
   * @param endpoint - Endpoint da API (ex: '/usuarios/123', '/veiculos/ABC1234')
   * @param dados - Dados a serem enviados no body da requisição
   * @returns Promise com a resposta da API
   */
  async put<T>(endpoint: string, dados?: any): Promise<T> {
    return this.requisicao<T>(endpoint, {
      method: 'PUT',
      data: dados,
    })
  }

  /**
   * Método DELETE genérico
   * @param endpoint - Endpoint da API (ex: '/usuarios/admin@teste.com', '/veiculos/ABC1234')
   * @returns Promise com a resposta da API
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.requisicao<T>(endpoint, {
      method: 'DELETE',
    })
  }

}

export const servicoApi = new ServicoApi()
export default servicoApi
