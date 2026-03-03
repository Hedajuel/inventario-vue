<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Ingresos</h1>
      <p class="text-gray-600">Gestión de servicios realizados y facturación</p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Búsqueda -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Buscar por cliente, servicio..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <!-- Fecha inicio -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Desde
          </label>
          <input
            v-model="filtros.fechaInicio"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <!-- Fecha fin -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hasta
          </label>
          <input
            v-model="filtros.fechaFin"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <!-- Filtros adicionales -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <!-- Estado de pago -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Estado de Pago
          </label>
          <select
            v-model="filtros.estadoPago"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">Todos</option>
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="parcial">Parcial</option>
          </select>
        </div>

        <!-- Botón aplicar filtros -->
        <div class="flex items-end">
          <button
            @click="aplicarFiltros"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>

        <!-- Botón limpiar filtros -->
        <div class="flex items-end">
          <button
            @click="limpiarFiltros"
            type="button"
            class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Resumen de ingresos -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Facturado</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatCurrency(totalFacturado) }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ ingresosFiltrados.length }} de {{ ingresos.length }} ingresos</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Cobrado</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ formatCurrency(totalCobrado) }}</p>
            <p class="text-xs text-gray-500 mt-1">Pagos recibidos</p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Pendiente</p>
            <p class="text-2xl font-bold text-red-600 mt-1">{{ formatCurrency(totalPendiente) }}</p>
            <p class="text-xs text-gray-500 mt-1">Por cobrar</p>
          </div>
          <div class="p-3 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" />

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800 font-medium">{{ error }}</p>
      <button @click="cargarDatos" class="mt-2 text-sm text-red-600 hover:text-red-800 underline">
        Reintentar
      </button>
    </div>

    <!-- Tabla de ingresos -->
    <TablaIngresos
      v-else
      :ingresos="ingresosFiltrados"
      @nuevo="abrirModalNuevo"
      @editar="abrirModalEditar"
      @eliminar="confirmarEliminar"
    />

    <!-- Modal de formulario -->
    <FormularioIngreso
      v-if="modalAbierto"
      :key="ingresoSeleccionado?.id || 'nuevo'"
      :is-open="modalAbierto"
      :ingreso="ingresoSeleccionado"
      :clientes="clientes"
      :tipos-trabajo="tiposTrabajo"
      :servicios="servicios"
      @close="cerrarModal"
      @guardar="guardarIngreso"
    />

    <!-- Modal de confirmación de eliminación -->
    <ModalConfirmacion
      :is-open="modalEliminarAbierto"
      titulo="Eliminar Ingreso"
      mensaje="¿Estás seguro de que deseas eliminar este ingreso? Esta acción no se puede deshacer."
      @confirmar="eliminarIngreso"
      @cancelar="modalEliminarAbierto = false"
    />
  </div>

  <!-- Modal de confirmación de eliminación -->
  <ModalConfirmacion
    :is-open="modalEliminarAbierto"
    :titulo="'¿Eliminar ingreso?'"
    :mensaje="mensajeEliminar"
    :texto-confirmar="'Sí, eliminar'"
    :texto-cancelar="'Cancelar'"
    @confirm="eliminarIngreso"
    @cancel="cancelarEliminar"
  />

</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import TablaIngresos from '@/components/ingresos/TablaIngresos.vue'
import FormularioIngreso from '@/components/ingresos/FormularioIngreso.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ModalConfirmacion from '@/components/common/ModalConfirmacion.vue'
import ingresoService from '@/services/ingresoService'
import clienteService from '@/services/clienteService'
import tipoTrabajoService from '@/services/tipoTrabajoService'
import servicioService from '@/services/servicioService'
import { formatCurrency, formatDate } from '@/utils/formatters'

const loading = ref(true)
const error = ref(null)
const ingresos = ref([])
const clientes = ref([])
const tiposTrabajo = ref([])
const servicios = ref([])

const modalAbierto = ref(false)
const modalEliminarAbierto = ref(false)
const ingresoSeleccionado = ref(undefined)
const ingresoAEliminar = ref(null)

// Computed para calcular totales SOBRE LOS INGRESOS FILTRADOS
const totalFacturado = computed(() => {
  return ingresosFiltrados.value.reduce((sum, ingreso) => {
    return sum + parseFloat(ingreso.facturado || 0)
  }, 0)
})

const totalCobrado = computed(() => {
  return ingresosFiltrados.value.reduce((sum, ingreso) => {
    return sum + parseFloat(ingreso.venta_servicio || 0)
  }, 0)
})

const totalPendiente = computed(() => {
  return ingresosFiltrados.value.reduce((sum, ingreso) => {
    return sum + parseFloat(ingreso.saldo_pendiente || 0)
  }, 0)
})

const filtros = ref({
  busqueda: '',
  fechaInicio: '',
  fechaFin: '',
  estadoPago: ''
})

// Computed - Ingresos filtrados
// Computed para filtrar ingresos según los filtros aplicados
const ingresosFiltrados = computed(() => {
  let resultado = [...ingresos.value]
  
  // Filtrar por búsqueda (cliente o servicio)
  if (filtros.value.busqueda && filtros.value.busqueda.trim()) {
    const busqueda = filtros.value.busqueda.toLowerCase().trim()
    resultado = resultado.filter(ingreso => {
      const cliente = (ingreso.cliente_nombre || '').toLowerCase()
      const servicio = (ingreso.servicio_nombre || '').toLowerCase()
      const descripcion = (ingreso.descripcion_trabajo || '').toLowerCase()
      
      return cliente.includes(busqueda) || 
             servicio.includes(busqueda) || 
             descripcion.includes(busqueda)
    })
  }
  
  // Filtrar por fechas
  if (filtros.value.fechaInicio && filtros.value.fechaFin) {
    resultado = resultado.filter(ingreso => {
      const fechaIngreso = new Date(ingreso.fecha).toISOString().split('T')[0]
      return fechaIngreso >= filtros.value.fechaInicio && fechaIngreso <= filtros.value.fechaFin
    })
  }
  
  // Filtrar por estado de pago
  if (filtros.value.estadoPago && filtros.value.estadoPago !== 'todos') {
    resultado = resultado.filter(ingreso => ingreso.estado_pago === filtros.value.estadoPago)
  }
  
  return resultado
})

// Computed - Resumen
const resumen = computed(() => {
  return {
    totalFacturado: ingresosFiltrados.value.reduce((sum, ing) => sum + parseFloat(ing.total_facturado || 0), 0),
    totalCobrado: ingresosFiltrados.value.reduce((sum, ing) => sum + parseFloat(ing.total_pagado || 0), 0),
    totalPendiente: ingresosFiltrados.value.reduce((sum, ing) => sum + parseFloat(ing.saldo_pendiente || 0), 0)
  }
})

// computed - Mensaje de Eliminar
const mensajeEliminar = computed(() => {
  if (!ingresoAEliminar.value) {
    return '¿Estás seguro de que deseas eliminar este ingreso? Esta acción no se puede deshacer.'
  }
  
  const cliente = ingresoAEliminar.value.cliente_nombre || 'Sin cliente'
  const servicio = ingresoAEliminar.value.servicio_nombre || 'Sin servicio'
  const monto = formatCurrency(ingresoAEliminar.value.facturado || 0)
  
  return `¿Estás seguro de que deseas eliminar el ingreso de "${cliente}" - "${servicio}" por ${monto}? Esta acción no se puede deshacer.`
})

// Métodos
const cargarDatos = async () => {
  try {
    loading.value = true
    error.value = null

    const params = {}
    if (filtros.value.fechaInicio) params.fechaInicio = filtros.value.fechaInicio
    if (filtros.value.fechaFin) params.fechaFin = filtros.value.fechaFin

    const [ingresosRes, clientesRes, tiposRes, serviciosRes] = await Promise.all([
      ingresoService.getAll(params),
      clienteService.getActivos(),
      tipoTrabajoService.getActivos(),
      servicioService.getAll()
    ])

    console.log('🔍 Respuesta clientes:', clientesRes.data)
    console.log('🔍 Respuesta tipos:', tiposRes.data)

    // Función helper para extraer arrays de las respuestas
    const extractArray = (response) => {
      if (!response || !response.data) return []
      
      // Si response.data es directamente un array
      if (Array.isArray(response.data)) {
        return response.data
      }
      
      // Si response.data tiene una propiedad data que es array
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data
      }
      
      // Si response.data es un objeto con propiedades
      if (typeof response.data === 'object' && !Array.isArray(response.data)) {
        // Intentar extraer el array de alguna propiedad común
        const possibleArrays = ['data', 'items', 'results', 'records']
        for (const key of possibleArrays) {
          if (Array.isArray(response.data[key])) {
            return response.data[key]
          }
        }
      }
      
      return []
    }

    ingresos.value = extractArray(ingresosRes)
    clientes.value = extractArray(clientesRes)
    tiposTrabajo.value = extractArray(tiposRes)
    servicios.value = extractArray(serviciosRes)

    console.log('Datos cargados:', {
      ingresos: ingresos.value.length,
      clientes: clientes.value.length,
      tiposTrabajo: tiposTrabajo.value.length,
      servicios: servicios.value.length
    })
  } catch (err) {
    console.error('Error al cargar datos:', err)
    console.error('Detalles:', err.response?.data)
    error.value = 'Error al cargar los datos. Por favor, verifica que el backend esté corriendo.'
  } finally {
    loading.value = false
  }
}

const aplicarFiltros = () => {
  console.log('Se aplicó los filtros: ', filtros.value)
}

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: '',
    fechaInicio: '',
    fechaFin: '',
    estadoPago: 'todos'
  }
  console.log('Filtros limpios')
}

const abrirModalNuevo = () => {
  ingresoSeleccionado.value = undefined
  setTimeout(() => {
    modalAbierto.value = true
  }, 50)
}

const abrirModalEditar = (ingreso) => {
  ingresoSeleccionado.value = ingreso
  modalAbierto.value = true
}

const cerrarModal = () => {  
  modalAbierto.value = false
  ingresoSeleccionado.value = null
}

const guardarIngreso = async (datos) => {
  try {
    console.log('Datos a enviar:', datos)
    
    // Transformar los datos al formato que espera el backend
    const payload = {
      fecha: datos.fecha,
      cliente_id: datos.cliente_id || null,
      tipo_trabajo_id: datos.tipo_trabajo_id,
      servicio_id: datos.servicio_id || null,
      descripcion_trabajo: 'Servicio registrado',
      venta_servicio: datos.total_pagado || '0', // datos.precio_unitario * datos.cantidad,
      facturado: datos.precio_unitario * datos.cantidad,
      saldo_pendiente: 0,
      estado_pago: datos.estadoPago || 'Pagado',
      tipo_pago: datos.metodo_pago || 'efectivo',
      observaciones: datos.observaciones || null,
      realizado_por: 'Técnico'
    }
    
    console.log('Payload transformado:', payload)

    if (datos.id) {
      // Actualizar ingreso existente
      await ingresoService.update(datos.id, payload)
      alert('Ingreso actualizado exitosamente')
    } else {
      // Crear nuevo ingreso
      const response = await ingresoService.create(payload)
      console.log('Respuesta del servidor:', response)
      alert('Ingreso guardado exitosamente')
    }

    // Cerrar modal y recargar datos
    cerrarModal()
    await cargarDatos()
  } catch (error) {
    console.error('Error al guardar ingreso:', error)
    console.error('Detalles del error:', error.response?.data)
    alert('Error al guardar el ingreso. Por favor, intenta nuevamente.')
  }
}

const confirmarEliminar = (ingreso) => {
  console.log('Confirmar eliminar:', ingreso)
  ingresoAEliminar.value = ingreso
  modalEliminarAbierto.value = true
}

const eliminarIngreso = async () => {
  console.log('Ingreso a eliminar:', ingresoAEliminar.value)
  
  if (!ingresoAEliminar.value || !ingresoAEliminar.value.id) {
    console.error('No hay ingreso seleccionado para eliminar')
    alert('Error: No se pudo identificar el ingreso a eliminar')
    modalEliminarAbierto.value = false
    ingresoAEliminar.value = null
    return
  }
  
  const idAEliminar = ingresoAEliminar.value.id
  
  try {
    console.log('Eliminando ingreso con ID:', idAEliminar)
    
    const response = await ingresoService.delete(idAEliminar)
    console.log('Respuesta del servidor:', response)
    
    alert('Ingreso eliminado exitosamente')
    
    // Cerrar modal PRIMERO
    modalEliminarAbierto.value = false
    ingresoAEliminar.value = null
    
    // Recargar datos
    console.log('Recargando datos...')
    await cargarDatos()
    console.log('Datos recargados')
    
  } catch (error) {
    console.error('Error completo:', error)
    console.error('Response:', error.response)
    console.error('Data:', error.response?.data)
    
    // Cerrar modal incluso si hay error
    modalEliminarAbierto.value = false
    ingresoAEliminar.value = null
    
    const errorMsg = error.response?.data?.message || error.message || 'Error desconocido'
    alert(`Error al eliminar el ingreso: ${errorMsg}`)
  }
}

const cancelarEliminar = () => {
  modalEliminarAbierto.value = false
  ingresoAEliminar.value = null
}

onMounted(() => {
  cargarDatos()
})
</script>