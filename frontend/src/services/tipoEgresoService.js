import api from './api'

const tipoTrabajoService = {
  // Obtener todos los tipos de trabajo
  getAll() {
    return api.get('/tipos-trabajo')
  },

  // Obtener tipos activos
  getActivos() {
    return api.get('/tipos-trabajo/activos')
  },

  // Obtener un tipo por ID
  getById(id) {
    return api.get(`/tipos-trabajo/${id}`)
  },

  // Crear un nuevo tipo
  create(data) {
    return api.post('/tipos-trabajo', data)
  },

  // Actualizar un tipo
  update(id, data) {
    return api.put(`/tipos-trabajo/${id}`, data)
  },

  // Eliminar un tipo
  delete(id) {
    return api.delete(`/tipos-trabajo/${id}`)
  }
}

export default tipoTrabajoService