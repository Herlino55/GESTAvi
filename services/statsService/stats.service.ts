import apiService from "../api.service";
import type { ApiResponse, ChartData } from '@/types/apiResponses'

const mockData = {
      activeUsers: 950,
      totalBalance: -650000,
      totalStock: 1325,
      mortalityChart: [
        { jour: 'J1', taux: 2 },
        { jour: 'J2', taux: 0.2 },
        { jour: 'J3', taux: 5 },
        { jour: 'J4', taux: 1.2 },
        { jour: 'J5', taux: 3 },
        { jour: 'J6', taux: 0.5 },
        { jour: 'J7', taux: 2 },
      ],
      alerts: [
        {
          id: 1,
          type: 'warning',
          title: 'Stock Faible',
          message: 'Le stock de Démarrage Miettes est bas (80kg).',
        },
        {
          id: 2,
          type: 'critical',
          title: 'Stock Critique',
          message: 'Le stock de Finition est critique (45kg). Réapprovisionnez immédiatement.',
        },
      ],
    };

class StatsService {

  async getAllUserActif(company_id:string): Promise<ApiResponse<number>> {
    return await apiService.get<ApiResponse<number>>(ENDPOINTS.GET_USERS_ACTIF, {
        params: { company_id }
    }) || mockData.activeUsers;
  }

  async getSumCommande(company_id:string): Promise<ApiResponse<number>> {
    return await apiService.get<ApiResponse<number>>(ENDPOINTS.GET_SUM_COMMANDE, {
        params: { company_id }
    }) || mockData.totalBalance
  }

  async getAllAlerts(company_id:string): Promise<ApiResponse<any[]>> {
    return await apiService.get<ApiResponse<any[]>>(ENDPOINTS.GET_ALL_ALERTS, {
      params: { company_id }
    }) || mockData.alerts
  }

  async getMortalityChart(company_id:string): Promise<ApiResponse<ChartData>> {
    return await apiService.get<ApiResponse<ChartData>>(ENDPOINTS.GET_MORTALITY_CHART, {
      params: { company_id }
    }) || mockData.mortalityChart
  }

  async getStockTotal(company_id:string): Promise<ApiResponse<number>> {
    return await apiService.get<ApiResponse<number>>(ENDPOINTS.GET_STOCK_ALL, {
      params: { company_id }
    }) || mockData.totalStock
  }
}

export default new StatsService()
