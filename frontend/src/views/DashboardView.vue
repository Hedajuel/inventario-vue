<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">
        Resumen general de TECNOFRIO - {{ currentPeriod.mesNombre }} {{ currentPeriod.año }}
      </p>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" text="Cargando estadísticas..." />

    <!-- Contenido -->
    <div v-else>
      <!-- Tarjetas de estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ingresos del Mes"
          :value="stats.ingresos?.total_facturado || 0"
          type="currency"
          :icon="ArrowDownTrayIcon"
          color="success"
          :subtitle="`${stats.ingresos?.total_servicios || 0} servicios realizados`"
        />

        <StatCard
          title="Egresos del Mes"
          :value="stats.egresos?.total_gastado || 0"
          type="currency"
          :icon="ArrowUpTrayIcon"
          color="danger"
          :subtitle="`${stats.egresos?.total_gastos || 0} gastos registrados`"
        />

        <StatCard
          title="Utilidad"
          :value="stats.utilidad || 0"
          type="currency"
          :icon="ChartBarIcon"
          color="primary"
          subtitle="Ingresos - Egresos"
        />

        <StatCard
          title="Servicios Hoy"
          :value="stats.hoy?.servicios || 0"
          type="number"
          :icon="WrenchScrewdriverIcon"
          color="primary"
          :subtitle="formatCurrency(stats.hoy?.ventas || 0)"
        />
      </div>

      <!-- Últimas actividades -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        </div>
        <div class="p-6">
          <div v-if="actividades.length > 0" class="space-y-4">
            <div
              v-for="actividad in actividades.slice(0, 10)"
              :key="`${actividad.tipo}-${actividad.id}`"
              class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
            >
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="actividad.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'"
              >
                <component
                  :is="actividad.tipo === 'ingreso' ? ArrowDownTrayIcon : ArrowUpTrayIcon"
                  class="w-5 h-5"
                  :class="actividad.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                  {{ actividad.descripcion }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatDate(actividad.fecha) }} • {{ actividad.categoria }}
                </p>
              </div>
              <div
                class="text-sm font-semibold flex-shrink-0"
                :class="actividad.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'"
              >
                {{ actividad.tipo === 'ingreso' ? '+' : '-' }}{{ formatCurrency(actividad.monto) }}
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12 text-gray-400">
            <p>No hay actividad reciente</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'

import StatCard from '@/components/common/StatCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import dashboardService from '@/services/dashboardService'
import { formatCurrency, formatDate, getCurrentPeriod } from '@/utils/formatters'

const loading = ref(true)
const stats = ref({})
const actividades = ref([])
const currentPeriod = getCurrentPeriod()

const cargarDatos = async () => {
  try {
    loading.value = true

    // Cargar estadísticas
    const [estadisticas, recientes] = await Promise.all([
      dashboardService.getEstadisticas({
        fechaInicio: currentPeriod.fechaInicio,
        fechaFin: currentPeriod.fechaFin
      }),
      dashboardService.getActividadesRecientes(10)
    ])

    stats.value = estadisticas.data.data
    actividades.value = recientes.data.data

    console.log('Estadísticas cargadas:', stats.value)
    console.log('Actividades cargadas:', actividades.value)
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>