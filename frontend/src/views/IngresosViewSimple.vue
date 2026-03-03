<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Ingresos - Prueba</h1>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <p class="text-gray-600">Esta es una vista de prueba</p>
      <p class="text-sm text-gray-500 mt-2">Ingresos cargados: {{ ingresos.length }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ingresoService } from '@/services/ingresoService'

const ingresos = ref([])

onMounted(async () => {
  try {
    console.log('Intentando cargar ingresos...')
    const response = await ingresoService.getAll()
    console.log('Respuesta del servidor:', response.data)
    ingresos.value = response.data.data || []
    console.log('Ingresos cargados:', ingresos.value.length)
  } catch (error) {
    console.error('ERROR al cargar ingresos:', error)
    console.error('Detalles del error:', error.response?.data)
  }
})
</script>