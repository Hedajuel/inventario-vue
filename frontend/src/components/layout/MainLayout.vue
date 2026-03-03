<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar @toggle-sidebar="toggleSidebar" />

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar :is-open="sidebarOpen" @close="closeSidebar" />

      <!-- Contenido principal -->
      <main class="flex-1 lg:ml-64 transition-all duration-300">
        <div class="p-4 sm:p-6 lg:p-8">
          <!-- Breadcrumb -->
          <nav v-if="showBreadcrumb" class="flex mb-6" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <router-link
                  to="/"
                  class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  <HomeIcon class="w-4 h-4 mr-2" />
                  Inicio
                </router-link>
              </li>
              <li v-if="breadcrumb">
                <div class="flex items-center">
                  <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                  <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {{ breadcrumb }}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <!-- router-view para el contenido de cada página -->
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import { HomeIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const sidebarOpen = ref(true)
const route = useRoute()

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const breadcrumb = computed(() => {
  const breadcrumbMap = {
    '/': '',
    '/ingresos': 'Ingresos',
    '/egresos': 'Egresos',
    '/servicios': 'Servicios',
    '/clientes': 'Clientes',
    '/reportes': 'Reportes',
    '/configuracion': 'Configuración',
    '/perfil': 'Mi Perfil'
  }
  return breadcrumbMap[route.path] || ''
})

const showBreadcrumb = computed(() => {
  return route.path !== '/'
})
</script>