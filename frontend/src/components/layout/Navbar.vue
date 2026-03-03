<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo y título -->
        <div class="flex items-center">
          <button
            @click="toggleSidebar"
            class="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Bars3Icon class="w-6 h-6 text-gray-600" />
          </button>
          
          <div class="flex items-center ml-4 lg:ml-0">
            <div class="flex-shrink-0">
              <span class="text-2xl font-bold text-primary-600">❄️</span>
            </div>
            <div class="ml-3">
              <h1 class="text-xl font-bold text-gray-900">TECNOFRIO</h1>
              <p class="text-xs text-gray-500">Sistema de Inventario</p>
            </div>
          </div>
        </div>

        <!-- Acciones de la derecha -->
        <div class="flex items-center gap-4">
          <!-- Fecha actual -->
          <div class="hidden md:block text-sm text-gray-600">
            {{ currentDate }}
          </div>

          <!-- Notificaciones -->
          <button class="p-2 rounded-lg hover:bg-gray-100 relative">
            <BellIcon class="w-6 h-6 text-gray-600" />
            <span
              class="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"
            ></span>
          </button>

          <!-- Usuario -->
          <div class="flex items-center gap-2">
            <div class="hidden sm:block text-right">
              <p class="text-sm font-medium text-gray-900">Administrador</p>
              <p class="text-xs text-gray-500">admin@tecnofrio.com</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span class="text-white font-semibold">A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Bars3Icon, BellIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '@/utils/formatters'

const emit = defineEmits(['toggle-sidebar'])

const currentDate = ref('')

const updateDate = () => {
  const now = new Date()
  currentDate.value = formatDate(now, 'dddd, DD [de] MMMM [de] YYYY')
}

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

let interval

onMounted(() => {
  updateDate()
  interval = setInterval(updateDate, 60000) // Actualizar cada minuto
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>