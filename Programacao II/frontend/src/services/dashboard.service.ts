import moment from 'moment'
import 'moment/locale/pt-br'
import servicoApi from './api'
import { 
  TotalEntradasResponse, 
  TotalSaidasResponse, 
  MovimentacaoDiariaResponse, 
  MovimentacaoDay,
  VeiculosAtivosResponse
} from '../types/dashboard'

// Configurar moment.js para usar português brasileiro
moment.locale('pt-br')

export class DashboardService {
  /**
   * Busca o total de entradas do mês/ano atual
   */
  async buscarTotalEntradas(): Promise<number> {
    const mes = moment().month() + 1 // moment() retorna 0-11, precisamos 1-12
    const ano = moment().year()
    
    try {
      const response = await servicoApi.get<TotalEntradasResponse>(
        `/dashboard/totalentradas?mes=${mes}&ano=${ano}`
      )
      
      if (response.success && response.data) {
        return response.data.total_entradas
      } else {
        throw new Error(response.message || 'Erro desconhecido')
      }
    } catch (error) {
      console.error('Erro ao buscar total de entradas:', error)
      throw new Error('Erro ao consultar valor de total de entradas')
    }
  }

  /**
   * Busca o total de saídas do mês/ano atual
   */
  async buscarTotalSaidas(): Promise<number> {
    const mes = moment().month() + 1 // moment() retorna 0-11, precisamos 1-12
    const ano = moment().year()
    
    try {
      const response = await servicoApi.get<TotalSaidasResponse>(
        `/dashboard/totalsaidas?mes=${mes}&ano=${ano}`
      )
      
      if (response.success && response.data) {
        return response.data.total_saidas
      } else {
        throw new Error(response.message || 'Erro desconhecido')
      }
    } catch (error) {
      console.error('Erro ao buscar total de saídas:', error)
      throw new Error('Erro ao consultar valor de total de saídas')
    }
  }

  /**
   * Busca a movimentação diária do mês/ano atual
   */
  async buscarMovimentacaoDiaria(): Promise<MovimentacaoDay[]> {
    const mes = moment().month() + 1 // moment() retorna 0-11, precisamos 1-12
    const ano = moment().year()
    
    try {
      const response = await servicoApi.get<MovimentacaoDiariaResponse>(
        `/dashboard/movimentacaodiaria?mes=${mes}&ano=${ano}`
      )
      
      if (response.success && response.data) {
        return response.data.dias
      } else {
        throw new Error(response.message || 'Erro desconhecido')
      }
    } catch (error) {
      console.error('Erro ao buscar movimentação diária:', error)
      throw new Error('Erro ao consultar movimentação diária')
    }
  }

  /**
   * Busca o número de veículos ativos
   */
  async buscarVeiculosAtivos(): Promise<number> {
    try {
      const response = await servicoApi.get<VeiculosAtivosResponse>(
        '/veiculos/situacaocount?situacao=A'
      )
      
      if (response.success && response.data) {
        return response.data.count
      } else {
        throw new Error(response.message || 'Erro desconhecido')
      }
    } catch (error) {
      console.error('Erro ao buscar veículos ativos:', error)
      throw new Error('Erro ao consultar veículos ativos')
    }
  }

  /**
   * Retorna o nome do mês atual em português
   */
  getMesAtual(): string {
    return moment().format('MMMM YYYY')
  }
}

export const dashboardService = new DashboardService()
export default dashboardService
