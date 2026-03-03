import api from './api'

const ingresoService = {
  getAll(params = {}) {
    return api.get('/ingresos', { params })
  },
  getById(id) {
    return api.get(`/ingresos/${id}`)
  },
  create(data) {
    return api.post('/ingresos', data)
  },
  update(id, data) {
    return api.put(`/ingresos/${id}`, data)
  },
  delete(id) {
    return api.delete(`/ingresos/${id}`)
  }
}

export default ingresoService