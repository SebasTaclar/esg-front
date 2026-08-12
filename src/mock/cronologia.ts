import type { EventoCronologia } from '@/types/crmTypes'

export const mockCronologia: EventoCronologia[] = [
  // RESPALDO VITAL
  { id: 1, entidadTipo: 'cliente', entidadId: 1, tipo: 'cliente_creado', descripcion: 'Cliente registrado en el sistema', usuario: 'Sistema', fecha: '2021-03-15T10:00:00Z' },
  { id: 2, entidadTipo: 'proyecto', entidadId: 1, tipo: 'proyecto_creado', descripcion: 'Proyecto 0001-SG creado: Implementación ISO 9001', usuario: 'Camila Rodríguez', fecha: '2025-02-15T10:00:00Z' },
  { id: 3, entidadTipo: 'proyecto', entidadId: 1, tipo: 'cotizacion_enviada', descripcion: 'Cotización enviada para implementación SG', usuario: 'Camila Rodríguez', fecha: '2025-02-20T14:00:00Z' },
  { id: 4, entidadTipo: 'proyecto', entidadId: 1, tipo: 'proyecto_aprobado', descripcion: 'Proyecto aprobado por el cliente', usuario: 'Camila Rodríguez', fecha: '2025-02-28T09:00:00Z' },
  { id: 5, entidadTipo: 'proyecto', entidadId: 1, tipo: 'reunion', descripcion: 'Reunión de arranque del proyecto', usuario: 'Camila Rodríguez', fecha: '2025-03-05T10:00:00Z' },
  { id: 6, entidadTipo: 'proyecto', entidadId: 1, tipo: 'documento_cargado', descripcion: 'Manual de calidad v1.0 cargado', usuario: 'Camila Rodríguez', fecha: '2025-03-20T16:00:00Z' },
  { id: 7, entidadTipo: 'proyecto', entidadId: 1, tipo: 'documento_cargado', descripcion: 'Manual de calidad v2.1 cargado (revisado)', usuario: 'Camila Rodríguez', fecha: '2025-04-20T16:30:00Z' },

  // CIDET LAB
  { id: 8, entidadTipo: 'cliente', entidadId: 2, tipo: 'cliente_creado', descripcion: 'Cliente registrado en el sistema', usuario: 'Sistema', fecha: '2020-06-10T08:00:00Z' },
  { id: 9, entidadTipo: 'proyecto', entidadId: 2, tipo: 'proyecto_creado', descripcion: 'Proyecto 0001-LAB creado: Acreditación laboratorio', usuario: 'Andrés López', fecha: '2024-12-10T08:00:00Z' },
  { id: 10, entidadTipo: 'proyecto', entidadId: 2, tipo: 'reunion', descripcion: 'Visita técnica al laboratorio', usuario: 'Andrés López', fecha: '2025-01-20T09:00:00Z' },
  { id: 11, entidadTipo: 'proyecto', entidadId: 2, tipo: 'reunion', descripcion: 'Segunda visita de verificación', usuario: 'Andrés López', fecha: '2025-03-15T10:00:00Z' },

  // BIOSC LAB (Finalizado)
  { id: 12, entidadTipo: 'cliente', entidadId: 4, tipo: 'cliente_creado', descripcion: 'Cliente registrado', usuario: 'Sistema', fecha: '2022-02-01T10:00:00Z' },
  { id: 13, entidadTipo: 'proyecto', entidadId: 3, tipo: 'proyecto_creado', descripcion: 'Proyecto 0002-LAB creado', usuario: 'Camila Rodríguez', fecha: '2024-05-15T10:00:00Z' },
  { id: 14, entidadTipo: 'proyecto', entidadId: 3, tipo: 'proyecto_finalizado', descripcion: 'Proyecto finalizado. Acreditación obtenida.', usuario: 'Camila Rodríguez', fecha: '2024-12-15T16:00:00Z' },

  // ZOSER
  { id: 15, entidadTipo: 'cliente', entidadId: 8, tipo: 'cliente_creado', descripcion: 'Cliente registrado', usuario: 'Sistema', fecha: '2021-09-01T09:00:00Z' },
  { id: 16, entidadTipo: 'proyecto', entidadId: 9, tipo: 'proyecto_creado', descripcion: 'Proyecto 0003-SG creado: Auditoría ISO 17020', usuario: 'Camila Rodríguez', fecha: '2024-12-01T08:00:00Z' },
  { id: 17, entidadTipo: 'proyecto', entidadId: 9, tipo: 'reunion', descripcion: 'Segunda ronda de auditorías iniciada', usuario: 'Camila Rodríguez', fecha: '2025-05-15T09:00:00Z' },

  // Farma Salud
  { id: 18, entidadTipo: 'cliente', entidadId: 11, tipo: 'cliente_creado', descripcion: 'Cliente registrado', usuario: 'Sistema', fecha: '2021-07-20T09:00:00Z' },
  { id: 19, entidadTipo: 'proyecto', entidadId: 7, tipo: 'proyecto_creado', descripcion: 'Proyecto 0001-CPR creado: Certificación ISO 17065', usuario: 'Camila Rodríguez', fecha: '2025-01-20T10:00:00Z' },
  { id: 20, entidadTipo: 'proyecto', entidadId: 7, tipo: 'visita', descripcion: 'Visita a planta de producción', usuario: 'Camila Rodríguez', fecha: '2025-05-10T08:00:00Z' },
]
