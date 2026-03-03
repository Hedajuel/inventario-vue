<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
          <p class="text-sm text-gray-600">Directorio de clientes de TECNOFRIO</p>
        </div>
      </div>

      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-600">
        <router-link to="/" class="hover:text-blue-600">Inicio</router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-900">Clientes</span>
      </nav>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar cliente</label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Buscar por nombre, teléfono, NIT..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por tipo</label>
          <select
            v-model="filtros.tipo"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">Todos</option>
            <option value="persona">Persona</option>
            <option value="empresa">Empresa</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Clientes</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ clientesFiltrados.length }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Personas</p>
            <p class="text-3xl font-bold text-blue-600 mt-1">{{ totalPersonas }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Empresas</p>
            <p class="text-3xl font-bold text-green-600 mt-1">{{ totalEmpresas }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de Clientes -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Header de la tabla -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            Lista de Clientes ({{ clientesFiltrados.length }})
          </h3>
          <button 
            @click="abrirModalNuevo" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Cliente
          </button>
        </div>
      </div>

      <!-- Tabla -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Teléfono</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Dirección</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="cliente in clientesFiltrados"
              :key="cliente.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 text-sm text-gray-900">
                <div class="font-medium">{{ cliente.nombre }} {{ cliente.apellido || '' }}</div>
                <div class="text-xs text-gray-500">{{ cliente.nit || 'Sin NIT/CI' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="cliente.tipo_cliente === 'empresa' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                >
                  {{ cliente.tipo_cliente === 'empresa' ? 'Empresa' : 'Persona' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ cliente.telefono || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ cliente.email || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ cliente.direccion || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="cliente.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ cliente.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <button
                    @click="abrirModalEditar(cliente)"
                    class="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmarEliminar(cliente)"
                    class="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Eliminar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Estado vacío -->
        <div v-if="clientesFiltrados.length === 0" class="text-center py-12">
          <p class="text-gray-500">No hay clientes registrados</p>
        </div>
      </div>
    </div>

    <!-- Modal Formulario Cliente -->
    <FormularioCliente
      :is-open="modalAbierto"
      :key="clienteSeleccionado?.id || 'nuevo'"
      :cliente="clienteSeleccionado"
      @close="cerrarModal"
      @guardar="guardarCliente"
    />

    <!-- Modal de confirmación de eliminación -->
    <ModalConfirmacion
      :is-open="modalEliminarAbierto"
      :titulo="'¿Eliminar cliente?'"
      :mensaje="mensajeEliminar"
      :texto-confirmar="'Sí, eliminar'"
      :texto-cancelar="'Cancelar'"
      @confirm="eliminarCliente"
      @cancel="cancelarEliminar"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FormularioCliente from '@/components/clientes/FormularioCliente.vue'
import ModalConfirmacion from '@/components/common/ModalConfirmacion.vue'
import clienteService from '@/services/clienteService'

const clientes = ref([])
const loading = ref(false)
const error = ref(null)

const modalAbierto = ref(false)
const clienteSeleccionado = ref(null)

const modalEliminarAbierto = ref(false)
const clienteAEliminar = ref(null)

const filtros = ref({
  busqueda: '',
  tipo: ''
})

// Computed para filtrar clientes
const clientesFiltrados = computed(() => {
  let resultado = [...clientes.value]
  
  // Filtrar por búsqueda
  if (filtros.value.busqueda && filtros.value.busqueda.trim()) {
    const busqueda = filtros.value.busqueda.toLowerCase().trim()
    resultado = resultado.filter(cliente => {
      const nombre = (cliente.nombre || '').toLowerCase()
      const apellido = (cliente.apellido || '').toLowerCase()
      const telefono = (cliente.telefono || '').toLowerCase()
      const nit = (cliente.nit || '').toLowerCase()
      const email = (cliente.email || '').toLowerCase()
      
      return nombre.includes(busqueda) || 
             apellido.includes(busqueda) || 
             telefono.includes(busqueda) || 
             nit.includes(busqueda) ||
             email.includes(busqueda)
    })
  }
  
  // Filtrar por tipo
  if (filtros.value.tipo) {
    resultado = resultado.filter(cliente => cliente.tipo_cliente === filtros.value.tipo)
  }
  
  return resultado
})

// Computed para totales
const totalPersonas = computed(() => {
  return clientes.value.filter(c => c.tipo_cliente === 'persona').length
})

const totalEmpresas = computed(() => {
  return clientes.value.filter(c => c.tipo_cliente === 'empresa').length
})

const mensajeEliminar = computed(() => {
  if (!clienteAEliminar.value) {
    return '¿Estás seguro de que deseas eliminar este cliente?'
  }
  
  const nombre = clienteAEliminar.value.nombre + (clienteAEliminar.value.apellido ? ' ' + clienteAEliminar.value.apellido : '')
  return `¿Estás seguro de que deseas eliminar al cliente "${nombre}"? Esta acción no se puede deshacer.`
})

// Métodos
const cargarDatos = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await clienteService.getAll()
    clientes.value = response.data.data || response.data || []
    
    console.log('✅ Clientes cargados:', clientes.value.length)
  } catch (err) {
    console.error('❌ Error al cargar clientes:', err)
    error.value = 'Error al cargar los clientes'
  } finally {
    loading.value = false
  }
}

const abrirModalNuevo = () => {
  clienteSeleccionado.value = null
  modalAbierto.value = true
}

const abrirModalEditar = (cliente) => {
  console.log('✏️ Editando cliente:', cliente)
  clienteSeleccionado.value = cliente
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  clienteSeleccionado.value = null
}

const guardarCliente = async (datos) => {
  try {
    console.log('💾 Guardando cliente:', datos)
    
    if (datos.id) {
      // Actualizar
      await clienteService.update(datos.id, datos)
      alert('Cliente actualizado exitosamente')
    } else {
      // Crear
      await clienteService.create(datos)
      alert('Cliente creado exitosamente')
    }
    
    cerrarModal()
    await cargarDatos()
  } catch (error) {
    console.error('❌ Error al guardar cliente:', error)
    alert('Error al guardar el cliente: ' + (error.response?.data?.message || error.message))
  }
}

const confirmarEliminar = (cliente) => {
  console.log('🗑️ Confirmar eliminar:', cliente)
  clienteAEliminar.value = cliente
  modalEliminarAbierto.value = true
}

const eliminarCliente = async () => {
  if (!clienteAEliminar.value || !clienteAEliminar.value.id) {
    console.error('❌ No hay cliente seleccionado')
    alert('Error: No se pudo identificar el cliente a eliminar')
    modalEliminarAbierto.value = false
    return
  }
  
  try {
    console.log('🗑️ Eliminando cliente ID:', clienteAEliminar.value.id)
    
    await clienteService.delete(clienteAEliminar.value.id)
    
    alert('Cliente eliminado exitosamente')
    
    modalEliminarAbierto.value = false
    clienteAEliminar.value = null
    
    await cargarDatos()
  } catch (error) {
    console.error('❌ Error al eliminar cliente:', error)
    
    modalEliminarAbierto.value = false
    clienteAEliminar.value = null
    
    alert('Error al eliminar el cliente: ' + (error.response?.data?.message || error.message))
  }
}

const cancelarEliminar = () => {
  modalEliminarAbierto.value = false
  clienteAEliminar.value = null
}

// Cargar datos al montar
onMounted(() => {
  cargarDatos()
})
</script>