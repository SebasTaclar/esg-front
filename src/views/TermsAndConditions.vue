<template>
  <div class="terms-page">
    <div class="terms-shell">
      <header class="terms-header">
        <button class="back-button" @click="goBack">
          <span class="icon" aria-hidden="true">←</span>
          {{ t('terms.back') }}
        </button>

        <div class="header-text">
          <h1 class="title">{{ t('terms.title') }}</h1>
          <p class="last-update">
            {{ t('terms.updated') }}: <span class="updated-date">{{ formattedLastUpdated }}</span>
          </p>
        </div>
      </header>

      <main class="terms-content">
        <section v-for="(section, idx) in sections" :key="idx" class="terms-section">
          <h2 class="section-title">{{ section.title }}</h2>

          <p v-for="(p, i) in section.paragraphs" :key="i" class="paragraph">
            {{ p }}
          </p>

          <ul v-if="section.bullets && section.bullets.length" class="bullets">
            <li v-for="(b, i) in section.bullets" :key="i">{{ b }}</li>
          </ul>
        </section>

        <section class="contact-section">
          <div class="contact-card">
            <h2 class="section-title">{{ t('termsPage.contactTitle') }}</h2>
            <p class="paragraph">{{ t('termsPage.contactSubtitle') }}</p>

            <div class="contact-actions">
              <a class="ig-link" :href="instagramUrl" target="_blank" rel="noopener noreferrer">
                <span class="ig-dot" aria-hidden="true"></span>
                {{ t('social.instagramLabel') }}: @{{ instagramHandle }}
              </a>
            </div>

            <div class="pickup-card">
              <h3 class="pickup-title">{{ t('termsPage.pickupTitle') }}</h3>
              <p class="pickup-line location-name">{{ t('store.pickup.title') }}</p>
              <p class="pickup-line">{{ t('store.pickup.addressLine') }}</p>
              <h4 class="pickup-hours-title">{{ t('store.pickup.hoursTitle') }}</h4>
              <p class="pickup-line">{{ t('store.pickup.hours.weekday') }}</p>
              <p class="pickup-line">{{ t('store.pickup.hours.saturday') }}</p>
              <p class="pickup-line">{{ t('store.pickup.hours.sunday') }}</p>
            </div>
          </div>
        </section>

        <div class="acceptance">
          <button class="btn-accept" @click="acceptAndGoBack">
            {{ t('terms.accept') }}
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { SOCIALS } from '@/config/brand'

type TermsSection = {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

const router = useRouter()
const { t, tm, locale } = useI18n()

const instagramUrl = SOCIALS.instagramUrl
const instagramHandle = SOCIALS.instagramHandle

const LAST_UPDATED_ISO = '2025-12-13'

const formattedLastUpdated = computed(() => {
  const date = new Date(`${LAST_UPDATED_ISO}T00:00:00`)
  const localeTag = locale.value === 'en' ? 'en-US' : 'es-CO'
  return new Intl.DateTimeFormat(localeTag, { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
})

const sections = computed<TermsSection[]>(() => {
  const raw = tm('termsPage.sections') as unknown
  return Array.isArray(raw) ? (raw as TermsSection[]) : []
})

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/')
}

const acceptAndGoBack = () => {
  sessionStorage.setItem('termsAccepted', 'true')
  router.push('/checkout')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

.terms-page {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(201, 168, 89, 0.12), transparent 55%),
    linear-gradient(180deg, #071e25 0%, #081f2a 70%, #061318 100%);
  padding: 5.25rem 1rem 3rem;
}

.terms-shell {
  max-width: 980px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(201, 168, 89, 0.18);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(16px);
}

.terms-header {
  position: relative;
  padding: 2.25rem 2rem 1.75rem;
  border-bottom: 1px solid rgba(201, 168, 89, 0.12);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.back-button {
  background: rgba(201, 168, 89, 0.1);
  border: 1px solid rgba(201, 168, 89, 0.28);
  color: rgb(201, 168, 89);
  padding: 0.6rem 0.95rem;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.95rem;
  font-weight: 700;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  flex-shrink: 0;
}

.back-button:hover {
  background: rgba(201, 168, 89, 0.16);
  border-color: rgba(201, 168, 89, 0.45);
  transform: translateY(-1px);
}

.icon {
  font-size: 1.1rem;
}

.header-text {
  flex: 1;
  text-align: center;
}

.title {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 2.1rem;
  letter-spacing: 0.2px;
  color: rgba(246, 245, 241, 0.98);
}

.last-update {
  margin: 0.6rem 0 0;
  color: rgba(246, 245, 241, 0.78);
  font-size: 0.95rem;
}

.updated-date {
  color: rgba(246, 245, 241, 0.9);
  font-weight: 600;
}

.terms-content {
  padding: 2rem;
}

.terms-section {
  padding: 1.4rem 0;
  border-bottom: 1px solid rgba(201, 168, 89, 0.08);
}

.terms-section:last-of-type {
  border-bottom: none;
}

.section-title {
  margin: 0 0 0.9rem;
  color: rgb(201, 168, 89);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-weight: 800;
  letter-spacing: 0.2px;
  font-size: 1.25rem;
}

.paragraph {
  margin: 0.7rem 0;
  color: rgba(246, 245, 241, 0.84);
  line-height: 1.75;
}

.bullets {
  margin: 0.75rem 0 0.25rem;
  padding-left: 1.25rem;
  color: rgba(246, 245, 241, 0.84);
}

.bullets li {
  margin: 0.45rem 0;
  line-height: 1.7;
}

.contact-section {
  padding: 1.75rem 0 0.5rem;
}

.contact-card {
  background: rgba(201, 168, 89, 0.06);
  border: 1px solid rgba(201, 168, 89, 0.22);
  border-radius: 16px;
  padding: 1.5rem;
}

.contact-actions {
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
}

.ig-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: rgba(246, 245, 241, 0.92);
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s ease, text-shadow 0.2s ease;
}

.ig-link:hover {
  transform: translateY(-1px);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
}

.ig-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: rgb(201, 168, 89);
  box-shadow: 0 0 0 4px rgba(201, 168, 89, 0.15);
  flex-shrink: 0;
}

.pickup-card {
  margin-top: 1.25rem;
  background: rgba(6, 19, 24, 0.35);
  border: 1px solid rgba(201, 168, 89, 0.12);
  border-radius: 14px;
  padding: 1.25rem;
}

.pickup-title {
  margin: 0 0 0.75rem;
  color: rgba(246, 245, 241, 0.96);
  font-size: 1.05rem;
  font-weight: 800;
}

.pickup-hours-title {
  margin: 1rem 0 0.6rem;
  color: rgba(246, 245, 241, 0.9);
  font-size: 0.98rem;
  font-weight: 800;
}

.pickup-line {
  margin: 0.5rem 0;
  color: rgba(246, 245, 241, 0.84);
  line-height: 1.7;
}

.location-name {
  color: rgb(201, 168, 89);
  font-weight: 800;
}

.acceptance {
  padding: 1.25rem 0 0.25rem;
  display: flex;
  justify-content: center;
}

.btn-accept {
  width: min(520px, 100%);
  padding: 1.1rem 1.25rem;
  background: linear-gradient(135deg, rgb(201, 168, 89) 0%, rgb(180, 145, 65) 100%);
  color: #061318;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 30px rgba(201, 168, 89, 0.18);
}

.btn-accept:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(201, 168, 89, 0.24);
}

@media (max-width: 768px) {
  .terms-page {
    padding: 4.5rem 0.75rem 2.5rem;
  }

  .terms-header {
    padding: 1.5rem 1.25rem 1.25rem;
    flex-direction: column;
    align-items: stretch;
    gap: 0.9rem;
  }

  .header-text {
    text-align: center;
  }

  .title {
    font-size: 1.65rem;
  }

  .terms-content {
    padding: 1.25rem;
  }
}

@media (max-width: 420px) {
  .back-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
