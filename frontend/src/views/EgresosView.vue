<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Egresos</h1>
      <p class="text-gray-600">Gestión de gastos y pagos del negocio</p>
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
            placeholder="Buscar por descripción, proveedor..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          />
        </div>
      </div>

      <!-- Filtros adicionales -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <!-- Categoría -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            v-model="filtros.categoria"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
          >
            <option value="">Todas</option>
            <option v-for="tipo in tiposEgreso" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
        </div>

        <!-- Botón aplicar filtros -->
        <div class="flex items-end">
          <button
            @click="aplicarFiltros"
            class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>

        <!-- Botón limpiar filtros -->
        <div class="flex items-end">
          <button
            @click="limpiarFiltros"
            class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Resumen de egresos -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p class="text-sm text-gray-600 mb-1">Total Gastado</p>
        <p class="text-2xl font-bold text-red-600">{{ formatCurrency(resumen.totalGastado) }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ egresos.length }} registro(s)</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p class="text-sm text-gray-600 mb-1">Promedio por Gasto</p>
        <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(resumen.promedio) }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p class="text-sm text-gray-600 mb-1">Gastos este Mes</p>
        <p class="text-2xl font-bold text-orange-600">{{ formatCurrency(resumen.esteMes) }}</p>
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

    <!-- Tabla de egresos -->
    <TablaEgresos
      v-else
      :egresos="egresosFiltrados"
      @nuevo="abrirModalNuevo"
      @editar="abrirModalEditar"
      @eliminar="confirmarEliminar"
    />

    <!-- Modal de formulario -->
    <FormularioEgreso
      :is-open="modalAbierto"
      :egreso="egresoSeleccionado"
      :tipos-egreso="tiposEgreso"
      @close="cerrarModal"
      @guardar="guardarEgreso"
    />

    <!-- Modal de confirmación de eliminación -->
    <ModalConfirmacion
      :is-open="modalEliminarAbierto"
      titulo="Eliminar Egreso"
      mensaje="¿Estás seguro de que deseas eliminar este egreso? Esta acción no se puede deshacer."
      @confirmar="eliminarEgreso"
      @cancelar="modalEliminarAbierto = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TablaEgresos from '@/components/egresos/TablaEgresos.vue'
import FormularioEgreso from '@/components/egresos/FormularioEgreso.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ModalConfirmacion from '@/components/common/ModalConfirmacion.vue'
import egresoService from '@/services/egresoService'
import tipoEgresoService from '@/services/tipoEgresoService'
import { formatCurrency } from '@/utils/formatters'

const loading = ref(true)
const error = ref(null)
const egresos = ref([])
const tiposEgreso = ref([])

const modalAbierto = ref(false)
const modalEliminarAbierto = ref(false)
const egresoSeleccionado = ref(null)

const filtros = ref({
  busqueda: '',
  fechaInicio: '',
  fechaFin: '',
  categoria: ''
})

// Computed - Egresos filtrados
const egresosFiltrados = computed(() => {
  let resultado = [...egresos.value]

  // Filtro por búsqueda
  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase()
    resultado = resultado.filter(eg =>
      eg.descripcion?.toLowerCase().includes(busqueda) ||
      eg.proveedor?.toLowerCase().includes(busqueda) ||
      eg.tipo_egreso_nombre?.toLowerCase().includes(busqueda)
    )
  }

  // Filtro por categoría
  if (filtros.value.categoria) {
    resultado = resultado.filter(eg => eg.tipo_egreso_id === parseInt(filtros.value.categoria))
  }

  return resultado
})

// Computed - Resumen
const resumen = computed(() => {
  const total = egresosFiltrados.value.reduce((sum, eg) => sum + parseFloat(eg.total_pagado || 0), 0)
  const promedio = egresosFiltrados.value.length > 0 ? total / egresosFiltrados.value.length : 0
  
  // Egresos de este mes
  const hoy = new Date()
  const mesActual = hoy.getMonth()
  const añoActual = hoy.getFullYear()
  
  const esteMes = egresosFiltrados.value
    .filter(eg => {
      const fecha = new Date(eg.fecha)
      return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual
    })
    .reduce((sum, eg) => sum + parseFloat(eg.total_pagado || 0), 0)

  return {
    totalGastado: total,
    promedio,
    esteMes
  }
})

// Métodos
const cargarDatos = async () => {
  try {
    loading.value = true
    error.value = null

    const params = {}
    if (filtros.value.fechaInicio) params.fechaInicio = filtros.value.fechaInicio
    if (filtros.value.fechaFin) params.fechaFin = filtros.value.fechaFin

    const [egresosRes, tiposRes] = await Promise.all([
      egresoService.getAll(params),
      tipoEgresoService.getAll()
    ])

    egresos.value = egresosRes.data.data || []
    tiposEgreso.value = tiposRes.data.data || []

    console.log('Datos de egresos cargados:', {
      egresos: egresos.value.length,
      tipos: tiposEgreso.value.length
    })
  } catch (err) {
    console.error('Error al cargar datos:', err)
    error.value = 'Error al cargar los datos. Por favor, verifica que el backend esté corriendo.'
  } finally {
    loading.value = false
  }
}

const aplicarFiltros = () => {
  cargarDatos()
}

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: '',
    fechaInicio: '',
    fechaFin: '',
    categoria: ''
  }
  cargarDatos()
}

const abrirModalNuevo = () => {
  egresoSeleccionado.value = null
  modalAbierto.value = true
}

const abrirModalEditar = (egreso) => {
  egresoSeleccionado.value = { ...egreso }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  egresoSeleccionado.value = null
}

const guardarEgreso = async (datos) => {
  try {
    if (datos.id) {
      // Actualizar
      await egresoService.update(datos.id, datos)
      alert('Egreso actualizado exitosamente')
    } else {
      // Crear nuevo
      await egresoService.create(datos)
      alert('Egreso creado exitosamente')
    }
    
    await cargarDatos()
    cerrarModal()
  } catch (err) {
    console.error('Error al guardar egreso:', err)
    alert('Error al guardar el egreso. Por favor, intenta nuevamente.')
  }
}

const confirmarEliminar = (egreso) => {
  egresoSeleccionado.value = egreso
  modalEliminarAbierto.value = true
}

const eliminarEgreso = async () => {
  try {
    await egresoService.delete(egresoSeleccionado.value.id)
    alert('Egreso eliminado exitosamente')
    await cargarDatos()
    modalEliminarAbierto.value = false
    egresoSeleccionado.value = null
  } catch (err) {
    console.error('Error al eliminar egreso:', err)
    alert('Error al eliminar el egreso. Por favor, intenta nuevamente.')
  }
}

onMounted(() => {
  cargarDatos()
})
</script>