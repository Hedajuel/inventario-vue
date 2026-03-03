<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header de la tabla -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Lista de Egresos ({{ egresos.length }})
        </h3>
        <button @click="$emit('nuevo')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          + Nuevo Egreso
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
              Descripción
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Categoría
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Precio Unit.
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Cantidad
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Total
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Proveedor
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="egreso in egresos"
            :key="egreso.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(egreso.fecha) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ egreso.descripcion }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {{ egreso.tipo_egreso_nombre || 'Sin categoría' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatCurrency(egreso.precio_unitario) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ egreso.cantidad }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
              {{ formatCurrency(egreso.total_pagado) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ egreso.proveedor || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center gap-2">
                <button
                  @click="$emit('editar', egreso)"
                  class="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Editar"
                >
                  <PencilIcon class="w-5 h-5" />
                </button>
                <button
                  @click="$emit('eliminar', egreso)"
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
      <div v-if="egresos.length === 0" class="text-center py-12">
        <p class="text-gray-500">No hay egresos registrados</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { formatCurrency, formatDate } from '@/utils/formatters'

defineProps({
  egresos: {
    type: Array,
    default: () => []
  }
})

defineEmits(['nuevo', 'editar', 'eliminar'])
</script>