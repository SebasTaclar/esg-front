import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export interface CertificatePayload {
  clientName: string
  clientNit?: string
  scope: string
  projectCode: string
  norm?: string
  serviceType?: string
  startDate?: string
  endDate?: string
  issueDate?: string
  certificateNumber: string
  signer?: string
}

function formatDateLong(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr)
    .toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase()
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
  const signerName = payload.signer || 'ING. EDUARDO SALCEDO'
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const corquisUrl = origin + '/images/certificado-corquis.jpg'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Certificado</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
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
          top: 36.8%;
        }
        .name {
          font-family: 'Great Vibes', 'Brush Script MT', cursive;
          font-size: 3.65rem;
          line-height: 1.1;
          color: #6b5316;
          white-space: nowrap;
        }

        .overlay-data {
          top: 60.2%;
        }
        .scope {
          font-size: 1.18rem;
          font-weight: 600;
          letter-spacing: 0.04rem;
          color: #2f2a1d;
          text-transform: uppercase;
          line-height: 1.45;
        }
        .date-line {
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.06rem;
          color: #4a4a4a;
          text-transform: uppercase;
          margin-top: 0.85rem;
          line-height: 1.5;
        }
        .cert-number {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: rgba(90, 74, 30, 0.75);
          margin-top: 0.75rem;
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
      </style>
    </head>
    <body>
      <div class="cert">
        <img class="corquis" src="${corquisUrl}" alt="">

        <div class="overlay overlay-name">
          <div class="name">${escapeHtml(payload.clientName)}</div>
        </div>

        <div class="overlay overlay-data">
          <div class="scope">${escapeHtml(payload.scope)}</div>
          ${dateHtml}
          <div class="cert-number">Certificado No. ${escapeHtml(payload.certificateNumber)}</div>
        </div>

        <div class="signer-name">${escapeHtml(signerName)}</div>
      </div>
    </body>
    </html>
  `
}

async function renderPdfFromHtml(html: string, filename: string): Promise<void> {
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
      iframeDocument.fonts ? iframeDocument.fonts.ready : Promise.resolve(),
    ])

    const canvas = await html2canvas(iframeDocument.body, {
      backgroundColor: '#fdfbf4',
      scale: 2,
      useCORS: true,
    })

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' })
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
    pdf.save(filename)
  } finally {
    iframe.remove()
  }
}

export function buildCertificateFilename(payload: CertificatePayload): string {
  const safeCode = String(payload.projectCode ?? 'SIN-CODIGO').replace(/[^a-zA-Z0-9-_]/g, '_')
  return `Certificado_${safeCode}.pdf`
}

export async function generateCertificatePdf(payload: CertificatePayload): Promise<void> {
  const html = buildCertificateHtml(payload)
  const filename = buildCertificateFilename(payload)
  await renderPdfFromHtml(html, filename)
}
