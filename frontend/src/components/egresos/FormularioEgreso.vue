<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" v-if="isOpen">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="cerrar"></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ isEditing ? 'Editar Egreso' : 'Nuevo Egreso' }}
            </h3>
            <button @click="cerrar" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="guardar" class="p-6 space-y-4">
          <!-- Fecha -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <input
              v-model="form.fecha"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>

          <!-- Categoría (Tipo de Egreso) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              v-model="form.tipo_egreso_id"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
            >
              <option value="">Seleccione una categoría</option>
              <option v-for="tipo in tiposEgreso" :key="tipo.id" :value="tipo.id">
                {{ tipo.nombre }}
              </option>
            </select>
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              v-model="form.descripcion"
              required
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="Describe el gasto..."
            ></textarea>
          </div>

          <!-- Precio y Cantidad -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Precio Unitario (Bs) *
              </label>
              <input
                v-model.number="form.precio_unitario"
                type="number"
                step="0.01"
                required
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Cantidad *
              </label>
              <input
                v-model.number="form.cantidad"
                type="number"
                required
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
          </div>

          <!-- Total Pagado (calculado) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Total Pagado
            </label>
            <input
              :value="formatCurrency(totalPagado)"
              type="text"
              disabled
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold"
            />
          </div>

          <!-- Proveedor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Proveedor
            </label>
            <input
              v-model="form.proveedor"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="Nombre del proveedor"
            />
          </div>

          <!-- Número de Factura -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Factura
            </label>
            <input
              v-model="form.nro_factura"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="Ej: 001-002-12345"
            />
          </div>

          <!-- Método de Pago -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago *
            </label>
            <select
              v-model="form.metodo_pago"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          <!-- Observaciones -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              v-model="form.observaciones"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="Notas adicionales..."
            ></textarea>
          </div>

          <!-- Botones -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="cerrar"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({
  isOpen: Boolean,
  egreso: Object,
  tiposEgreso: Array
})

const emit = defineEmits(['close', 'guardar'])

const loading = ref(false)

const isEditing = computed(() => !!props.egreso?.id)

const form = ref({
  fecha: new Date().toISOString().split('T')[0],
  tipo_egreso_id: '',
  descripcion: '',
  precio_unitario: 0,
  cantidad: 1,
  proveedor: '',
  nro_factura: '',
  metodo_pago: 'efectivo',
  observaciones: ''
})

const totalPagado = computed(() => {
  return (form.value.precio_unitario || 0) * (form.value.cantidad || 1)
})

const cerrar = () => {
  resetForm()
  emit('close')
}

const guardar = async () => {
  loading.value = true
  try {
    await emit('guardar', form.value)
    cerrar()
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    fecha: new Date().toISOString().split('T')[0],
    tipo_egreso_id: '',
    descripcion: '',
    precio_unitario: 0,
    cantidad: 1,
    proveedor: '',
    nro_factura: '',
    metodo_pago: 'efectivo',
    observaciones: ''
  }
}

// Cargar datos cuando se edita
watch(() => props.egreso, (nuevoEgreso) => {
  if (nuevoEgreso && nuevoEgreso.id) {
    form.value = {
      id: nuevoEgreso.id,
      fecha: nuevoEgreso.fecha.split('T')[0],
      tipo_egreso_id: nuevoEgreso.tipo_egreso_id,
      descripcion: nuevoEgreso.descripcion,
      precio_unitario: nuevoEgreso.precio_unitario,
      cantidad: nuevoEgreso.cantidad,
      proveedor: nuevoEgreso.proveedor || '',
      nro_factura: nuevoEgreso.nro_factura || '',
      metodo_pago: nuevoEgreso.metodo_pago || 'efectivo',
      observaciones: nuevoEgreso.observaciones || ''
    }
  }
}, { immediate: true })
</script>