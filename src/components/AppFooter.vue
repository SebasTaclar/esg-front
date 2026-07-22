<template>
  <footer class="footer">
    <div class="footer__container">
      <!-- Top -->
      <div class="footer__top">
        <div class="footer__brand">
          <div class="footer__logo">
            <img
              src="/images/LOGO.PNG"
              alt="ESG Consulting"
              class="footer__logo-img"
            />
          </div>
          <p class="footer__brand-desc">
            Soluciones integrales en Sistemas de Gestión para empresas y laboratorios comprometidos con la excelencia.
          </p>
          <div class="footer__socials">
            <a href="https://co.linkedin.com/company/es-gesti%C3%B3n-empresarial" target="_blank" class="footer__social" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.instagram.com/es_gestion_empresarial/" target="_blank" class="footer__social" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@esg_empresarial" target="_blank" class="footer__social" aria-label="TikTok">
              <i class="fab fa-tiktok"></i>
            </a>
            <a href="https://api.whatsapp.com/send?phone=573242899188" target="_blank" class="footer__social" aria-label="WhatsApp">
              <i class="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <div class="footer__links">
          <div class="footer__col">
            <h4 class="footer__col-title">Servicios</h4>
            <ul class="footer__list">
              <li><a href="#">Consultoría</a></li>
              <li><a href="#">Auditorías</a></li>
              <li><a href="#">Gestión del SG</a></li>
              <li><a href="#">Formación</a></li>
              <li><a href="#">Gestión de proyectos</a></li>
            </ul>
          </div>

          <div class="footer__col">
            <h4 class="footer__col-title">Empresa</h4>
            <ul class="footer__list">
              <li><a href="#">Sobre nosotros</a></li>
              <li><a href="#">Metodología</a></li>
              <li><a href="#">Casos de éxito</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>

          <div class="footer__col">
            <h4 class="footer__col-title">Contacto</h4>
            <ul class="footer__list footer__list--contact">
              <li>
                <i class="fas fa-map-marker-alt"></i>
                <span>Colombia</span>
              </li>
              <li>
                <i class="fas fa-phone-alt"></i>
                <span>324 289 9188 - 318 388 6699</span>
              </li>
              <li>
                <i class="fas fa-envelope"></i>
                <span>comercial@esgestionempresarial.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="footer__divider"></div>

      <!-- Bottom -->
      <div class="footer__bottom">
        <p class="footer__copy">
          &copy; {{ currentYear }} ES GESTIÓN EMPRESARIAL. Todos los derechos reservados.
        </p>
        <p class="footer__credit">
          Desarrollado por <strong>DataOr</strong>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppFooter'
})

const currentYear = new Date().getFullYear()
</script>

<style scoped>
/* ========================================
   Footer - Premium Corporate
   ======================================== */

.footer {
  position: relative;
  width: 100%;
  background: #1A1A1A;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.footer__container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 64px clamp(24px, 5vw, 80px) 0;
}

/* ---- Top ---- */
.footer__top {
  display: grid;
  grid-template-columns: 1.2fr 2fr;
  gap: 60px;
  padding-bottom: 48px;
}

/* Brand */
.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer__logo-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 50%;
  background: rgb(255, 255, 255);
  padding: 12px;
}

.footer__brand-desc {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  color: #8A8A8A;
  line-height: 1.7;
  max-width: 280px;
}

.footer__socials {
  display: flex;
  gap: 12px;
}

.footer__social {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  color: #8A8A8A;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.footer__social:hover {
  background: #C89B2D;
  color: #FFFFFF;
  transform: translateY(-2px);
}

/* Links */
.footer__links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer__col-title {
  margin: 0 0 18px;
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 0.5px;
}

.footer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__list li a {
  font-size: 13px;
  font-weight: 400;
  color: #8A8A8A;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer__list li a:hover {
  color: #C89B2D;
}

.footer__list--contact li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer__list--contact li i {
  color: #C89B2D;
  font-size: 13px;
  width: 16px;
  text-align: center;
}

.footer__list--contact li span {
  font-size: 13px;
  color: #8A8A8A;
}

/* Divider */
.footer__divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

/* Bottom */
.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
}

.footer__copy {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #6B6B6B;
}

.footer__credit {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #8A8A8A;
}

.footer__credit strong {
  color: #8a8888;
  font-weight: 700;
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */

@media (max-width: 992px) {
  .footer__top {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer__brand-desc {
    max-width: none;
  }

  .footer__links {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .footer__container {
    padding-top: 48px;
  }

  .footer__links {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer__bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .footer__legal {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .footer__socials {
    gap: 10px;
  }

  .footer__social {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }
}
</style>
