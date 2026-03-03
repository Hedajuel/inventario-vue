<template>
  <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" style="background: rgba(0,0,0,0.5);">
    <div class="bg-white rounded-xl p-6 max-w-2xl w-full" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">
          {{ modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente' }}
        </h3>
        <button @click="cerrar" type="button" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4 max-h-[70vh] overflow-y-auto px-2">
        <!-- Tipo de Cliente -->
        <div>
          <label class="block text-sm font-medium mb-2">Tipo de Cliente *</label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input 
                v-model="formData.tipo_cliente" 
                type="radio" 
                value="persona" 
                class="mr-2"
              />
              <span>Persona</span>
            </label>
            <label class="flex items-center">
              <input 
                v-model="formData.tipo_cliente" 
                type="radio" 
                value="empresa" 
                class="mr-2"
              />
              <span>Empresa</span>
            </label>
          </div>
        </div>

        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium mb-1">
            {{ formData.tipo_cliente === 'empresa' ? 'Nombre de la Empresa *' : 'Nombre *' }}
          </label>
          <input 
            v-model="formData.nombre" 
            type="text" 
            required 
            placeholder="Ej: Juan o Supermercado Los Andes"
            class="w-full border rounded px-3 py-2" 
          />
        </div>

        <!-- Apellido (solo para persona) -->
        <div v-if="formData.tipo_cliente === 'persona'">
          <label class="block text-sm font-medium mb-1">Apellido</label>
          <input 
            v-model="formData.apellido" 
            type="text" 
            placeholder="Ej: Pérez"
            class="w-full border rounded px-3 py-2" 
          />
        </div>

        <!-- NIT / CI -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">
              {{ formData.tipo_cliente === 'empresa' ? 'NIT' : 'CI' }}
            </label>
            <input 
              v-model="formData.nit" 
              type="text" 
              :placeholder="formData.tipo_cliente === 'empresa' ? '12345678' : '7012345 LP'"
              class="w-full border rounded px-3 py-2" 
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Teléfono *</label>
            <input 
              v-model="formData.telefono" 
              type="tel" 
              required
              placeholder="70123456"
              class="w-full border rounded px-3 py-2" 
            />
          </div>
        </div>

        <!-- Email y Celular -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input 
              v-model="formData.email" 
              type="email" 
              placeholder="cliente@email.com"
              class="w-full border rounded px-3 py-2" 
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Celular</label>
            <input 
              v-model="formData.celular" 
              type="tel" 
              placeholder="70100001"
              class="w-full border rounded px-3 py-2" 
            />
          </div>
        </div>

        <!-- Dirección -->
        <div>
          <label class="block text-sm font-medium mb-1">Dirección</label>
          <input 
            v-model="formData.direccion" 
            type="text" 
            placeholder="Av. 6 de Agosto #123"
            class="w-full border rounded px-3 py-2" 
          />
        </div>

        <!-- Ciudad -->
        <div>
          <label class="block text-sm font-medium mb-1">Ciudad *</label>
          <select v-model="formData.ciudad" required class="w-full border rounded px-3 py-2">
            <option value="">Seleccione...</option>
            <option value="Sucre">Sucre</option>
            <option value="Potosí">Potosí</option>
            <option value="Oruro">Oruro</option>
            <option value="Cochabamba">Cochabamba</option>
            <option value="Santa Cruz">Santa Cruz</option>
            <option value="La Paz">La Paz</option>
            <option value="Tarija">Tarija</option>
            <option value="Trinidad">Trinidad</option>
            <option value="Cobija">Cobija</option>
          </select>
        </div>

        <!-- Observaciones -->
        <div>
          <label class="block text-sm font-medium mb-1">Observaciones</label>
          <textarea 
            v-model="formData.observaciones" 
            rows="2" 
            placeholder="Notas adicionales sobre el cliente..."
            class="w-full border rounded px-3 py-2"
          ></textarea>
        </div>

        <!-- Activo -->
        <div class="flex items-center">
          <input 
            v-model="formData.activo" 
            type="checkbox" 
            id="activo"
            class="mr-2"
          />
          <label for="activo" class="text-sm font-medium">Cliente activo</label>
        </div>

        <!-- Botones -->
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
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  cliente: { type: Object, default: null }
})

const emit = defineEmits(['close', 'guardar'])

const modoEdicion = ref(false)

const formData = ref({
  tipo_cliente: 'persona',
  nombre: '',
  apellido: '',
  nit: '',
  telefono: '',
  email: '',
  celular: '',
  direccion: '',
  ciudad: 'Sucre',
  observaciones: '',
  activo: true
})

const cargarDatosCliente = (cliente) => {
  if (!cliente || !cliente.id) {
    modoEdicion.value = false
    formData.value = {
      tipo_cliente: 'persona',
      nombre: '',
      apellido: '',
      nit: '',
      telefono: '',
      email: '',
      celular: '',
      direccion: '',
      ciudad: 'Sucre',
      observaciones: '',
      activo: true
    }
    return
  }

  modoEdicion.value = true
  formData.value = {
    id: cliente.id,
    tipo_cliente: cliente.tipo_cliente || 'persona',
    nombre: cliente.nombre || '',
    apellido: cliente.apellido || '',
    nit: cliente.nit || '',
    telefono: cliente.telefono || '',
    email: cliente.email || '',
    celular: cliente.celular || '',
    direccion: cliente.direccion || '',
    ciudad: cliente.ciudad || 'Sucre',
    observaciones: cliente.observaciones || '',
    activo: cliente.activo === 1 || cliente.activo === true
  }
}

const handleSubmit = () => {
  const datosAEnviar = {
    ...formData.value,
    activo: formData.value.activo ? 1 : 0
  }
  
  console.log('📤 Enviando cliente:', datosAEnviar)
  emit('guardar', datosAEnviar)
}

const cerrar = () => {
  emit('close')
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      cargarDatosCliente(props.cliente)
    })
  }
})

watch(() => props.cliente, (nuevoCliente) => {
  if (props.isOpen) {
    nextTick(() => {
      cargarDatosCliente(nuevoCliente)
    })
  }
}, { deep: true })
</script>