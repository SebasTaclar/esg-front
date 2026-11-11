import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { GREAT_VIBES_FONT_BASE64 } from './certificateFonts'

export interface CertificateBaseData {
  clientName: string
  clientNit?: string
  projectCode: string
  norm?: string
  serviceType?: string
  startDate?: string
  endDate?: string
  issueDate?: string
}

export interface CertificatePayload extends CertificateBaseData {
  scope: string
  certificateNumber: string
  participantName?: string
  participantDocumentId?: string
  activityDescription?: string
  modality?: string
  hoursIntensity?: number
  implementationDate?: string
  signatureUrl?: string
  nameImageUrl?: string
  nameImageHeightPx?: number
  signer?: string
}

function formatDateLong(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr)
    .toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase()
}

const NAME_FONT_SIZE_PX = 117
const NAME_COLOR = '#6b5316'

let mainGreatVibesReady: Promise<void> | null = null

function ensureMainGreatVibes(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve()
  if (!mainGreatVibesReady) {
    mainGreatVibesReady = (async () => {
      const styleId = 'cert-great-vibes-font'
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent =
          "@font-face { font-family: 'Great Vibes'; font-style: normal; font-weight: 400; " +
          `src: url(data:font/woff2;base64,${GREAT_VIBES_FONT_BASE64}) format('woff2'); }`
        document.head.appendChild(style)
      }
      try {
        await document.fonts.load(`${NAME_FONT_SIZE_PX}px 'Great Vibes'`)
        await document.fonts.ready
      } catch {
        /* el navegador usará la fuente de respaldo */
      }
    })()
  }
  return mainGreatVibesReady
}

async function renderNameToDataUrl(
  name: string,
): Promise<{ dataUrl: string; displayHeightPx: number } | null> {
  try {
    await ensureMainGreatVibes()
    const measureCtx = document.createElement('canvas').getContext('2d')
    if (!measureCtx) return null
    const fontSpec = `${NAME_FONT_SIZE_PX}px 'Great Vibes'`
    measureCtx.font = fontSpec
    const metrics = measureCtx.measureText(name)
    const ascent = Math.ceil(metrics.fontBoundingBoxAscent ?? NAME_FONT_SIZE_PX * 0.95)
    const descent = Math.ceil(metrics.fontBoundingBoxDescent ?? NAME_FONT_SIZE_PX * 0.35)
    const width = Math.max(10, Math.ceil(metrics.width) + NAME_FONT_SIZE_PX)
    const height = ascent + descent
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.font = fontSpec
    ctx.fillStyle = NAME_COLOR
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(name, NAME_FONT_SIZE_PX / 2, ascent)
    return { dataUrl: canvas.toDataURL('image/png'), displayHeightPx: Math.ceil(height / 2) }
  } catch {
    return null
  }
}

async function withNameImage(payload: CertificatePayload): Promise<CertificatePayload> {
  const name = (payload.participantName || '').trim() || payload.clientName
  if (!name) return payload
  const rendered = await renderNameToDataUrl(name)
  if (!rendered) return payload
  return {
    ...payload,
    nameImageUrl: rendered.dataUrl,
    nameImageHeightPx: rendered.displayHeightPx,
  }
}

const HORAS_UNIDADES = [
  '', 'UNA', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ',
  'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE', 'VEINTE',
]
const HORAS_DECENAS = ['', '', 'VEINTI', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
const HORAS_CENTENAS = [
  '', 'CIENTO', 'DOSCIENTAS', 'TRESCIENTAS', 'CUATROCIENTAS', 'QUINIENTAS',
  'SEISCIENTAS', 'SETECIENTAS', 'OCHOCIENTAS', 'NOVECIENTAS',
]

function horasEnLetras(n: number): string {
  function dosDigitos(num: number): string {
    if (num <= 20) return HORAS_UNIDADES[num]
    const d = Math.floor(num / 10)
    const u = num % 10
    if (d === 2) return u === 0 ? 'VEINTE' : 'VEINTI' + HORAS_UNIDADES[u]
    return HORAS_DECENAS[d] + (u > 0 ? ' Y ' + HORAS_UNIDADES[u] : '')
  }

  function tresDigitos(num: number): string {
    if (num === 100) return 'CIEN'
    const c = Math.floor(num / 100)
    const resto = num % 100
    return HORAS_CENTENAS[c] + (resto > 0 ? dosDigitos(resto) : '')
  }

  if (!Number.isInteger(n) || n < 1 || n > 9999) return String(n)
  if (n >= 1000) {
    const m = Math.floor(n / 1000)
    const resto = n % 1000
    const miles = m === 1 ? 'MIL' : tresDigitos(m) + ' MIL'
    return miles + (resto > 0 ? ' ' + tresDigitos(resto) : '')
  }
  return tresDigitos(n)
}

function escapeHtml(text: unknown): string {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildDateLine(payload: CertificatePayload): string {
  if (payload.startDate && payload.endDate) {
    return `REALIZADO DEL ${formatDateLong(payload.startDate)} AL ${formatDateLong(payload.endDate)}`
  }
  const date = formatDateLong(payload.issueDate || payload.endDate)
  return date ? `EL ${date}` : ''
}

export function buildCertificateHtml(payload: CertificatePayload): string {
  const dateLine = buildDateLine(payload)
  const dateHtml = dateLine
    ? '<div class="date-line">' + escapeHtml(dateLine) + '</div>'
    : ''
  const scopeText = (payload.activityDescription || '').trim() || payload.scope
  const modality = (payload.modality || '').trim()
  const hours = payload.hoursIntensity
  const horasTxt = hours && hours > 0
    ? `${horasEnLetras(hours)} (${hours}) ${hours === 1 ? 'HORA' : 'HORAS'}`
    : ''
  let svcMeta = ''
  if (modality && horasTxt) svcMeta = `MODALIDAD ${modality} CON UNA INTENSIDAD DE ${horasTxt}`
  else if (modality) svcMeta = `MODALIDAD ${modality}`
  else if (horasTxt) svcMeta = `INTENSIDAD DE ${horasTxt}`
  const svcMetaHtml = svcMeta
    ? '<div class="svc-meta-line">' + escapeHtml(svcMeta) + '</div>'
    : ''
  const implDate = (payload.implementationDate || '').trim()
  const implHtml = implDate
    ? '<div class="svc-meta-line"> ' + escapeHtml(formatDateLong(implDate)) + '</div>'
    : ''
  const displayName = (payload.participantName || '').trim() || payload.clientName
  const nameHtml = payload.nameImageUrl
    ? `<img class="name-img" src="${payload.nameImageUrl}" style="height:${payload.nameImageHeightPx ?? 60}px" alt="">`
    : '<div class="name">' + escapeHtml(displayName) + '</div>'
  const docId = (payload.participantDocumentId || '').trim()
  const docHtml = docId
    ? '<div class="doc-line">CC. No. ' + escapeHtml(docId) + '</div>'
    : ''
  const signerName = payload.signer || 'ING. EDUARDO SALCEDO'
  const signatureUrl = (payload.signatureUrl || '').trim()
  const signatureHtml = signatureUrl
    ? '<img class="signer-signature" src="' + escapeHtml(signatureUrl) + '" alt="" crossorigin="anonymous">'
    : ''
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const corquisUrl = origin + '/images/certificado-corquis.jpg'
  const fontsBase = origin + '/fonts/'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Certificado</title>
      <style>
        @font-face {
          font-family: 'Great Vibes';
          font-style: normal;
          font-weight: 400;
          src: url(data:font/woff2;base64,${GREAT_VIBES_FONT_BASE64}) format('woff2');
        }
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-weight: 400;
          src: url('${fontsBase}montserrat-400.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-weight: 500;
          src: url('${fontsBase}montserrat-500.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-weight: 600;
          src: url('${fontsBase}montserrat-600.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-weight: 700;
          src: url('${fontsBase}montserrat-700.woff2') format('woff2');
        }
        * { box-sizing: border-box; }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: #f7f3ea;
        }
        html { font-size: calc(100vw / 70); }
        body { overflow: hidden; }

        .cert {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #f7f3ea;
          font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
          color: #2b2b2b;
        }

        .corquis {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          display: block;
          z-index: 1;
          user-select: none;
          pointer-events: none;
        }

        .overlay {
          position: absolute;
          left: 8%;
          right: 8%;
          text-align: center;
          z-index: 2;
        }

        .overlay-name {
          top: 37%;
        }
        .name {
          font-family: 'Great Vibes', 'Segoe Script', 'Brush Script MT', cursive;
          font-size: 3.65rem;
          line-height: 1.1;
          color: #6b5316;
          white-space: nowrap;
        }

        .name-img {
          display: inline-block;
          max-width: 100%;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
        }

        .overlay-data {
          top: 60.2%;
        }
        .scope {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1.5rem;
          font-weight: 400;
          letter-spacing: 0.02rem;
          color: #1f1f1f;
          text-transform: uppercase;
          line-height: 1.1;
        }
        .date-line {
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.06rem;
          color: #4a4a4a;
          text-transform: uppercase;
          margin-top: 0.75rem;
          line-height: 1.1;
        }
        .svc-meta-line {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1.5rem;
          font-weight: 400;
          letter-spacing: 0.02rem;
          color: #1f1f1f;
          text-transform: uppercase;
          margin-top: 0.5rem;
          line-height: 1.4;
        }
        .doc-line {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1.45rem;
          font-weight: 600;
          letter-spacing: 0.08rem;
          color: #111;
          margin-top: 1.1rem;
        }
        .cert-number {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: rgba(90, 74, 30, 0.75);
          margin-top: 0.55rem;
        }

        .signer-name {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 1.55rem;
          text-align: center;
          font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          letter-spacing: 0.06rem;
          color: #3a3428;
          text-transform: uppercase;
          z-index: 2;
        }

        .signer-signature {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 5.9rem;
          height: 2.9rem;
          max-width: 34%;
          object-fit: contain;
          object-position: bottom center;
          z-index: 2;
          user-select: none;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="cert">
        <img class="corquis" src="${corquisUrl}" alt="">

        <div class="overlay overlay-name">
          ${nameHtml}
          ${docHtml}
        </div>

        <div class="overlay overlay-data">
          <div class="scope">${escapeHtml(scopeText)}</div>
          ${svcMetaHtml}
          ${implHtml}
          ${dateHtml}
        </div>

        ${signatureHtml}
        <div class="signer-name">${escapeHtml(signerName)}</div>
      </div>
    </body>
    </html>
  `
}

async function renderCanvasFromHtml(html: string): Promise<HTMLCanvasElement> {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.position = 'fixed'
  iframe.style.left = '-10000px'
  iframe.style.top = '0'
  iframe.style.width = '1120px'
  iframe.style.height = '796px'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  try {
    const iframeDocument = iframe.contentDocument
    if (!iframeDocument) throw new Error('No se pudo preparar el documento del certificado')
    iframeDocument.open()
    iframeDocument.write(html)
    iframeDocument.close()

    await new Promise<void>((resolve) => {
      if (iframeDocument.readyState === 'complete') {
        resolve()
        return
      }
      iframe.onload = () => resolve()
    })

    await Promise.all([
      ...Array.from(iframeDocument.images).map((image) => {
        if (image.complete) return Promise.resolve()
        return new Promise<void>((resolve) => {
          image.onload = () => resolve()
          image.onerror = () => resolve()
        })
      }),
    ])

    if (iframeDocument.fonts) {
      await Promise.race([
        Promise.all([
          iframeDocument.fonts.load("1rem 'Great Vibes'"),
          iframeDocument.fonts.load("1rem 'Montserrat'"),
        ]).catch(() => undefined),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ])
      await iframeDocument.fonts.ready
    }

    return await html2canvas(iframeDocument.body, {
      backgroundColor: '#fdfbf4',
      scale: 2,
      useCORS: true,
      onclone: (clonedDoc: Document) => {
        if (!clonedDoc.fonts) return
        return Promise.race([
          Promise.all([
            clonedDoc.fonts.load("3rem 'Great Vibes'"),
            clonedDoc.fonts.load("1rem 'Montserrat'"),
          ]).catch(() => undefined),
          new Promise((resolve) => setTimeout(resolve, 4000)),
        ]).then(() => clonedDoc.fonts?.ready)
      },
    })
  } finally {
    iframe.remove()
  }
}

function drawCanvasOnPdf(pdf: jsPDF, canvas: HTMLCanvasElement): void {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 8
  const maxWidth = pageWidth - margin * 2
  const maxHeight = pageHeight - margin * 2

  let drawWidth = maxWidth
  let drawHeight = (canvas.height * maxWidth) / canvas.width
  if (drawHeight > maxHeight) {
    drawHeight = maxHeight
    drawWidth = (canvas.width * maxHeight) / canvas.height
  }
  const x = (pageWidth - drawWidth) / 2
  const y = (pageHeight - drawHeight) / 2

  pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', x, y, drawWidth, drawHeight)
}

function sanitizeFileNamePart(text: string, maxLength: number): string {
  return String(text || '')
    .replace(/[\\/:*?"<>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
    .trim()
}

function activityFileNamePart(payload: CertificatePayload): string {
  const activity =
    (payload.activityDescription || '').trim() || (payload.scope || '').trim()
  return sanitizeFileNamePart(activity, 60) || 'Actividad'
}

export function buildCertificateFilename(payload: CertificatePayload): string {
  const activity = activityFileNamePart(payload)
  const safeName = (payload.participantName || '')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  const suffix = safeName ? ` - ${safeName}` : ''
  return `Certificado_${activity}${suffix}.pdf`
}

export async function generateCertificatePdf(payload: CertificatePayload): Promise<void> {
  const prepared = await withNameImage(payload)
  const canvas = await renderCanvasFromHtml(buildCertificateHtml(prepared))
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' })
  drawCanvasOnPdf(pdf, canvas)
  pdf.save(buildCertificateFilename(payload))
}

export async function generateCertificatesPdf(payloads: CertificatePayload[]): Promise<void> {
  if (payloads.length === 0) {
    throw new Error('No hay participantes para generar certificados')
  }
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' })
  for (let i = 0; i < payloads.length; i++) {
    const prepared = await withNameImage(payloads[i])
    const canvas = await renderCanvasFromHtml(buildCertificateHtml(prepared))
    if (i > 0) pdf.addPage()
    drawCanvasOnPdf(pdf, canvas)
  }
  const activity = activityFileNamePart(payloads[0])
  pdf.save(`Certificados_${activity}.pdf`)
}
