// Configuração base da API
const URL_BASE_API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ServicoApi {
  private urlBase: string
  private timeoutPadrao: number = 10000 // 10 segundos

  constructor(urlBase: string = URL_BASE_API) {
    this.urlBase = urlBase
  }

  private async requisicao<T>(
    endpoint: string,
    opcoes: RequestInit = {}
  ): Promise<T> {
    const url = `${this.urlBase}${endpoint}`
    const metodo = opcoes.method || 'GET'

    // Log da requisição (apenas em desenvolvimento)
    if (import.meta.env.DEV) {
      console.log(`🔄 ${metodo} ${url}`, opcoes.body ? JSON.parse(opcoes.body as string) : '')
    }

    const configuracao: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...opcoes.headers,
      },
      ...opcoes,
    }

    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('tokenAuth')
    if (token) {
      configuracao.headers = {
        ...configuracao.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    // Controller para timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutPadrao)
    configuracao.signal = controller.signal

    try {
      const resposta = await fetch(url, configuracao)
      clearTimeout(timeoutId)

      // Log da resposta (apenas em desenvolvimento)
      if (import.meta.env.DEV) {
        console.log(`📡 ${metodo} ${url} - Status: ${resposta.status}`)
      }

      // Primeiro, verifica se conseguimos parsear o JSON
      let dadosResposta: any
      try {
        dadosResposta = await resposta.json()
      } catch (parseError) {
        // Se não conseguir parsear JSON, cria uma resposta de erro
        throw new Error(`Erro ao parsear resposta JSON. Status: ${resposta.status}`)
      }

      // Log dos dados da resposta (apenas em desenvolvimento)
      if (import.meta.env.DEV) {
        console.log(`📦 Dados recebidos:`, dadosResposta)
      }

      // Verifica códigos de status HTTP específicos
      if (resposta.status >= 500) {
        // Erro do servidor (500+)
        throw new Error(dadosResposta.message || `Erro interno do servidor (${resposta.status})`)
      }

      if (resposta.status === 404) {
        // Not Found
        throw new Error(dadosResposta.message || 'Recurso não encontrado')
      }

      if (resposta.status === 401) {
        // Unauthorized - remove token inválido
        localStorage.removeItem('tokenAuth')
        localStorage.removeItem('dadosUsuario')
        throw new Error(dadosResposta.message || 'Token inválido ou expirado. Faça login novamente.')
      }

      if (resposta.status === 403) {
        // Forbidden
        throw new Error(dadosResposta.message || 'Acesso negado')
      }

      // Verifica se a API retornou success: false
      if (dadosResposta.hasOwnProperty('success') && !dadosResposta.success) {
        throw new Error(dadosResposta.message || 'Erro na operação')
      }

      // Se chegou até aqui, a requisição foi bem-sucedida
      return dadosResposta as T

    } catch (erro) {
      clearTimeout(timeoutId)

      // Tratamento específico para timeout
      if (erro instanceof Error && erro.name === 'AbortError') {
        throw new Error('Timeout na requisição. Tente novamente.')
      }

      console.error(`❌ Falha na requisição ${metodo} ${url}:`, erro)

      // Se for um erro de rede (sem resposta)
      if (erro instanceof TypeError && erro.message.includes('fetch')) {
        throw new Error('Erro de conexão. Contate o Administrador.')
      }

      // Re-throw o erro para que possa ser tratado pelo componente
      throw erro
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
      body: dados ? JSON.stringify(dados) : undefined,
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
      body: dados ? JSON.stringify(dados) : undefined,
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

  // Métodos utilitários

  /**
   * Define o timeout para as requisições
   * @param timeout - Timeout em milissegundos
   */
  definirTimeout(timeout: number): void {
    this.timeoutPadrao = timeout
  }

  /**
   * Verifica se há conexão com a API
   * @returns Promise que resolve com true se conectado
   */
  async verificarConexao(): Promise<boolean> {
    try {
      await this.get('/health')
      return true
    } catch {
      return false
    }
  }

  /**
   * Obtém a URL base da API
   * @returns URL base configurada
   */
  obterUrlBase(): string {
    return this.urlBase
  }
}

export const servicoApi = new ServicoApi()
export default servicoApi
