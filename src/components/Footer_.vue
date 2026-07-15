<template>
  <footer class="modern-footer">
    <div class="footer-content">
      <div class="footer-grid">
        <!-- Brand -->
        <div class="brand-section">
          <div class="creative-logo-footer">
            <div class="logo-circle-footer">
              <img src="/images/logof.png" alt="DISEF Comercializadora Industrial" />
            </div>
            <h2 class="footer-brand-title">DISEF Comercializadora Industrial</h2>
          </div>
          <p class="footer-description">{{ $t('footer.description') }}</p>

          <p class="social-title">{{ $t('footer.followUs') }}</p>
          <div class="brand-socials">
            <a class="social-link-footer" href="https://www.facebook.com/disefcolombia/" target="_blank" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a class="social-link-footer" href="https://www.instagram.com/disefcolombia/" target="_blank" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="4" ry="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
            </a>
            <a class="social-link-footer" href="https://www.tiktok.com/@disefcolombia" target="_blank" aria-label="TikTok" title="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"/></svg>
            </a>
          </div>
        </div>

        <!-- Enlaces rápidos -->
        <div class="footer-column">
          <h3 class="column-title">{{ $t('footer.quickLinks') }}</h3>
          <ul class="footer-links">
            <li><RouterLink :to="{ path: '/', hash: '#products' }">{{ $t('footer.links.products') }}</RouterLink></li>
            <li><RouterLink :to="{ path: '/', hash: '#categories' }">{{ $t('footer.links.categories') }}</RouterLink></li>

            <li><RouterLink :to="{ path: '/', hash: '#contact' }">{{ $t('footer.links.contact') }}</RouterLink></li>
          </ul>
        </div>

        <!-- Atención al cliente -->
        <div class="footer-column">
          <h3 class="column-title">{{ $t('footer.customerSupport') }}</h3>
          <ul class="footer-links">
            <li><RouterLink to="/terms-and-conditions">{{ $t('footer.links.shippingPolicy') }}</RouterLink></li>
            <li><RouterLink to="/terms-and-conditions">{{ $t('footer.links.returns') }}</RouterLink></li>
            <li><RouterLink to="/terms-and-conditions">{{ $t('footer.links.faq') }}</RouterLink></li>
            <li><RouterLink to="/terms-and-conditions">{{ $t('footer.links.terms') }}</RouterLink></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-container">
        <p class="copyright">{{ $t('footer.copyright', { year: 2025 }) }}</p>
        <p class="made-with">{{ $t('footer.madeWith') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Footer - Black + Yellow */
.modern-footer {
  background: #0B0B0B;
  color: #f6f5f1;
  padding: 3.5rem 0 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 3.2rem;
  align-items: start;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 193, 7, 0.1);
}

/* Brand Section */
.brand-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.creative-logo-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-circle-footer {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0B0B0B;
  border: 3px solid #FFC107;
  box-shadow: 0 0 16px rgba(255, 193, 7, 0.25), inset 0 0 12px rgba(255, 193, 7, 0.1);
  flex-shrink: 0;
}

.logo-circle-footer img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.footer-brand-title {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 1.35rem;
  margin: 0;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 0.5px;
}

.footer-description {
  color: rgba(246, 245, 241, 0.85);
  max-width: 360px;
  line-height: 1.7;
  margin: 0;
  font-size: 0.95rem;
}

.social-title {
  color: #FFC107;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.3px;
}

/* Social Links */
.brand-socials {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.8rem;
  flex-wrap: wrap;
}

.brand-socials a.social-link-footer {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.1);
  border: 2px solid rgba(255, 193, 7, 0.3);
  transition: all 0.3s ease;
  text-decoration: none;
}

.brand-socials a.social-link-footer:hover {
  background: rgba(255, 193, 7, 0.2);
  border-color: #FFC107;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(255, 193, 7, 0.2);
}

.brand-socials a.social-link-footer svg {
  width: 24px;
  height: 24px;
  color: #FFC107;
  transition: color 0.3s ease;
  fill: currentColor;
}

/* Columns */
.footer-column {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.column-title {
  color: #FFC107;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-weight: 800;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  letter-spacing: 0.3px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin: 0;
  padding: 0;
}

.footer-links a {
  color: rgba(246, 245, 241, 0.9);
  text-decoration: none;
  display: block;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: #FFC107;
}

/* Contact List */
.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(246, 245, 241, 0.9);
  margin-bottom: 1.2rem;
  font-size: 0.95rem;
  padding: 0;
}

.contact-list svg {
  width: 24px;
  height: 24px;
  color: #FFC107;
  flex-shrink: 0;
  fill: currentColor;
}

.contact-list span {
  line-height: 1.4;
}

/* Footer Bottom */
.footer-bottom {
  padding: 1.5rem 0;
  background: #000000;
}

.footer-bottom .footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.copyright, .made-with {
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-size: 0.9rem;
}

.made-with {
  color: #FFC107;
}

/* Responsive Design */
@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .brand-section {
    align-items: center;
    text-align: center;
  }

  .creative-logo-footer {
    justify-content: center;
  }

  .footer-description {
    margin: 0 auto;
  }

  .brand-socials {
    justify-content: center;
  }

  .footer-column {
    align-items: center;
    text-align: center;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-links a {
    text-align: center;
  }

  .footer-bottom .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

@media (max-width: 600px) {
  .footer-content {
    padding: 0 1.5rem;
  }

  .footer-grid {
    gap: 1.5rem;
  }

  .logo-circle-footer {
    width: 56px;
    height: 56px;
    border-width: 2px;
  }

  .logo-circle-footer img {
    width: 40px;
    height: 40px;
  }

  .footer-brand-title {
    font-size: 1.15rem;
  }

  .column-title {
    font-size: 1rem;
  }

  .footer-links a,
  .contact-list li {
    font-size: 0.9rem;
  }
}
</style>

