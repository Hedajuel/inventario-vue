import api from './api'

const clienteService = {
  getAll() {
    return api.get('/clientes')
  },
  getActivos() {
    return api.get('/clientes/activos')
  },
  getById(id) {
    return api.get(`/clientes/${id}`)
  },
  create(data) {
    return api.post('/clientes', data)
  },
  update(id, data) {
    return api.put(`/clientes/${id}`, data)
  },
  delete(id) {
    return api.delete(`/clientes/${id}`)
  },
  search(termino) {
    return api.get(`/clientes/search?q=${termino}`)
  }
}

export default clienteService