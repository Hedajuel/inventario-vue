<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    <!-- Botón Menu (móvil) -->
    <button
      @click="$emit('toggleSidebar')"
      class="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Fecha actual -->
    <div class="text-sm text-gray-600">
      {{ fechaActual }}
    </div>

    <!-- Usuario -->
    <div class="flex items-center gap-4">
      <!-- Notificaciones -->
      <button class="p-2 rounded-lg hover:bg-gray-100 relative">
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>

      <!-- Usuario -->
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm font-semibold text-gray-900">Administrador</p>
          <p class="text-xs text-gray-500">admin@tecnofrio.com</p>
        </div>
        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span class="text-white font-semibold">A</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

defineEmits(['toggleSidebar'])

const fechaActual = computed(() => {
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('es-ES', opciones)
})
</script>