import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import IngresosView from '@/views/IngresosView.vue'
import EgresosView from '@/views/EgresosView.vue'
import ServiciosView from '@/views/ServiciosView.vue'
import ClientesView from '@/views/ClientesView.vue'
import ReportesView from '@/views/ReportesView.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/ingresos',
    name: 'Ingresos',
    component: IngresosView
  },
  {
    path: '/egresos',
    name: 'Egresos',
    component: EgresosView
  },
  {
    path: '/servicios',
    name: 'Servicios',
    component: ServiciosView
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: ClientesView
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: ReportesView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router