<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p class="text-sm text-gray-600">Análisis de datos de TECNOFRIO</p>
        </div>
      </div>

      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-600">
        <router-link to="/" class="hover:text-blue-600">Inicio</router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-900">Reportes</span>
      </nav>
    </div>

    <!-- Filtros de Fecha -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
          <input
            v-model="filtros.fechaInicio"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
          <input
            v-model="filtros.fechaFin"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          @click="cargarDatos"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generar Reporte
        </button>
        <button
          @click="limpiarFiltros"
          class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Tarjetas de Resumen -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Ingresos</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ formatCurrency(totales.ingresos) }}</p>
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
            <p class="text-sm font-medium text-gray-600">Total Egresos</p>
            <p class="text-2xl font-bold text-red-600 mt-1">{{ formatCurrency(totales.egresos) }}</p>
          </div>
          <div class="p-3 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Balance</p>
            <p class="text-2xl font-bold mt-1" :class="totales.balance >= 0 ? 'text-blue-600' : 'text-red-600'">
              {{ formatCurrency(totales.balance) }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentView" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Servicios</p>
            <p class="text-2xl font-bold text-purple-600 mt-1">{{ totales.servicios }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Gráfica de Ingresos vs Egresos -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Ingresos vs Egresos</h3>
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-gray-500">Cargando datos...</div>
        </div>
        <Line v-else :data="chartIngresosEgresos" :options="chartOptions" />
      </div>

      <!-- Gráfica de Servicios Más Solicitados -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Servicios Más Solicitados</h3>
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-gray-500">Cargando datos...</div>
        </div>
        <Bar v-else :data="chartServicios" :options="chartOptionsBar" />
      </div>
    </div>

    <!-- Gráfica de Top Clientes -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Top 10 Clientes</h3>
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-gray-500">Cargando datos...</div>
      </div>
      <Bar v-else :data="chartClientes" :options="chartOptionsBarHorizontal" />
    </div>

    <!-- Tabla de Resumen por Tipo de Trabajo -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 class="text-lg font-semibold text-gray-900">Resumen por Tipo de Trabajo</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cantidad</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Facturado</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Cobrado</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pendiente</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="tipo in resumenTiposTrabajo" :key="tipo.nombre" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ tipo.nombre }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ tipo.cantidad }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ formatCurrency(tipo.facturado) }}</td>
              <td class="px-6 py-4 text-sm text-green-600">{{ formatCurrency(tipo.cobrado) }}</td>
              <td class="px-6 py-4 text-sm text-red-600">{{ formatCurrency(tipo.pendiente) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import ingresoService from '@/services/ingresoService'
import egresoService from '@/services/egresoService'
import { formatCurrency } from '@/utils/formatters'

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const loading = ref(false)
const ingresos = ref([])
const egresos = ref([])

const filtros = ref({
  fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  fechaFin: new Date().toISOString().split('T')[0]
})

// Totales
const totales = computed(() => {
  const totalIngresos = ingresos.value.reduce((sum, i) => sum + parseFloat(i.venta_servicio || 0), 0)
  const totalEgresos = egresos.value.reduce((sum, e) => sum + parseFloat(e.monto || 0), 0)
  const totalServicios = ingresos.value.length
  
  return {
    ingresos: totalIngresos,
    egresos: totalEgresos,
    balance: totalIngresos - totalEgresos,
    servicios: totalServicios
  }
})

// Datos para gráfica de Ingresos vs Egresos
const chartIngresosEgresos = computed(() => {
  // Agrupar por mes
  const meses = {}
  
  ingresos.value.forEach(ingreso => {
    const fecha = new Date(ingreso.fecha)
    const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
    if (!meses[mes]) meses[mes] = { ingresos: 0, egresos: 0 }
    meses[mes].ingresos += parseFloat(ingreso.venta_servicio || 0)
  })
  
  egresos.value.forEach(egreso => {
    const fecha = new Date(egreso.fecha)
    const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
    if (!meses[mes]) meses[mes] = { ingresos: 0, egresos: 0 }
    meses[mes].egresos += parseFloat(egreso.monto || 0)
  })
  
  const labels = Object.keys(meses).sort()
  const dataIngresos = labels.map(mes => meses[mes].ingresos)
  const dataEgresos = labels.map(mes => meses[mes].egresos)
  
  return {
    labels,
    datasets: [
      {
        label: 'Ingresos',
        data: dataIngresos,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      {
        label: 'Egresos',
        data: dataEgresos,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  }
})

// Datos para gráfica de Servicios Más Solicitados
const chartServicios = computed(() => {
  const servicios = {}
  
  ingresos.value.forEach(ingreso => {
    const nombre = ingreso.servicio_nombre || 'Sin servicio'
    if (!servicios[nombre]) servicios[nombre] = 0
    servicios[nombre]++
  })
  
  const sorted = Object.entries(servicios).sort((a, b) => b[1] - a[1]).slice(0, 10)
  
  return {
    labels: sorted.map(s => s[0]),
    datasets: [{
      label: 'Cantidad de servicios',
      data: sorted.map(s => s[1]),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(132, 204, 22, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(244, 63, 94, 0.8)'
      ]
    }]
  }
})

// Datos para gráfica de Top Clientes
const chartClientes = computed(() => {
  const clientes = {}
  
  ingresos.value.forEach(ingreso => {
    const nombre = ingreso.cliente_nombre || 'Sin cliente'
    if (!clientes[nombre]) clientes[nombre] = 0
    clientes[nombre] += parseFloat(ingreso.venta_servicio || 0)
  })
  
  const sorted = Object.entries(clientes).sort((a, b) => b[1] - a[1]).slice(0, 10)
  
  return {
    labels: sorted.map(c => c[0]),
    datasets: [{
      label: 'Total facturado (Bs)',
      data: sorted.map(c => c[1]),
      backgroundColor: 'rgba(59, 130, 246, 0.8)'
    }]
  }
})

// Resumen por tipo de trabajo
const resumenTiposTrabajo = computed(() => {
  const tipos = {}
  
  ingresos.value.forEach(ingreso => {
    const nombre = ingreso.tipo_trabajo_nombre || 'Sin tipo'
    if (!tipos[nombre]) {
      tipos[nombre] = { nombre, cantidad: 0, facturado: 0, cobrado: 0, pendiente: 0 }
    }
    tipos[nombre].cantidad++
    tipos[nombre].facturado += parseFloat(ingreso.facturado || 0)
    tipos[nombre].cobrado += parseFloat(ingreso.venta_servicio || 0)
    tipos[nombre].pendiente += parseFloat(ingreso.saldo_pendiente || 0)
  })
  
  return Object.values(tipos)
})

// Opciones de las gráficas
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const chartOptionsBar = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const chartOptionsBarHorizontal = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2.5,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      beginAtZero: true
    }
  }
}

// Métodos
const cargarDatos = async () => {
  try {
    loading.value = true
    
    const params = {
      fechaInicio: filtros.value.fechaInicio,
      fechaFin: filtros.value.fechaFin
    }
    
    const [ingresosRes, egresosRes] = await Promise.all([
      ingresoService.getAll(params),
      egresoService.getAll(params)
    ])
    
    ingresos.value = ingresosRes.data.data || ingresosRes.data || []
    egresos.value = egresosRes.data.data || egresosRes.data || []
    
    console.log('✅ Datos de reportes cargados')
  } catch (error) {
    console.error('❌ Error al cargar datos:', error)
    alert('Error al cargar los datos del reporte')
  } finally {
    loading.value = false
  }
}

const limpiarFiltros = () => {
  filtros.value = {
    fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0]
  }
  cargarDatos()
}

onMounted(() => {
  cargarDatos()
})
</script>