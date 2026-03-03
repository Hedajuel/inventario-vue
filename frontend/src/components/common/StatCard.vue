<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-1">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ formattedValue }}</p>
        <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
        <component :is="icon" class="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, formatNumber } from '@/utils/formatters'

const props = defineProps({
  title: String,
  value: [Number, String],
  type: {
    type: String,
    default: 'number'
  },
  icon: [Object, Function],  // ✅ Ahora acepta Object o Function
  color: {
    type: String,
    default: 'primary'
  },
  subtitle: String
})

const formattedValue = computed(() => {
  if (props.type === 'currency') {
    return formatCurrency(props.value)
  }
  return formatNumber(props.value)
})
</script>