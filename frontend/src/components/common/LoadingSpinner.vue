<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <div class="animate-spin rounded-full border-t-2 border-b-2"
        :class="[sizeClass, colorClass]" >
      </div>
      <div v-if="text" class="mt-4 text-center text-sm text-gray-600">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  },
  text: {
    type: String,
    default: ''
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }
  return sizes[props.size] || sizes.md
})

const colorClass = computed(() => {
  const colors = {
    primary: 'border-primary-600',
    success: 'border-success-600',
    danger: 'border-danger-600',
    warning: 'border-warning-600'
  }
  return colors[props.color] || colors.primary
})

const containerClass = computed(() => {
  return props.fullScreen ? 'min-h-screen' : 'py-12'
})
</script>