import api from './api'

const egresoService = {
  getAll(params = {}) {
    return api.get('/egresos', { params })
  },
  getById(id) {
    return api.get(`/egresos/${id}`)
  },
  create(data) {
    return api.post('/egresos', data)
  },
  update(id, data) {
    return api.put(`/egresos/${id}`, data)
  },
  delete(id) {
    return api.delete(`/egresos/${id}`)
  },
  getTipos() {
    return api.get('/tipos-egreso')
  }
}

export default egresoService