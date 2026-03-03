import api from './api'

const tipoTrabajoService = {
  getAll() {
    return api.get('/tipos-trabajo')
  },
  getActivos() {
    return api.get('/tipos-trabajo/activos')
  },
  getById(id) {
    return api.get(`/tipos-trabajo/${id}`)
  },
  create(data) {
    return api.post('/tipos-trabajo', data)
  },
  update(id, data) {
    return api.put(`/tipos-trabajo/${id}`, data)
  },
  delete(id) {
    return api.delete(`/tipos-trabajo/${id}`)
  }
}

export default tipoTrabajoService