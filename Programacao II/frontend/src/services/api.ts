// Configuração base da API
const URL_BASE_API = 'http://localhost:3001' // URL do backend

class ServicoApi {
  private urlBase: string

  constructor(urlBase: string = URL_BASE_API) {
    this.urlBase = urlBase
  }

  private async requisicao<T>(
    endpoint: string, 
    opcoes: RequestInit = {}
  ): Promise<T> {
    const url = `${this.urlBase}${endpoint}`
    
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

    try {
      const resposta = await fetch(url, configuracao)
      
      if (!resposta.ok) {
        throw new Error(`Erro HTTP! status: ${resposta.status}`)
      }

      return await resposta.json()
    } catch (erro) {
      console.error('Falha na requisição da API:', erro)
      throw erro
    }
  }

  // Métodos HTTP básicos
  async buscar<T>(endpoint: string): Promise<T> {
    return this.requisicao<T>(endpoint, { method: 'GET' })
  }

  async criar<T>(endpoint: string, dados?: any): Promise<T> {
    return this.requisicao<T>(endpoint, {
      method: 'POST',
      body: dados ? JSON.stringify(dados) : undefined,
    })
  }

  async atualizar<T>(endpoint: string, dados?: any): Promise<T> {
    return this.requisicao<T>(endpoint, {
      method: 'PUT',
      body: dados ? JSON.stringify(dados) : undefined,
    })
  }

  async deletar<T>(endpoint: string): Promise<T> {
    return this.requisicao<T>(endpoint, { method: 'DELETE' })
  }
}

export const servicoApi = new ServicoApi()
export default servicoApi
