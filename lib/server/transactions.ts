import {
  PAYMENT_METHODS,
  getPackageById,
  type PaymentMethod,
  type TxStatus,
  type VehicleType,
} from '@/lib/data'

export function isVehicle(value: unknown): value is VehicleType {
  return value === 'Motor' || value === 'Mobil'
}

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return typeof value === 'string' && PAYMENT_METHODS.includes(value as PaymentMethod)
}

export function isTxStatus(value: unknown): value is TxStatus {
  return value === 'Diproses' || value === 'Selesai' || value === 'Batal'
}

export function parseNewTransaction(input: unknown) {
  if (!input || typeof input !== 'object') return null
  const data = input as Record<string, unknown>
  const customer = typeof data.customer === 'string' ? data.customer.trim() : ''
  const phone = typeof data.phone === 'string' ? data.phone.trim() : ''
  const plate = typeof data.plate === 'string' ? data.plate.trim().toUpperCase() : ''
  const packageId = typeof data.packageId === 'string' ? data.packageId : ''
  const vehicle = data.vehicle
  const payment = data.payment
  const pkg = getPackageById(packageId)

  if (!customer || !phone || !plate || !isVehicle(vehicle) || !isPaymentMethod(payment) || !pkg || pkg.vehicle !== vehicle) {
    return null
  }

  return { customer, phone, plate, vehicle, payment, pkg }
}