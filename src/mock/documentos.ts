import type { Documento } from '@/types/crmTypes'

export const mockDocumentos: Documento[] = [
  // Proyecto 1 - RESPALDO VITAL SG
  { id: 1, proyectoId: 1, nombre: 'Contrato marco RESPALDO VITAL 2025.pdf', tipo: 'contrato', url: '#', tamano: 245000, usuario: 'Camila Rodríguez', createdAt: '2025-02-15T10:00:00Z' },
  { id: 2, proyectoId: 1, nombre: 'Cotización implementación SG.pdf', tipo: 'cotizacion', url: '#', tamano: 180000, usuario: 'Camila Rodríguez', createdAt: '2025-02-20T14:00:00Z' },
  { id: 3, proyectoId: 1, nombre: 'Manual de Calidad v2.1.pdf', tipo: 'informe', url: '#', tamano: 520000, usuario: 'Camila Rodríguez', createdAt: '2025-04-20T16:30:00Z' },
  { id: 4, proyectoId: 1, nombre: 'Acta de reunión arranque.pdf', tipo: 'acta', url: '#', tamano: 95000, usuario: 'Camila Rodríguez', createdAt: '2025-03-05T12:00:00Z' },

  // Proyecto 2 - CIDET LAB
  { id: 5, proyectoId: 2, nombre: 'Cotización acreditación LAB.pdf', tipo: 'cotizacion', url: '#', tamano: 310000, usuario: 'Andrés López', createdAt: '2024-12-10T10:00:00Z' },
  { id: 6, proyectoId: 2, nombre: 'Informe de visita técnica.pdf', tipo: 'informe', url: '#', tamano: 420000, usuario: 'Andrés López', createdAt: '2025-01-25T14:00:00Z' },
  { id: 7, proyectoId: 2, nombre: 'Presentación avances Q1.pptx', tipo: 'presentacion', url: '#', tamano: 1500000, usuario: 'Andrés López', createdAt: '2025-04-01T09:00:00Z' },

  // Proyecto 3 - BIOSC LAB (Finalizado)
  { id: 8, proyectoId: 3, nombre: 'Certificado de acreditación BIOSC.pdf', tipo: 'certificado', url: '#', tamano: 350000, usuario: 'Camila Rodríguez', createdAt: '2024-12-15T16:00:00Z' },
  { id: 9, proyectoId: 3, nombre: 'Informe final de implementación.pdf', tipo: 'informe', url: '#', tamano: 890000, usuario: 'Camila Rodríguez', createdAt: '2024-12-10T10:00:00Z' },

  // Proyecto 7 - Farma Salud CPR
  { id: 10, proyectoId: 7, nombre: 'Cotización certificación CPR.pdf', tipo: 'cotizacion', url: '#', tamano: 275000, usuario: 'Camila Rodríguez', createdAt: '2025-01-20T10:00:00Z' },
  { id: 11, proyectoId: 7, nombre: 'Protocolo de ensayo.pdf', tipo: 'informe', url: '#', tamano: 650000, usuario: 'Camila Rodríguez', createdAt: '2025-03-15T11:00:00Z' },

  // Proyecto 9 - ZOSER
  { id: 12, proyectoId: 9, nombre: 'Plan de auditoría ISO 17020.pdf', tipo: 'informe', url: '#', tamano: 410000, usuario: 'Camila Rodríguez', createdAt: '2025-01-05T10:00:00Z' },
  { id: 13, proyectoId: 9, nombre: 'Acta de auditoría ronda 1.pdf', tipo: 'acta', url: '#', tamano: 180000, usuario: 'Camila Rodríguez', createdAt: '2025-03-20T16:00:00Z' },
]
