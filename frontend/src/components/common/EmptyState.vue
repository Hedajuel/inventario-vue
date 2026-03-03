<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <component :is="icon" class="w-12 h-12 text-gray-400" />
    </div>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-500 text-center max-w-md mb-6">{{ description }}</p>
    <slot name="action">
      <button v-if="actionText" @click="$emit('action')" class="btn btn-primary">
        {{ actionText }}
      </button>
    </slot>
  </div>
</template>

<script setup>
import { InboxIcon } from '@heroicons/vue/24/outline'

defineProps({
  icon: {
    type: Object,
    default: () => InboxIcon
  },
  title: {
    type: String,
    default: 'No hay datos'
  },
  description: {
    type: String,
    default: 'No se encontraron registros para mostrar'
  },
  actionText: {
    type: String,
    default: ''
  }
})

defineEmits(['action'])
</script>