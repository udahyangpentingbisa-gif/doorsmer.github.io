export type VehicleType = 'Motor' | 'Mobil'
export type TxStatus = 'Diproses' | 'Selesai' | 'Batal'
export type PaymentMethod = 'Tunai' | 'QRIS' | 'Transfer Bank' | 'E-Wallet'

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Tunai',
  'QRIS',
  'Transfer Bank',
  'E-Wallet',
]

export type ServicePackage = {
  id: string
  name: string
  price: number
  vehicle: VehicleType
  duration: string
  features: string[]
  popular?: boolean
}

export type Transaction = {
  id: string
  customer: string
  phone?: string
  vehicle: VehicleType
  plate: string
  packageId: string
  packageName: string
  price: number
  status: TxStatus
  payment: PaymentMethod
  createdAt: string // ISO string
}

/* ----------------------------- Pricing ----------------------------- */

export const MOTOR_PACKAGES: ServicePackage[] = [
  {
    id: 'motor-kecil',
    name: 'Cuci Motor Kecil',
    price: 15000,
    vehicle: 'Motor',
    duration: '± 20 menit',
    features: [
      'Untuk motor bebek & matic',
      'Cuci body & ban',
      'Semir ban',
      'Lap kering microfiber',
    ],
  },
  {
    id: 'motor-besar',
    name: 'Cuci Motor Besar',
    price: 20000,
    vehicle: 'Motor',
    duration: '± 30 menit',
    popular: true,
    features: [
      'Untuk motor sport & moge',
      'Cuci body & ban',
      'Semir ban',
      'Pembersih rantai',
      'Lap kering microfiber',
    ],
  },
]

export const MOBIL_PACKAGES: ServicePackage[] = [
  {
    id: 'mobil-standar',
    name: 'Cuci Mobil',
    price: 50000,
    vehicle: 'Mobil',
    duration: '± 45 menit',
    popular: true,
    features: [
      'Untuk semua jenis mobil',
      'Cuci body & ban',
      'Vacuum interior',
      'Semir ban & dashboard',
      'Lap kering microfiber',
    ],
  },
]

export const ALL_PACKAGES = [...MOTOR_PACKAGES, ...MOBIL_PACKAGES]

export function getPackageById(id: string) {
  return ALL_PACKAGES.find((p) => p.id === id)
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

/* --------------------------- Dummy data ---------------------------- */

function iso(hoursAgo: number) {
  const d = new Date()
  d.setHours(d.getHours() - hoursAgo)
  return d.toISOString()
}

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-1042',
    customer: 'Budi Santoso',
    phone: '0812-3456-7890',
    vehicle: 'Mobil',
    plate: 'BK 1234 CD',
    packageId: 'mobil-standar',
    packageName: 'Cuci Mobil',
    price: 50000,
    status: 'Diproses',
    payment: 'QRIS',
    createdAt: iso(0),
  },
  {
    id: 'TRX-1041',
    customer: 'Rina Wijaya',
    phone: '0813-2211-9087',
    vehicle: 'Motor',
    plate: 'BK 5521 TQ',
    packageId: 'motor-besar',
    packageName: 'Cuci Motor Besar',
    price: 20000,
    status: 'Diproses',
    payment: 'Tunai',
    createdAt: iso(1),
  },
  {
    id: 'TRX-1040',
    customer: 'Agus Pratama',
    phone: '0857-8899-1234',
    vehicle: 'Mobil',
    plate: 'BK 9087 XY',
    packageId: 'mobil-standar',
    packageName: 'Cuci Mobil',
    price: 50000,
    status: 'Selesai',
    payment: 'Transfer Bank',
    createdAt: iso(2),
  },
  {
    id: 'TRX-1039',
    customer: 'Siti Aminah',
    phone: '0821-4455-6677',
    vehicle: 'Motor',
    plate: 'BK 3311 KK',
    packageId: 'motor-kecil',
    packageName: 'Cuci Motor Kecil',
    price: 15000,
    status: 'Selesai',
    payment: 'E-Wallet',
    createdAt: iso(3),
  },
  {
    id: 'TRX-1038',
    customer: 'Dedi Kurniawan',
    phone: '0838-1212-3434',
    vehicle: 'Motor',
    plate: 'BK 7788 LM',
    packageId: 'motor-besar',
    packageName: 'Cuci Motor Besar',
    price: 20000,
    status: 'Selesai',
    payment: 'Tunai',
    createdAt: iso(4),
  },
  {
    id: 'TRX-1037',
    customer: 'Maya Sari',
    phone: '0812-9090-1010',
    vehicle: 'Mobil',
    plate: 'BK 2020 VV',
    packageId: 'mobil-standar',
    packageName: 'Cuci Mobil',
    price: 50000,
    status: 'Selesai',
    payment: 'QRIS',
    createdAt: iso(5),
  },
  {
    id: 'TRX-1036',
    customer: 'Hendra Gunawan',
    phone: '0899-3344-5566',
    vehicle: 'Mobil',
    plate: 'BK 1515 AB',
    packageId: 'mobil-standar',
    packageName: 'Cuci Mobil',
    price: 50000,
    status: 'Batal',
    payment: 'QRIS',
    createdAt: iso(6),
  },
  {
    id: 'TRX-1035',
    customer: 'Lestari Ningsih',
    phone: '0813-7676-8989',
    vehicle: 'Motor',
    plate: 'BK 4949 ZP',
    packageId: 'motor-kecil',
    packageName: 'Cuci Motor Kecil',
    price: 15000,
    status: 'Selesai',
    payment: 'Tunai',
    createdAt: iso(7),
  },
]
