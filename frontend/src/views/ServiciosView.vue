<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Servicios</h1>
      <p class="text-gray-600">Catálogo de servicios ofrecidos por TECNOFRIO</p>
    </div>

    <!-- Buscador -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Buscar servicio
          </label>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por nombre..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por tipo
          </label>
          <select
            v-model="tipoFiltro"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">Todos los tipos</option>
            <option v-for="tipo in tiposTrabajo" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" />

    <!-- Grilla de servicios -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="servicio in serviciosFiltrados"
        :key="servicio.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ servicio.nombre }}
            </h3>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ servicio.tipo_trabajo_nombre || 'Sin tipo' }}
            </span>
          </div>
        </div>

        <p class="text-sm text-gray-600 mb-4">
          {{ servicio.descripcion || 'Sin descripción' }}
        </p>

        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p class="text-xs text-gray-500">Precio referencial</p>
            <p class="text-xl font-bold text-blue-600">
              {{ formatCurrency(servicio.precio_referencial) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">Duración</p>
            <p class="text-sm font-medium text-gray-900">
              {{ servicio.duracion_estimada || '-' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-if="!loading && serviciosFiltrados.length === 0" class="text-center py-12">
      <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <WrenchScrewdriverIcon class="w-8 h-8 text-gray-400" />
      </div>
      <p class="text-gray-500">No se encontraron servicios</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { WrenchScrewdriverIcon } from '@heroicons/vue/24/outline'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import servicioService from '@/services/servicioService'
import tipoTrabajoService from '@/services/tipoTrabajoService'
import { formatCurrency } from '@/utils/formatters'

const loading = ref(true)
const servicios = ref([])
const tiposTrabajo = ref([])
const busqueda = ref('')
const tipoFiltro = ref('')

const serviciosFiltrados = computed(() => {
  let resultado = [...servicios.value]

  // Filtrar por búsqueda
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase()
    resultado = resultado.filter(s =>
      s.nombre?.toLowerCase().includes(termino) ||
      s.descripcion?.toLowerCase().includes(termino)
    )
  }

  // Filtrar por tipo
  if (tipoFiltro.value) {
    resultado = resultado.filter(s => s.tipo_trabajo_id === parseInt(tipoFiltro.value))
  }

  return resultado
})

const cargarDatos = async () => {
  try {
    loading.value = true

    const [serviciosRes, tiposRes] = await Promise.all([
      servicioService.getAll(),
      tipoTrabajoService.getAll()
    ])

    servicios.value = serviciosRes.data.data || []
    tiposTrabajo.value = tiposRes.data.data || []

    console.log('Servicios cargados:', servicios.value.length)
  } catch (error) {
    console.error('Error al cargar servicios:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>