<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header de la tabla -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Lista de Ingresos ({{ ingresos.length }})
        </h3>
        <button @click="$emit('nuevo')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Nuevo Ingreso
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Fecha
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Cliente
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Servicio
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Tipo
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Total
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Pagado
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="ingreso in ingresos"
            :key="ingreso.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(ingreso.fecha) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ ingreso.cliente_nombre }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ ingreso.servicio_nombre }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ ingreso.tipo_trabajo_nombre }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
              {{ formatCurrency(ingreso.facturado) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatCurrency(ingreso.venta_servicio) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getEstadoBadgeClass(ingreso.estado_pago)"
              >
                {{ capitalize(ingreso.estado_pago) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center gap-2">
                <button
                  @click="$emit('editar', ingreso)"
                  class="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Editar"
                >
                  <PencilIcon class="w-5 h-5" />
                </button>
                <button
                  @click="$emit('eliminar', ingreso)"
                  class="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Eliminar"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Estado vacío -->
      <div v-if="ingresos.length === 0" class="text-center py-12">
        <p class="text-gray-500">No hay ingresos registrados</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { formatCurrency, formatDate, capitalize } from '@/utils/formatters'

defineProps({
  ingresos: {
    type: Array,
    default: () => []
  }
})

defineEmits(['nuevo', 'editar', 'eliminar'])

const getEstadoBadgeClass = (estado) => {
  const classes = {
    pagado: 'bg-green-100 text-green-800',
    pendiente: 'bg-red-100 text-red-800',
    parcial: 'bg-yellow-100 text-yellow-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}
</script>