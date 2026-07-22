import { createI18n } from 'vue-i18n'

export type SupportedLocale = 'es' | 'en'

const STORAGE_KEY = 'angelie_locale'

const messages = {
	es: {
		brand: {
			tagline: 'Elegancia y distinción'
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
			tagline: 'Donde cada pieza cuenta una historia de elegancia y distinción',
			explore: 'EXPLORAR COLECCIÓN',
			learnMore: 'CONOCER MÁS',
			scrollDown: 'Desliza',
			logoAlt: 'ESG Gestión Empresarial'
		},
		visit: {
			title: 'Visítanos',
			subtitle: 'Brilla con Angelie: ven por tu próxima joya.',
			addressLabel: 'Dirección',
			phoneLabel: 'Teléfono',
			emailLabel: 'Correo',
			hoursLabel: 'Horarios'
		},
		footer: {
			description: 'Soluciones industriales y eléctricas con calidad, seguridad y respaldo técnico.',
			followUs: 'Síguenos',
			quickLinks: 'Enlaces Rápidos',
			customerSupport: 'Atención al Cliente',
			madeWith: 'Soluciones para obra, planta y mantenimiento ✨',
			copyright: '© {year} ESG Gestión Empresarial. Todos los derechos reservados.',
			links: {
				products: 'Productos',
				categories: 'Categorías',
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
				'Hola! Me interesa conocer más sobre los productos y soluciones de ESG Gestión Empresarial. ¿Me pueden brindar más información?'
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
			observationsPlaceholder: 'Ej: Talla 10, Color amarillo, Curva C',
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
						'Estos Términos y Condiciones regulan el uso del sitio web y la compra de productos y soluciones ofrecidos por ESG Gestión Empresarial.',
						'Al navegar, registrarte o realizar una compra, aceptas estos términos. Si no estás de acuerdo, por favor no uses el sitio.',
						'Podemos actualizar estos términos cuando sea necesario. La versión vigente será la publicada en esta página.'
					]
				},
				{
					title: '2. Productos',
					paragraphs: [
						'Las piezas publicadas pueden variar en color, brillo o tonalidad por iluminación, pantalla o procesos artesanales.',
						'La disponibilidad puede cambiar sin previo aviso. En caso de falta de stock, te contactaremos para ofrecer alternativas o gestionar la devolución.'
					],
					bullets: [
						'Las fotos son de referencia y buscan representar el producto lo mejor posible.',
						'Las medidas y descripciones pueden tener variaciones mínimas.'
					]
				},
				{
					title: '3. Precios y pagos',
					paragraphs: [
						'Los precios se muestran en pesos colombianos (COP) e incluyen los impuestos aplicables cuando corresponda.',
						'El pago puede procesarse mediante pasarelas de pago (por ejemplo, Wompi) y/o medios habilitados en el checkout. La confirmación del pedido depende de la validación del pago.'
					],
					bullets: [
						'Los pedidos confirmados respetan el precio mostrado al momento del pago.',
						'Podemos rechazar o anular pedidos por sospecha de fraude o inconsistencias en la información.'
					]
				},
				{
					title: '4. Envíos y recogida en tienda',
					paragraphs: [
						'El tiempo de entrega es estimado y puede variar por ciudad, transportadora, clima o eventos de fuerza mayor.',
						'Para recogida en tienda, recibirás confirmación cuando tu pedido esté listo. Es posible que solicitemos un documento para entregar el pedido.'
					],
					bullets: [
						'Revisa cuidadosamente tus datos de contacto y dirección para evitar retrasos.',
						'En caso de devolución por dirección incorrecta o ausencia, los costos asociados pueden aplicar.'
					]
				},
				{
					title: '5. Cambios, devoluciones y retracto',
					paragraphs: [
						'Si necesitas gestionar un cambio o devolución, contáctanos por nuestros canales oficiales para validar el caso y los pasos a seguir.',
						'Por higiene, algunas categorías (por ejemplo, aretes/piercings) y productos personalizados pueden no aplicar para cambios o devoluciones, salvo por defecto de fabricación.',
						'En compras a distancia, pueden aplicar derechos como el retracto según la normativa vigente y las condiciones del producto.'
					],
					bullets: [
						'Para cambios/devoluciones, el producto debe estar sin uso y en condiciones aptas para revisión.',
						'Los costos de envío asociados pueden variar según el motivo y el resultado de la validación.'
					]
				},
				{
					title: '6. Garantía',
					paragraphs: [
						'La garantía cubre defectos de fabricación bajo condiciones normales de uso.',
						'No cubre daños por mal uso, golpes, caídas, manipulación inadecuada, contacto con químicos o desgaste normal.'
					]
				},
				{
					title: '7. Datos personales',
					paragraphs: [
						'Usamos tus datos (por ejemplo, nombre, correo, dirección y teléfono) para procesar pedidos, coordinar entregas, soporte y comunicaciones relacionadas con tu compra.',
						'No compartimos información personal con terceros salvo cuando sea necesario para el pago o la entrega (pasarela de pago, transportadora) o por obligación legal.'
					]
				},
				{
					title: '8. Responsabilidad y uso del sitio',
					paragraphs: [
						'No garantizamos disponibilidad ininterrumpida del sitio. Podemos realizar mantenimientos o ajustes técnicos.',
						'La responsabilidad máxima relacionada con una compra no excederá el valor efectivamente pagado por el producto, salvo donde la ley indique lo contrario.'
					]
				}
			],
			contactTitle: 'Contacto',
			contactSubtitle: 'Si tienes preguntas sobre tu compra, cambios o garantía, escríbenos por nuestros canales oficiales.',
			pickupTitle: 'Recoger en tienda'
		},
		videos: {
			title: 'Videos',
			subtitle: 'Mira algunos de nuestros favoritos',
			viewOnTikTok: 'Ver en TikTok',
			clickToLoad: 'Click para cargar videos'
		}
	},
	en: {
		brand: {
			tagline: 'Elegance and distinction'
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
			tagline: 'Where every piece tells a story of elegance and distinction',
			explore: 'EXPLORE COLLECTION',
			learnMore: 'LEARN MORE',
			scrollDown: 'Scroll',
			logoAlt: 'ESG Gestión Empresarial'
		},
		visit: {
			title: 'Visit us',
			subtitle: 'Shine with Angelie: come find your next jewel.',
			addressLabel: 'Address',
			phoneLabel: 'Phone',
			emailLabel: 'Email',
			hoursLabel: 'Hours'
		},
		footer: {
			description: 'Industrial and electrical solutions with quality, safety and technical support.',
			followUs: 'Follow us',
			quickLinks: 'Quick Links',
			customerSupport: 'Customer Support',
			madeWith: 'Solutions for worksites, plants and maintenance ✨',
			copyright: '© {year} ESG Gestión Empresarial. All rights reserved.',
			links: {
				products: 'Products',
				categories: 'Categories',
				testimonials: 'Testimonials',
				contact: 'Contact',
				shippingPolicy: 'Shipping Policy',
				returns: 'Exchanges & Returns',
				faq: 'FAQ',
				terms: 'Terms & Conditions'
			}
		},
		whatsapp: {
			defaultMessage: 'Hi! I would like to know more about ESG Gestión Empresarial products and solutions. Can you share more information?'
		},
		store: {
			pickup: {
				title: 'Víctor Melo Building · Store 07',
				addressLine: 'Calle 12 #6-10 · La Candelaria, Bogotá',
				hoursTitle: 'Store hours',
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
			observationsPlaceholder: 'E.g: Size 10, Yellow color, Curve C',
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
						'These Terms & Conditions govern the use of the website and the purchase of products and solutions offered by ESG Gestión Empresarial.',
						'By browsing, signing up, or placing an order, you agree to these terms. If you do not agree, please do not use the site.',
						'We may update these terms when needed. The current version is the one published on this page.'
					]
				},
				{
					title: '2. Products',
					paragraphs: [
						'Pieces may vary slightly in color, shine, or tone due to lighting, screens, or handmade processes.',
						'Availability may change without notice. If an item is out of stock, we will contact you to offer alternatives or issue a refund.'
					],
					bullets: [
						'Photos are for reference and aim to represent the item as accurately as possible.',
						'Measurements and descriptions may have minor variations.'
					]
				},
				{
					title: '3. Pricing and payments',
					paragraphs: [
						'Prices are shown in Colombian pesos (COP) and include applicable taxes when relevant.',
						'Payments may be processed through payment gateways (for example, Wompi) and/or the methods available at checkout. Order confirmation depends on payment validation.'
					],
					bullets: [
						'Confirmed orders keep the price displayed at the time of payment.',
						'We may reject or cancel orders due to suspected fraud or inconsistent information.'
					]
				},
				{
					title: '4. Shipping and store pickup',
					paragraphs: [
						'Delivery times are estimates and may vary by city, carrier, weather, or force majeure events.',
						'For store pickup, you will receive confirmation when your order is ready. We may request an ID to hand over the order.'
					],
					bullets: [
						'Please double-check your contact and address details to avoid delays.',
						'If a shipment is returned due to incorrect address or absence, related costs may apply.'
					]
				},
				{
					title: '5. Exchanges, returns and withdrawal rights',
					paragraphs: [
						'If you need an exchange or return, contact us through our official channels so we can validate the case and next steps.',
						'For hygiene reasons, some categories (for example earrings/piercings) and personalized products may not be eligible for exchanges/returns, except in case of manufacturing defects.',
						'Distance purchases may be subject to withdrawal/return rights as provided by applicable law and product conditions.'
					],
					bullets: [
						'Items must be unused and in a condition suitable for inspection.',
						'Shipping costs may vary depending on the reason and validation outcome.'
					]
				},
				{
					title: '6. Warranty',
					paragraphs: [
						'Warranty covers manufacturing defects under normal use conditions.',
						'It does not cover misuse, impacts, drops, improper handling, chemical exposure, or normal wear and tear.'
					]
				},
				{
					title: '7. Personal data',
					paragraphs: [
						'We use your data (for example name, email, address and phone) to process orders, coordinate deliveries, provide support and purchase-related communications.',
						'We do not share personal information with third parties except when necessary for payment or delivery (payment gateway, carrier) or where required by law.'
					]
				},
				{
					title: '8. Liability and site usage',
					paragraphs: [
						'We do not guarantee uninterrupted availability of the site. Maintenance or technical updates may occur.',
						'Maximum liability related to a purchase will not exceed the amount actually paid for the product, unless the law provides otherwise.'
					]
				}
			],
			contactTitle: 'Contact',
			contactSubtitle: 'If you have questions about your purchase, exchanges or warranty, contact us through our official channels.',
			pickupTitle: 'Store pickup'
		},
		videos: {
			title: 'Videos',
			subtitle: 'Watch some of our favorites',
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
