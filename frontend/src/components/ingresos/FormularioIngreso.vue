<template>
  <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.5);">
    <div class="bg-white rounded-xl p-6 max-w-2xl w-full" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">
          {{ modoEdicion ? 'Editar Ingreso' : 'Nuevo Ingreso' }}
        </h3>
        <button @click="cerrar" type="button" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4 max-h-[60vh] overflow-y-auto px-2">
        <div>
          <label class="block text-sm font-medium mb-1">Fecha *</label>
          <input v-model="formData.fecha" type="date" required class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Cliente *</label>
          <select v-model="formData.cliente_id" required class="w-full border rounded px-3 py-2">
            <option value="">Seleccione...</option>
            <option v-for="c in clientes" :key="c.id" :value="c.id">
              {{ c.nombre }} {{ c.apellido || '' }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Tipo de Trabajo *</label>
          <select v-model="formData.tipo_trabajo_id" @change="loadServicios" required class="w-full border rounded px-3 py-2">
            <option value="">Seleccione...</option>
            <option v-for="t in tiposTrabajo" :key="t.id" :value="t.id">{{ t.nombre }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Servicio *</label>
          <select v-model="formData.servicio_id" @change="updatePrecio" :disabled="!formData.tipo_trabajo_id" required class="w-full border rounded px-3 py-2">
            <option value="">Seleccione...</option>
            <option v-for="s in serviciosFilt" :key="s.id" :value="s.id">
              {{ s.nombre }} - Bs {{ s.precio_referencial || 0 }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Precio *</label>
            <input v-model.number="formData.precio_unitario" type="number" step="0.01" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Cantidad *</label>
            <input v-model.number="formData.cantidad" type="number" min="1" required class="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Total Facturado</label>
          <input :value="'Bs ' + totalCalc.toFixed(2)" disabled class="w-full border rounded px-3 py-2 bg-gray-50 font-bold" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Total Pagado (Bs)</label>
          <input 
            v-model="totalPagadoInput" 
            type="number" 
            step="0.10" 
            min="0"
            placeholder="Dejar vacío = Bs 0.00 (pago pendiente)"
            class="w-full border rounded px-3 py-2" 
          />
          <p class="text-xs text-gray-500 mt-1">Si no ingresa nada, se considera Bs 0.00 (sin pago)</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Método de Pago *</label>
          <select v-model="formData.metodo_pago" required class="w-full border rounded px-3 py-2">
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="qr">QR</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Observaciones</label>
          <textarea v-model="formData.observaciones" rows="2" class="w-full border rounded px-3 py-2"></textarea>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button type="button" @click="cerrar" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {{ modoEdicion ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  ingreso: { type: Object, default: null },
  clientes: { type: Array, default: () => [] },
  tiposTrabajo: { type: Array, default: () => [] },
  servicios: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'guardar'])

const serviciosFilt = ref([])
const modoEdicion = ref(false)
const totalPagadoInput = ref('')

const formData = ref({
  fecha: new Date().toISOString().split('T')[0],
  cliente_id: '',
  tipo_trabajo_id: '',
  servicio_id: '',
  precio_unitario: 0,
  cantidad: 1,
  metodo_pago: 'efectivo',
  observaciones: ''
})

const totalCalc = computed(() => {
  return (formData.value.precio_unitario || 0) * (formData.value.cantidad || 1)
})

const loadServicios = () => {
  if (!formData.value.tipo_trabajo_id) {
    serviciosFilt.value = []
    return
  }
  serviciosFilt.value = props.servicios.filter(
    s => s.tipo_trabajo_id === parseInt(formData.value.tipo_trabajo_id)
  )
  //console.log('Servicios cargados:', serviciosFilt.value.length)
}

const updatePrecio = () => {
  const srv = serviciosFilt.value.find(s => s.id === parseInt(formData.value.servicio_id))
  if (srv && srv.precio_referencial) {
    formData.value.precio_unitario = srv.precio_referencial
  }
}

const cargarDatosIngreso = (ingreso) => {
  //console.log('Cargando datos del ingreso:', ingreso) //null
  if (!ingreso || !ingreso.id) {
    console.log('Crear nuevo ingreso')
    modoEdicion.value = false
    formData.value = {
      fecha: new Date().toISOString().split('T')[0],
      cliente_id: '',
      tipo_trabajo_id: '',
      servicio_id: '',
      precio_unitario: 0,
      cantidad: 1,
      metodo_pago: 'efectivo',
      observaciones: ''
    }
    totalPagadoInput.value = ''
    serviciosFilt.value = []
    return
  }
  
  // Modo EDITAR
  modoEdicion.value = true
  
  // Extraer la fecha
  let fechaFormateada = new Date().toISOString().split('T')[0]
  if (ingreso.fecha) {
    const fecha = new Date(ingreso.fecha)
    fechaFormateada = fecha.toISOString().split('T')[0]
  }
  
  // Asignar todos los datos
  formData.value = {
    id: ingreso.id,
    fecha: fechaFormateada,
    cliente_id: ingreso.cliente_id || '',
    tipo_trabajo_id: ingreso.tipo_trabajo_id || '',
    servicio_id: ingreso.servicio_id || '',
    precio_unitario: parseFloat(ingreso.facturado) || parseFloat(ingreso.venta_servicio) || 0,
    cantidad: 1,
    metodo_pago: ingreso.tipo_pago || 'efectivo',
    observaciones: ingreso.observaciones || ''
  }
  
  // Cargar el total pagado en el input separado
  totalPagadoInput.value = 0 || parseFloat(ingreso.venta_servicio)
  
  console.log('Datos cargados en formData:', formData.value)
  console.log('Total pagado:', totalPagadoInput.value)
  
  // Cargar servicios si hay tipo de trabajo
  if (formData.value.tipo_trabajo_id) {
    nextTick(() => {
      loadServicios()
    })
  }
}

const handleSubmit = () => {
  // Convertir total_pagado: vacío/null/undefined = 0, con valor = parseFloat
  let totalPagado = 0
  
  if (totalPagadoInput.value !== '' && 
      totalPagadoInput.value !== null && 
      totalPagadoInput.value !== undefined) {
    totalPagado = parseFloat(totalPagadoInput.value)
    if (isNaN(totalPagado)) {
      totalPagado = 0
    }
  }
  
  const datosAEnviar = {
    ...formData.value,
    total_pagado: totalPagado,
    precio_unitario: parseFloat(formData.value.precio_unitario) || 0,
    cantidad: parseInt(formData.value.cantidad) || 1
  }
  
  console.log('Enviando datos:', datosAEnviar)
  console.log('Total pagado final:', totalPagado)
  console.log('Total facturado:', datosAEnviar.precio_unitario * datosAEnviar.cantidad)
  
  emit('guardar', datosAEnviar)
}

const cerrar = () => {
  emit('close')
}

// Watch para cuando se abre el modal
watch(() => props.isOpen, (isOpen) => {
  console.log('Modal isOpen cambió a:', isOpen)
  if (isOpen) {
    nextTick(() => {
      cargarDatosIngreso(props.ingreso)
    })
  }
})

// Watch para cuando cambia el ingreso
watch(() => props.ingreso, (nuevoIngreso) => {
  console.log('Props.ingreso cambió:', nuevoIngreso)
  if (props.isOpen) {
    nextTick(() => {
      cargarDatosIngreso(nuevoIngreso)
    })
  }
}, { deep: true, immediate: true })

// Cargar datos al montar si el modal ya está abierto
onMounted(() => {
  if (props.isOpen && props.ingreso) {
    console.log('Componente montado con modal abierto')
    cargarDatosIngreso(props.ingreso)
  }
})
</script>