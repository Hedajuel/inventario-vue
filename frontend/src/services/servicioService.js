import api from './api'

const servicioService = {
  getAll() {
    return api.get('/servicios')
  },
  getById(id) {
    return api.get(`/servicios/${id}`)
  },
  create(data) {
    return api.post('/servicios', data)
  },
  update(id, data) {
    return api.put(`/servicios/${id}`, data)
  },
  delete(id) {
    return api.delete(`/servicios/${id}`)
  }
}

export default servicioService