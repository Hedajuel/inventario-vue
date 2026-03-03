<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0"
    :class="{ '-translate-x-full': !isOpen }"
  >
    <div class="h-full flex flex-col">
      <!-- Menú de navegación -->
      <nav class="flex-1 px-4 py-6 overflow-y-auto">
        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.name">
            <router-link
              :to="item.path"
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150"
              :class="isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-70 hover:bg-gray-100'"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
              <span
                v-if="item.badge"
                class="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full"
                :class="item.badgeColor || 'bg-primary-100 text-primary-700'"
              >
                {{ item.badge }}
              </span>
            </router-link>
          </li>
        </ul>

        <!-- Sección de configuración -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Configuración
          </p>
          <ul class="space-y-1">
            <li v-for="item in configItems" :key="item.name">
              <router-link
                :to="item.path"
                class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                <component :is="item.icon" class="w-5 h-5" />
                <span>{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <router-link
          to="/reportes"
          class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          active-class="bg-blue-50 text-blue-600 font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Reportes</span>
        </router-link>
      </nav>

      <!-- Footer del sidebar -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 text-sm text-gray-600">
          <div class="w-2 h-2 bg-success-500 rounded-full"></div>
          <span>Sistema activo</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- Overlay para móvil -->
  <div
    v-if="isOpen"
    @click="$emit('close')"
    class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
  ></div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

defineEmits(['close'])

const route = useRoute()

const menuItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: HomeIcon
  },
  {
    name: 'Ingresos',
    path: '/ingresos',
    icon: ArrowDownTrayIcon,
    badge: '',
    badgeColor: 'bg-success-100 text-success-700'
  },
  {
    name: 'Egresos',
    path: '/egresos',
    icon: ArrowUpTrayIcon,
    badge: '',
    badgeColor: 'bg-danger-100 text-danger-700'
  },
  {
    name: 'Servicios',
    path: '/servicios',
    icon: WrenchScrewdriverIcon
  },
  {
    name: 'Clientes',
    path: '/clientes',
    icon: UserGroupIcon
  },
  {
    name: 'Reportes',
    path: '/reportes',
    icon: ChartBarIcon
  }
]

const configItems = [
  {
     name: 'Ajustes',
     path: '/configuracion',
     icon: Cog6ToothIcon
   },
   {
     name: 'Mi Perfil',
     path: '/perfil',
     icon: UserIcon
   }
]

const isActive = (path) => {
  return route.path === path
}
</script>