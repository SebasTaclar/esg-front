import type { Seguimiento } from '@/types/crmTypes'

export const mockSeguimientos: Seguimiento[] = [
  // Proyecto 1 - RESPALDO VITAL SG
  { id: 1, proyectoId: 1, tipo: 'reunion', descripcion: 'Reunión de arranque para definición del alcance del SG. Se confirmaron los procesos clave.', fecha: '2025-03-05T10:00:00Z', proximaActividad: 'Entrega de manual de calidad', fechaProximaActividad: '2025-04-15T10:00:00Z', usuario: 'Camila Rodríguez', createdAt: '2025-03-05T10:00:00Z' },
  { id: 2, proyectoId: 1, tipo: 'llamada', descripcion: 'Llamada con María Torres para revisar avance de documentación. Solicita ajustes al manual.', fecha: '2025-04-10T14:30:00Z', proximaActividad: 'Revisión de procedimientos', fechaProximaActividad: '2025-05-01T09:00:00Z', usuario: 'Camila Rodríguez', createdAt: '2025-04-10T14:30:00Z' },
  { id: 3, proyectoId: 1, tipo: 'correo', descripcion: 'Envío de versión revisada del manual de calidad v2.1. Incluye observaciones del cliente.', fecha: '2025-04-20T16:00:00Z', usuario: 'Camila Rodríguez', createdAt: '2025-04-20T16:00:00Z' },
  { id: 4, proyectoId: 1, tipo: 'compromiso', descripcion: 'Pendiente: Programar auditoría interna para el segundo semestre.', fecha: '2025-05-20T10:00:00Z', proximaActividad: 'Auditoría interna', fechaProximaActividad: '2025-07-01T09:00:00Z', usuario: 'Camila Rodríguez', createdAt: '2025-05-20T10:00:00Z' },

  // Proyecto 2 - CIDET LAB
  { id: 5, proyectoId: 2, tipo: 'reunion', descripcion: 'Visita técnica al laboratorio. Se evaluaron las instalaciones y equipamiento.', fecha: '2025-01-20T09:00:00Z', proximaActividad: 'Capacitación personal', fechaProximaActividad: '2025-02-15T08:00:00Z', usuario: 'Andrés López', createdAt: '2025-01-20T09:00:00Z' },
  { id: 6, proyectoId: 2, tipo: 'visita', descripcion: 'Segunda visita para verificación de implementación de procedimientos de ensayo.', fecha: '2025-03-15T10:00:00Z', proximaActividad: 'Evaluación de competencia', fechaProximaActividad: '2025-04-20T09:00:00Z', usuario: 'Andrés López', createdAt: '2025-03-15T10:00:00Z' },
  { id: 7, proyectoId: 2, tipo: 'llamada', descripcion: 'Llamada con Sandra Ospina. Confirman avance en la incertidumbre de medición.', fecha: '2025-05-10T15:00:00Z', proximaActividad: 'Revisión de resultados', fechaProximaActividad: '2025-06-01T09:00:00Z', usuario: 'Andrés López', createdAt: '2025-05-10T15:00:00Z' },

  // Proyecto 3 - BIOSC LAB (Finalizado)
  { id: 8, proyectoId: 3, tipo: 'reunion', descripcion: 'Reunión de cierre del proyecto. Se entregaron todos los entregables.', fecha: '2024-12-15T10:00:00Z', usuario: 'Camila Rodríguez', createdAt: '2024-12-15T10:00:00Z' },

  // Proyecto 4 - Lab García
  { id: 9, proyectoId: 4, tipo: 'reunion', descripcion: 'Reunión de arranque. Se definieron las actividades de auditoría de segundo nivel.', fecha: '2025-04-05T09:00:00Z', proximaActividad: 'Segunda ronda de auditoría', fechaProximaActividad: '2025-06-15T09:00:00Z', usuario: 'Andrés López', createdAt: '2025-04-05T09:00:00Z' },
  { id: 10, proyectoId: 4, tipo: 'correo', descripcion: 'Envío de plan de auditoría y checklist de verificación al cliente.', fecha: '2025-05-01T11:00:00Z', usuario: 'Andrés López', createdAt: '2025-05-01T11:00:00Z' },

  // Proyecto 7 - Farma Salud CPR
  { id: 11, proyectoId: 7, tipo: 'reunion', descripcion: 'Reunión técnica para definición del alcance de certificación.', fecha: '2025-02-10T10:00:00Z', proximaActividad: 'Documentación técnica', fechaProximaActividad: '2025-04-01T09:00:00Z', usuario: 'Camila Rodríguez', createdAt: '2025-02-10T10:00:00Z' },
  { id: 12, proyectoId: 7, tipo: 'llamada', descripcion: 'Llamada con Dra. Vega. Revisión de avance en documentación regulatoria.', fecha: '2025-04-15T14:00:00Z', proximaActividad: 'Envío de documentación', fechaProximaActividad: '2025-05-30T09:00:00Z', usuario: 'Camila Rodríguez', createdAt: '2025-04-15T14:00:00Z' },
  { id: 13, proyectoId: 7, tipo: 'visita', descripcion: 'Visita a planta de producción. Se verificaron condiciones de fabricación.', fecha: '2025-05-10T08:00:00Z', proximaActividad: 'Informe de hallazgos', fechaProximaActividad: '2025-06-10T09:00:00Z', usuario: 'Camila Rodríguez', createdAt: '2025-05-10T08:00:00Z' },

  // Proyecto 9 - ZOSER
  { id: 14, proyectoId: 9, tipo: 'reunion', descripcion: 'Segunda ronda de auditorías. Evaluación de procesos de inspección.', fecha: '2025-05-15T09:00:00Z', proximaActividad: 'Informe de auditoría', fechaProximaActividad: '2025-06-20T09:00:00Z', usuario: 'Camila Rodríguez', createdAt: '2025-05-15T09:00:00Z' },
]
