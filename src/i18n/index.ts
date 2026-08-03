import { createI18n } from 'vue-i18n'

export type SupportedLocale = 'es' | 'en'

const STORAGE_KEY = 'esg_locale'

const messages = {
	es: {
		brand: {
			tagline: 'Sistemas de Gestión con excelencia'
		},
		nav: {
			rings: 'Anillos',
			necklaces: 'Collares',
			earings: 'Aretes',
			bracelets: 'Pulseras',
			emeralds: 'Esmeraldas',
			offers: 'Ofertas'
		},
		auth: {
			access: 'Acceder',
			adminPanel: '⚙️ Panel Admin',
			logout: 'Cerrar sesión',
			hello: 'Hola, {name}'
		},
		banner: {
			tagline: 'Implementamos soluciones prácticas y sostenibles para empresas y laboratorios',
			explore: 'VER SERVICIOS',
			learnMore: 'CONOCER MÁS',
			scrollDown: 'Desliza',
			logoAlt: 'ESG Gestión Empresarial'
		},
		visit: {
			title: 'Contáctanos',
			subtitle: 'Estamos listos para ser aliados estratégicos de su organización.',
			addressLabel: 'Dirección',
			phoneLabel: 'Teléfono',
			emailLabel: 'Correo',
			hoursLabel: 'Horarios'
		},
		footer: {
			description: 'Soluciones integrales en Sistemas de Gestión para empresas y laboratorios comprometidos con la excelencia.',
			followUs: 'Síguenos',
			quickLinks: 'Enlaces Rápidos',
			customerSupport: 'Atención al Cliente',
			madeWith: 'Soluciones en sistemas de gestión ✨',
			copyright: '© {year} ESG Gestión Empresarial. Todos los derechos reservados.',
			links: {
				products: 'Servicios',
				categories: 'Soluciones',
				testimonials: 'Testimonios',
				contact: 'Contacto',
				shippingPolicy: 'Política de Envíos',
				returns: 'Cambios y Devoluciones',
				faq: 'Preguntas Frecuentes',
				terms: 'Términos y Condiciones'
			}
		},
		whatsapp: {
			defaultMessage:
				'Hola, cordial saludo. Me interesa recibir información sobre sus servicios de consultoría ISO. ¿Podrían ayudarme?'
		},
		store: {
			pickup: {
				title: 'Edificio Víctor Melo · Local 07',
				addressLine: 'Cl. 12 #6-10 · La Candelaria, Bogotá',
				hoursTitle: 'Horarios de atención',
				hours: {
					weekday: 'Lunes a Viernes: 9:00 AM - 6:00 PM',
					saturday: 'Sábados: 9:00 AM - 2:00 PM',
					sunday: 'Domingos y festivos: Cerrado'
				}
			}
		},
		social: {
			instagramFollow: 'Síguenos en Instagram para ver más novedades',
			instagramLabel: 'Instagram'
		},
		quotation: {
			title: 'Mi Cotización',
			empty: 'No hay productos en tu cotización',
			continueExploring: 'Continuar explorando',
			sendQuote: 'Solicitar cotización',
			addToQuote: 'Agregar a cotización',
			productsSelected: '{count} productos seleccionados',
			observations: 'Observaciones',
			observationsPlaceholder: 'Ej: Tipo de certificación, empresa, cantidad de colaboradores',
			remove: 'Eliminar',
			clearAll: 'Limpiar cotización',
			yourQuote: 'Tu Cotización'
		},
		terms: {
			back: 'Volver',
			title: 'Términos y Condiciones',
			updated: 'Última actualización',
			accept: 'He leído y acepto'
		},
		termsPage: {
			sections: [
				{
					title: '1. Información general',
					paragraphs: [
						'Estos Términos y Condiciones regulan el uso del sitio web y la contratación de servicios ofrecidos por ESG Gestión Empresarial.',
						'Al navegar, registrarte o contratar nuestros servicios, aceptas estos términos. Si no estás de acuerdo, por favor no uses el sitio.',
						'Podemos actualizar estos términos cuando sea necesario. La versión vigente será la publicada en esta página.'
					]
				},
				{
					title: '2. Servicios',
					paragraphs: [
						'Ofrecemos consultoría en sistemas de gestión, implementación de normas ISO, auditorías internas y formación para organizaciones.',
						'La disponibilidad de servicios puede cambiar sin previo aviso. En caso de limitaciones, te contactaremos para ofrecer alternativas.'
					],
					bullets: [
						'Los servicios se describen con el mayor detalle posible, pero pueden tener variaciones según las necesidades de cada organización.',
						'Los tiempos de ejecución son estimados y pueden variar según la complejidad del proyecto.'
					]
				},
				{
					title: '3. Cotizaciones y pagos',
					paragraphs: [
						'Las cotizaciones se muestran en pesos colombianos (COP) e incluyen los impuestos aplicables cuando corresponda.',
						'El pago puede procesarse mediante pasarelas de pago y/o medios habilitados. La confirmación del servicio depende de la validación del pago.'
					],
					bullets: [
						'Las cotizaciones confirmadas respetan el precio mostrado al momento del pago.',
						'Podemos rechazar o anular pedidos por sospecha de fraude o inconsistencias en la información.'
					]
				},
				{
					title: '4. Entrega de resultados',
					paragraphs: [
						'Los tiempos de entrega de informes, certificados y documentación son estimados y pueden variar según la complejidad del proyecto.',
						'Para la entrega de resultados, recibirás confirmación cuando estén listos. Es posible que solicitemos identificación para la entrega.'
					],
					bullets: [
						'Revisa cuidadosamente tus datos de contacto para evitar retrasos.',
						'En caso de inconvenientes con los datos de contacto, los costos asociados pueden aplicar.'
					]
				},
				{
					title: '5. Cambios y cancelaciones',
					paragraphs: [
						'Si necesitas gestionar un cambio o cancelación, contáctanos por nuestros canales oficiales para validar el caso y los pasos a seguir.',
						'Algunos servicios pueden no ser elegibles para cancelación una vez iniciada la ejecución, salvo por incumplimiento de ESG.'
					],
					bullets: [
						'Para cambios/cancelaciones, la solicitud debe hacerse por escrito.',
						'Los costos asociados pueden variar según el estado del servicio.'
					]
				},
				{
					title: '6. Garantía',
					paragraphs: [
						'Nuestros servicios cuentan con garantía de calidad según los estándares ISO aplicables.',
						'No cubre daños por mal uso de la documentación entregada o modificaciones no autorizadas.'
					]
				},
				{
					title: '7. Datos personales',
					paragraphs: [
						'Usamos tus datos (por ejemplo, nombre, correo, dirección y teléfono) para procesar cotizaciones, coordinar entregas, soporte y comunicaciones relacionadas con nuestros servicios.',
						'No compartimos información personal con terceros salvo cuando sea necesario para la prestación del servicio o por obligación legal.'
					]
				},
				{
					title: '8. Responsabilidad y uso del sitio',
					paragraphs: [
						'No garantizamos disponibilidad ininterrumpida del sitio. Podemos realizar mantenimientos o ajustes técnicos.',
						'La responsabilidad máxima relacionada con un servicio no excederá el valor efectivamente pagado, salvo donde la ley indique lo contrario.'
					]
				}
			],
			contactTitle: 'Contacto',
			contactSubtitle: 'Si tienes preguntas sobre nuestros servicios, contáctanos por nuestros canales oficiales.',
			pickupTitle: 'Oficinas'
		},
		videos: {
			title: 'Videos',
			subtitle: 'Mira algunos de nuestros proyectos',
			viewOnTikTok: 'Ver en TikTok',
			clickToLoad: 'Click para cargar videos'
		}
	},
	en: {
		brand: {
			tagline: 'Management Systems with excellence'
		},
		nav: {
			rings: 'Rings',
			necklaces: 'Necklaces',
			earings: 'Earrings',
			bracelets: 'Bracelets',
			emeralds: 'Emeralds',
			offers: 'Deals'
		},
		auth: {
			access: 'Sign in',
			adminPanel: '⚙️ Admin Panel',
			logout: 'Sign out',
			hello: 'Hi, {name}'
		},
		banner: {
			tagline: 'We implement practical and sustainable solutions for companies and laboratories',
			explore: 'VIEW SERVICES',
			learnMore: 'LEARN MORE',
			scrollDown: 'Scroll',
			logoAlt: 'ESG Gestión Empresarial'
		},
		visit: {
			title: 'Contact us',
			subtitle: 'We are ready to be strategic partners for your organization.',
			addressLabel: 'Address',
			phoneLabel: 'Phone',
			emailLabel: 'Email',
			hoursLabel: 'Hours'
		},
		footer: {
			description: 'Comprehensive Management Systems solutions for companies and laboratories committed to excellence.',
			followUs: 'Follow us',
			quickLinks: 'Quick Links',
			customerSupport: 'Customer Support',
			madeWith: 'Management systems solutions ✨',
			copyright: '© {year} ESG Gestión Empresarial. All rights reserved.',
			links: {
				products: 'Services',
				categories: 'Solutions',
				testimonials: 'Testimonials',
				contact: 'Contact',
				shippingPolicy: 'Shipping Policy',
				returns: 'Exchanges & Returns',
				faq: 'FAQ',
				terms: 'Terms & Conditions'
			}
		},
		whatsapp: {
			defaultMessage: 'Hello, I am interested in receiving information about your ISO consulting services. Could you help me?'
		},
		store: {
			pickup: {
				title: 'Víctor Melo Building · Store 07',
				addressLine: 'Calle 12 #6-10 · La Candelaria, Bogotá',
				hoursTitle: 'Office hours',
				hours: {
					weekday: 'Mon - Fri: 9:00 AM - 6:00 PM',
					saturday: 'Saturdays: 9:00 AM - 2:00 PM',
					sunday: 'Sundays & holidays: Closed'
				}
			}
		},
		social: {
			instagramFollow: 'Follow us on Instagram for more news',
			instagramLabel: 'Instagram'
		},
		quotation: {
			title: 'My Quote',
			empty: 'No products in your quote',
			continueExploring: 'Continue browsing',
			sendQuote: 'Request quote',
			addToQuote: 'Add to quote',
			productsSelected: '{count} products selected',
			observations: 'Notes',
			observationsPlaceholder: 'E.g: Certification type, company, number of employees',
			remove: 'Remove',
			clearAll: 'Clear quote',
			yourQuote: 'Your Quote'
		},
		terms: {
			back: 'Back',
			title: 'Terms & Conditions',
			updated: 'Last updated',
			accept: 'I have read and accept'
		},
		termsPage: {
			sections: [
				{
					title: '1. General information',
					paragraphs: [
						'These Terms & Conditions govern the use of the website and the hiring of services offered by ESG Gestión Empresarial.',
						'By browsing, signing up, or hiring our services, you agree to these terms. If you do not agree, please do not use the site.',
						'We may update these terms when needed. The current version is the one published on this page.'
					]
				},
				{
					title: '2. Services',
					paragraphs: [
						'We offer consulting in management systems, ISO standards implementation, internal audits and training for organizations.',
						'Availability of services may change without notice. If there are limitations, we will contact you to offer alternatives.'
					],
					bullets: [
						'Services are described in as much detail as possible, but may vary according to each organization\'s needs.',
						'Execution times are estimates and may vary according to project complexity.'
					]
				},
				{
					title: '3. Quotes and payments',
					paragraphs: [
						'Quotes are shown in Colombian pesos (COP) and include applicable taxes when relevant.',
						'Payment may be processed through payment gateways and/or enabled methods. Service confirmation depends on payment validation.'
					],
					bullets: [
						'Confirmed quotes keep the price displayed at the time of payment.',
						'We may reject or cancel orders due to suspected fraud or inconsistent information.'
					]
				},
				{
					title: '4. Delivery of results',
					paragraphs: [
						'Delivery times for reports, certificates and documentation are estimates and may vary according to project complexity.',
						'For result delivery, you will receive confirmation when ready. We may request identification for delivery.'
					],
					bullets: [
						'Please double-check your contact details to avoid delays.',
						'If there are issues with contact information, related costs may apply.'
					]
				},
				{
					title: '5. Changes and cancellations',
					paragraphs: [
						'If you need to manage a change or cancellation, contact us through our official channels so we can validate the case and next steps.',
						'Some services may not be eligible for cancellation once execution has begun, except in case of ESG non-compliance.'
					],
					bullets: [
						'For changes/cancellations, the request must be made in writing.',
						'Related costs may vary according to the service status.'
					]
				},
				{
					title: '6. Warranty',
					paragraphs: [
						'Our services are covered by quality warranty according to applicable ISO standards.',
						'It does not cover damage from misuse of delivered documentation or unauthorized modifications.'
					]
				},
				{
					title: '7. Personal data',
					paragraphs: [
						'We use your data (for example name, email, address and phone) to process quotes, coordinate deliveries, provide support and service-related communications.',
						'We do not share personal information with third parties except when necessary for service provision or where required by law.'
					]
				},
				{
					title: '8. Liability and site usage',
					paragraphs: [
						'We do not guarantee uninterrupted availability of the site. Maintenance or technical updates may occur.',
						'Maximum liability related to a service will not exceed the amount actually paid, unless the law provides otherwise.'
					]
				}
			],
			contactTitle: 'Contact',
			contactSubtitle: 'If you have questions about our services, contact us through our official channels.',
			pickupTitle: 'Offices'
		},
		videos: {
			title: 'Videos',
			subtitle: 'Watch some of our projects',
			viewOnTikTok: 'View on TikTok',
			clickToLoad: 'Click to load videos'
		}
	}
} as const

function normalizeLocale(input: string | null | undefined): SupportedLocale {
	if (!input) return 'es'
	const value = input.toLowerCase()
	if (value.startsWith('en')) return 'en'
	return 'es'
}

export function getInitialLocale(): SupportedLocale {
	const storedRaw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
	if (storedRaw) return normalizeLocale(storedRaw)
	const browserRaw = typeof navigator !== 'undefined' ? navigator.language : null
	return normalizeLocale(browserRaw)
}

export function persistLocale(locale: SupportedLocale) {
	localStorage.setItem(STORAGE_KEY, locale)
}

export const i18n = createI18n({
	legacy: false,
	globalInjection: true,
	locale: getInitialLocale(),
	fallbackLocale: 'es',
	messages
})
