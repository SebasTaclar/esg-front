import type { Contacto } from '@/types/crmTypes'

export const mockContactos: Contacto[] = [
  // RESPALDO VITAL
  { id: 1, clienteId: 1, nombre: 'María Fernanda Torres', cargo: 'Gerente General', celular: '+57 310 1234567', correo: 'mf.torres@respaldovital.com', esPrincipal: true, createdAt: '2021-03-15T10:00:00Z' },
  { id: 2, clienteId: 1, nombre: 'Carlos Andrés Méndez', cargo: 'Jefe de Calidad', celular: '+57 311 2345678', correo: 'ca.mendez@respaldovital.com', esPrincipal: false, createdAt: '2021-03-15T10:00:00Z' },
  { id: 3, clienteId: 1, nombre: 'Laura Valentina Ríos', cargo: 'Coordinadora de Procesos', celular: '+57 312 3456789', correo: 'lv.rios@respaldovital.com', esPrincipal: false, createdAt: '2022-06-20T14:00:00Z' },

  // CIDET
  { id: 4, clienteId: 2, nombre: 'Roberto Parra García', cargo: 'Director de Investigación', celular: '+57 320 4567890', correo: 'rp.garcia@cidet.org.co', esPrincipal: true, createdAt: '2020-06-10T08:00:00Z' },
  { id: 5, clienteId: 2, nombre: 'Sandra Milena Ospina', cargo: 'Jefa de Laboratorio', celular: '+57 321 5678901', correo: 'sm.ospina@cidet.org.co', esPrincipal: false, createdAt: '2020-06-10T08:00:00Z' },

  // Universidad Nacional
  { id: 6, clienteId: 3, nombre: 'Dr. Fernando Gutiérrez', cargo: 'Vicerrector de Investigación', celular: '+57 300 6789012', correo: 'f.gutierrez@unal.edu.co', esPrincipal: true, createdAt: '2019-01-20T09:00:00Z' },
  { id: 7, clienteId: 3, nombre: 'Ing. Patricia Moreno', cargo: 'Jefa de Laboratorio de Química', celular: '+57 301 7890123', correo: 'p.moreno@unal.edu.co', esPrincipal: false, createdAt: '2019-01-20T09:00:00Z' },
  { id: 8, clienteId: 3, nombre: 'Carlos Mendoza', cargo: 'Coordinador de Calidad', celular: '+57 302 8901234', correo: 'c.mendoza@unal.edu.co', esPrincipal: false, createdAt: '2020-03-15T11:00:00Z' },
  { id: 9, clienteId: 3, nombre: 'Ana María Rodríguez', cargo: 'Decana Facultad de Ciencias', celular: '+57 303 9012345', correo: 'am.rodriguez@unal.edu.co', esPrincipal: false, createdAt: '2021-08-10T09:00:00Z' },

  // BIOSC
  { id: 10, clienteId: 4, nombre: 'Dr. Alejandro Ramírez', cargo: 'Director Científico', celular: '+57 315 1112233', correo: 'a.ramirez@biosc.com.co', esPrincipal: true, createdAt: '2022-02-01T10:00:00Z' },
  { id: 11, clienteId: 4, nombre: 'Diana Carolina Suárez', cargo: 'Jefa de Calidad', celular: '+57 316 2233444', correo: 'dc.suarez@biosc.com.co', esPrincipal: false, createdAt: '2022-02-01T10:00:00Z' },

  // BIOSC - Inspección
  { id: 52, clienteId: 20, nombre: 'Ing. Carlos Andrés Mejía', cargo: 'Jefe de Inspección', celular: '+57 317 3344556', correo: 'ca.mejia@biosc.com.co', esPrincipal: true, createdAt: '2023-06-15T10:00:00Z' },
  { id: 53, clienteId: 20, nombre: 'Ing. Patricia López', cargo: 'Auditora Líder', celular: '+57 318 4455667', correo: 'p.lopez@biosc.com.co', esPrincipal: false, createdAt: '2023-06-15T10:00:00Z' },

  // SHI
  { id: 12, clienteId: 5, nombre: 'Luis Eduardo Perea', cargo: 'Gerente de Operaciones', celular: '+57 318 3344556', correo: 'le.perea@shi.com.co', esPrincipal: true, createdAt: '2023-08-12T14:00:00Z' },

  // FYR Ingenieros
  { id: 13, clienteId: 6, nombre: 'Ing. Ricardo Fierro', cargo: 'Socio Director', celular: '+57 319 4455667', correo: 'r.fierro@fyringenieros.com', esPrincipal: true, createdAt: '2020-11-05T08:30:00Z' },
  { id: 14, clienteId: 6, nombre: 'Valentina Restrepo', cargo: 'Jefa de Proyectos', celular: '+57 320 5566778', correo: 'v.restrepo@fyringenieros.com', esPrincipal: false, createdAt: '2021-04-15T10:00:00Z' },

  // AFC Ingeniería (Prospecto)
  { id: 15, clienteId: 7, nombre: 'Ing. José Manuel Cruz', cargo: 'Gerente', celular: '+57 322 6677889', correo: 'jm.cruz@afcingenieria.co', esPrincipal: true, createdAt: '2025-04-20T11:00:00Z' },

  // ZOSER
  { id: 16, clienteId: 8, nombre: 'Mg. Natalia Vargas', cargo: 'Directora de Calidad', celular: '+57 323 7788990', correo: 'n.vargas@zoser.com.co', esPrincipal: true, createdAt: '2021-09-01T09:00:00Z' },
  { id: 17, clienteId: 8, nombre: 'Andrés Felipe Torres', cargo: 'Líder de Inspección', celular: '+57 324 8899001', correo: 'af.torres@zoser.com.co', esPrincipal: false, createdAt: '2022-03-10T14:00:00Z' },
  { id: 18, clienteId: 8, nombre: 'Mónica Andrea López', cargo: 'Coordinadora de Sistemas', celular: '+57 325 9900112', correo: 'ma.lopez@zoser.com.co', esPrincipal: false, createdAt: '2023-07-20T08:00:00Z' },

  // Laboratorio García
  { id: 19, clienteId: 9, nombre: 'Ing. Pedro García', cargo: 'Gerente General', celular: '+57 305 1122334', correo: 'p.garcia@laboratoriogarcia.com', esPrincipal: true, createdAt: '2022-05-15T10:00:00Z' },
  { id: 20, clienteId: 9, nombre: 'Isabel Cristina Duarte', cargo: 'Jefa de Ensayos', celular: '+57 306 2233445', correo: 'ic.duarte@laboratoriogarcia.com', esPrincipal: false, createdAt: '2022-05-15T10:00:00Z' },

  // Energía Eléctrica
  { id: 21, clienteId: 10, nombre: 'Ing. Miguel Ángel Sánchez', cargo: 'Jefe de Mantenimiento', celular: '+57 307 3344556', correo: 'ma.sanchez@energiaelectrica.com.co', esPrincipal: true, createdAt: '2020-03-10T08:00:00Z' },

  // Farma Salud
  { id: 22, clienteId: 11, nombre: 'Dra. Claudia Esperanza Vega', cargo: 'Directora Técnica', celular: '+57 308 4455667', correo: 'ce.vega@farmasalud.com', esPrincipal: true, createdAt: '2021-07-20T09:00:00Z' },
  { id: 23, clienteId: 11, nombre: 'Juan Sebastián Ospina', cargo: 'Jefe de Producción', celular: '+57 309 5566778', correo: 'js.ospina@farmasalud.com', esPrincipal: false, createdAt: '2022-01-15T11:00:00Z' },

  // Industrias del Norte
  { id: 24, clienteId: 12, nombre: 'Ing. Roberto Bautista', cargo: 'Gerente de Planta', celular: '+57 310 6677889', correo: 'r.bautista@indnorte.com', esPrincipal: true, createdAt: '2023-01-10T10:00:00Z' },

  // Centro de Calibraciones Técnicas
  { id: 25, clienteId: 13, nombre: 'Ing. Carlos Mendoza', cargo: 'Director Técnico', celular: '+57 315 7788990', correo: 'c.mendoza@cctecnicos.com', esPrincipal: true, createdAt: '2022-08-15T09:00:00Z' },
  { id: 26, clienteId: 13, nombre: 'Dra. Sandra Milena Ríos', cargo: 'Jefa de Calibraciones', celular: '+57 316 8899001', correo: 'sm.rios@cctecnicos.com', esPrincipal: false, createdAt: '2022-08-15T09:00:00Z' },
  { id: 27, clienteId: 13, nombre: 'Andrés Felipe Moreno', cargo: 'Coordinador de Metrología', celular: '+57 317 9900112', correo: 'af.moreno@cctecnicos.com', esPrincipal: false, createdAt: '2023-05-10T14:00:00Z' },
  { id: 28, clienteId: 13, nombre: 'Laura Camila Sánchez', cargo: 'Asistente de Calidad', celular: '+57 318 0011223', correo: 'lc.sanchez@cctecnicos.com', esPrincipal: false, createdAt: '2024-01-20T10:00:00Z' },

  // Organismo de Certificación Colombia
  { id: 29, clienteId: 14, nombre: 'Ing. Fernando Castaño', cargo: 'Director de Certificaciones', celular: '+57 320 1122334', correo: 'f.castano@occolombia.com', esPrincipal: true, createdAt: '2021-05-10T08:00:00Z' },
  { id: 30, clienteId: 14, nombre: 'María Alejandra Gómez', cargo: 'Jefa de Auditorías', celular: '+57 321 2233445', correo: 'ma.gomez@occolombia.com', esPrincipal: false, createdAt: '2021-08-15T10:00:00Z' },
  { id: 31, clienteId: 14, nombre: 'Carlos Alberto Ríos', cargo: 'Auditor Líder', celular: '+57 322 3344556', correo: 'ca.rios@occolombia.com', esPrincipal: false, createdAt: '2022-03-20T14:00:00Z' },

  // Laboratorios Unidos del Caribe
  { id: 32, clienteId: 15, nombre: 'Ing. Pedro Jiménez', cargo: 'Director del Laboratorio', celular: '+57 323 4455667', correo: 'p.jimenez@labscaribe.com', esPrincipal: true, createdAt: '2020-09-01T09:00:00Z' },
  { id: 33, clienteId: 15, nombre: 'Dra. Ana Lucía Díaz', cargo: 'Jefa de Ensayos Químicos', celular: '+57 324 5566778', correo: 'al.diaz@labscaribe.com', esPrincipal: false, createdAt: '2020-09-01T09:00:00Z' },
  { id: 34, clienteId: 15, nombre: 'Ing. Jorge Luis Martínez', cargo: 'Coordinador de Ensayos Mecánicos', celular: '+57 325 6677889', correo: 'jl.martinez@labscaribe.com', esPrincipal: false, createdAt: '2021-06-10T11:00:00Z' },
  { id: 35, clienteId: 15, nombre: 'María Fernanda López', cargo: 'Asistente de Calidad', celular: '+57 326 7788990', correo: 'mf.lopez@labscaribe.com', esPrincipal: false, createdAt: '2022-01-15T08:00:00Z' },
  { id: 36, clienteId: 15, nombre: 'Roberto Carlos Pérez', cargo: 'Técnico de Laboratorio', celular: '+57 327 8899001', correo: 'rc.perez@labscaribe.com', esPrincipal: false, createdAt: '2023-04-20T10:00:00Z' },

  // Consultora Ambiental Verde
  { id: 37, clienteId: 16, nombre: 'Ing. Ambiental Diana Torres', cargo: 'Directora de Proyectos', celular: '+57 328 9900112', correo: 'd.torres@consultoraverde.com', esPrincipal: true, createdAt: '2023-03-15T10:00:00Z' },
  { id: 38, clienteId: 16, nombre: 'Ing. Juan Sebastián Roldán', cargo: 'Consultor Ambiental', celular: '+57 329 0011223', correo: 'js.roldan@consultoraverde.com', esPrincipal: false, createdAt: '2023-06-20T14:00:00Z' },

  // Seguridad Industrial Protección
  { id: 39, clienteId: 17, nombre: 'Ing. Ricardo Álvarez', cargo: 'Director de Seguridad', celular: '+57 330 1122334', correo: 'r.alvarez@proteccionindustrial.com', esPrincipal: true, createdAt: '2022-11-20T08:00:00Z' },
  { id: 40, clienteId: 17, nombre: 'Lic. Patricia Herrera', cargo: 'Jefa de Prevención de Riesgos', celular: '+57 331 2233445', correo: 'p.herrera@proteccionindustrial.com', esPrincipal: false, createdAt: '2023-02-10T09:00:00Z' },
  { id: 41, clienteId: 17, nombre: 'Ing. Andrés Felipe Gutiérrez', cargo: 'Coord. de Seguridad Industrial', celular: '+57 332 3344556', correo: 'af.gutierrez@proteccionindustrial.com', esPrincipal: false, createdAt: '2023-08-15T11:00:00Z' },

  // Instituto de Metrología Nacional
  { id: 42, clienteId: 18, nombre: 'Dr. Fernando Sánchez', cargo: 'Director General', celular: '+57 333 4455667', correo: 'f.sanchez@imn.gov.co', esPrincipal: true, createdAt: '2019-06-01T09:00:00Z' },
  { id: 43, clienteId: 18, nombre: 'Ing. Claudia Milena Rodríguez', cargo: 'Jefa de Calibraciones Eléctricas', celular: '+57 334 5566778', correo: 'cm.rodriguez@imn.gov.co', esPrincipal: false, createdAt: '2019-06-01T09:00:00Z' },
  { id: 44, clienteId: 18, nombre: 'Ing. Roberto Parra', cargo: 'Jefe de Dimensional', celular: '+57 335 6677889', correo: 'r.parra@imn.gov.co', esPrincipal: false, createdAt: '2020-03-15T10:00:00Z' },
  { id: 45, clienteId: 18, nombre: 'Dra. Laura Acosta', cargo: 'Jefa de Química', celular: '+57 336 7788990', correo: 'l.acosta@imn.gov.co', esPrincipal: false, createdAt: '2020-08-20T14:00:00Z' },
  { id: 46, clienteId: 18, nombre: 'Ing. Diego Alejandro Moreno', cargo: 'Coordinador de Metrología Legal', celular: '+57 337 8899001', correo: 'da.moreno@imn.gov.co', esPrincipal: false, createdAt: '2021-05-10T08:00:00Z' },
  { id: 47, clienteId: 18, nombre: 'Ing. Sandra Milena Castro', cargo: 'Asistente de Calidad', celular: '+57 338 9900112', correo: 'sm.castro@imn.gov.co', esPrincipal: false, createdAt: '2022-01-15T09:00:00Z' },

  // Centro de Investigación y Desarrollo Tecnológico
  { id: 48, clienteId: 19, nombre: 'Dr. Alejandro restrepo', cargo: 'Director de Investigación', celular: '+57 339 1122334', correo: 'a.restrepo@cidtech.com', esPrincipal: true, createdAt: '2021-03-10T09:00:00Z' },
  { id: 49, clienteId: 19, nombre: 'Ing. Claudia Elena Martínez', cargo: 'Jefa de Proyectos I+D', celular: '+57 340 2233445', correo: 'ce.martinez@cidtech.com', esPrincipal: false, createdAt: '2021-06-15T10:00:00Z' },
  { id: 50, clienteId: 19, nombre: 'Ing. Juan Camilo Álvarez', cargo: 'Líder de Desarrollo Tecnológico', celular: '+57 341 3344556', correo: 'jc.alvarez@cidtech.com', esPrincipal: false, createdAt: '2022-02-20T14:00:00Z' },
  { id: 51, clienteId: 19, nombre: 'María Alejandra Giraldo', cargo: 'Coordinadora de Calidad', celular: '+57 342 4455667', correo: 'ma.giraldo@cidtech.com', esPrincipal: false, createdAt: '2023-01-10T08:00:00Z' },
]
