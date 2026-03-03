/**
 * Utilidades para formatear datos
*/

import dayjs from 'dayjs'
import 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('es')
dayjs.extend(relativeTime)

/**
 * Formatear números a moneda boliviana
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Bs 0.00'
  
  const number = parseFloat(amount)

  //return `Bs ${numero.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`

  if (isNaN(number)) return 'Bs 0.00'
  
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number)
}

/**
 * Formatear fechas
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '-'
  return dayjs(date).format(format)
}

/**
 * Formatear fecha y hora
 */
export const formatDateTime = (date) => {
  if (!date) return '-'
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

/**
 * Obtener fecha relativa (hace 2 días, etc)
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-'
  return dayjs(date).fromNow()
}

/**
 * Formatear números con separadores de miles
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0'
  
  const num = parseFloat(number)
  if (isNaN(num)) return '0'
  
  return new Intl.NumberFormat('es-BO').format(num)
}

/**
 * Obtener color según el estado de pago
 */
export const getEstadoPagoColor = (estado) => {
  const colors = {
    pagado: 'success',
    pendiente: 'danger',
    parcial: 'warning'
  }
  return colors[estado] || 'secondary'
}

/**
 * Obtener color según el tipo
 */
export const getTipoColor = (tipo) => {
  const colors = {
    ingreso: 'success',
    egreso: 'danger'
  }
  return colors[tipo] || 'primary'
}

/**
 * Capitalizar primera letra
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Obtener mes actual y año
 */
export const getCurrentPeriod = () => {
  const now = dayjs()
  return {
    año: now.year(),
    mes: now.month() + 1,
    mesNombre: now.format('MMMM'),
    fechaInicio: now.startOf('month').format('YYYY-MM-DD'),
    fechaFin: now.endOf('month').format('YYYY-MM-DD')
  }
}