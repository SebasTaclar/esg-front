import type { TipoProyecto, Norma, EstadoProyecto, TipoServicio } from '@/types/crmTypes'

export const mockTiposProyecto: TipoProyecto[] = [
  { id: 1, abreviatura: 'SG', nombre: 'Sistema de Gestión', activo: true },
  { id: 2, abreviatura: 'LAB', nombre: 'Laboratorio de Ensayo', activo: true },
  { id: 3, abreviatura: 'LAC', nombre: 'Laboratorio de Calibración', activo: true },
  { id: 4, abreviatura: 'CPR', nombre: 'Certificación de Productos', activo: true },
  { id: 5, abreviatura: 'OIN', nombre: 'Organismo de Inspección', activo: true },
]

export const mockNormas: Norma[] = [
  { id: 1, codigo: 'ISO 9001', nombre: 'Sistemas de Gestión de Calidad', activa: true },
  { id: 2, codigo: 'ISO 17020', nombre: 'Inspección de productos', activa: true },
  { id: 3, codigo: 'ISO 17025', nombre: 'Ensayos y calibración', activa: true },
  { id: 4, codigo: 'ISO 17065', nombre: 'Certificación de productos', activa: true },
  { id: 5, codigo: 'ISO 14001', nombre: 'Gestión Ambiental', activa: true },
  { id: 6, codigo: 'ISO 45001', nombre: 'Seguridad y Salud en el Trabajo', activa: true },
]

export const mockEstadosProyecto: EstadoProyecto[] = [
  { id: 1, codigo: 'prospecto', nombre: 'Prospecto', color: '#6B7280', orden: 1 },
  { id: 2, codigo: 'cotizacion', nombre: 'Cotización', color: '#3B82F6', orden: 2 },
  { id: 3, codigo: 'aprobado', nombre: 'Aprobado', color: '#10B981', orden: 3 },
  { id: 4, codigo: 'en_ejecucion', nombre: 'En ejecución', color: '#F59E0B', orden: 4 },
  { id: 5, codigo: 'finalizado', nombre: 'Finalizado', color: '#10B981', orden: 5 },
  { id: 6, codigo: 'suspendido', nombre: 'Suspendido', color: '#EF4444', orden: 6 },
  { id: 7, codigo: 'cancelado', nombre: 'Cancelado', color: '#6B7280', orden: 7 },
]

export const mockTiposServicio: TipoServicio[] = [
  { id: 1, nombre: 'Consultoría', activo: true },
  { id: 2, nombre: 'Auditoría', activo: true },
  { id: 3, nombre: 'Formación', activo: true },
  { id: 4, nombre: 'Gestión Metrológica', activo: true },
]
