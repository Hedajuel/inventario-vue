<template>
  <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.5);">
    <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl" @click.stop>
      <div class="text-center">
        <!-- Icono de advertencia -->
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <!-- Título -->
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ titulo }}
        </h3>

        <!-- Mensaje -->
        <p class="text-sm text-gray-600 mb-6">
          {{ mensaje }}
        </p>

        <!-- Botones -->
        <div class="flex gap-3">
          <button
            @click="handleCancel"
            type="button"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {{ textoCancelar }}
          </button>
          <button
            @click="handleConfirm"
            type="button"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {{ textoConfirmar }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  titulo: {
    type: String,
    default: '¿Estás seguro?'
  },
  mensaje: {
    type: String,
    default: 'Esta acción no se puede deshacer.'
  },
  textoConfirmar: {
    type: String,
    default: 'Eliminar'
  },
  textoCancelar: {
    type: String,
    default: 'Cancelar'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  console.log('Confirmación emitida')
  emit('confirm')
}

const handleCancel = () => {
  console.log('Cancelación emitida')
  emit('cancel')
}

// Cerrar con Escape
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    console.log('Escape presionado')
    handleCancel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>