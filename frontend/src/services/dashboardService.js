import api from './api'

const dashboardService = {
  getEstadisticas(params = {}) {
    return api.get('/dashboard/estadisticas', { params })
  },
  
  getActividadesRecientes(limit = 10) {
    return api.get('/dashboard/actividades-recientes', { params: { limit } })
  }
}

export default dashboardService