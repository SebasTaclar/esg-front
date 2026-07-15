<template>
  <section class="videos-section" ref="sectionRef">
    <div class="container">
      <header class="header">
        <h2 class="title">{{ t('videos.title') }}</h2>
        <p class="subtitle">{{ t('videos.subtitle') }}</p>
      </header>

      <div class="grid">
        <div class="video" v-for="v in videos" :key="v.id">
          <!-- Placeholder hasta que el video sea visible -->
          <div v-if="!shouldLoadVideos" class="video-placeholder" @click="loadVideosNow">
            <div class="placeholder-content">
              <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <p class="placeholder-text">{{ t('videos.clickToLoad') }}</p>
            </div>
          </div>

          <!-- Iframe directo (más estable en SPA; no depende de reinicializar scripts) -->
          <iframe
            v-else
            class="tiktok-iframe"
            :src="`https://www.tiktok.com/embed/v2/${v.id}`"
            :title="`TikTok video ${v.id}`"
            loading="lazy"
            allow="fullscreen"
            referrerpolicy="strict-origin-when-cross-origin"
          />

          <a v-if="shouldLoadVideos" class="video-link" :href="v.url" target="_blank" rel="noopener noreferrer">
            {{ t('videos.viewOnTikTok') }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

type TikTokVideo = { id: string; url: string }

const videos: TikTokVideo[] = [
  {
    id: '7564589333794098450',
    url: 'https://www.tiktok.com/@disefcolombia/video/7564589333794098450'
  },
  {
    id: '7566079307521543431',
    url: 'https://www.tiktok.com/@disefcolombia/video/7566079307521543431'
  },
  {
    id: '7528947477798505784',
    url: 'https://www.tiktok.com/@disefcolombia/video/7528947477798505784'
  }
]

const { t } = useI18n()
const sectionRef = ref<HTMLElement | null>(null)
const shouldLoadVideos = ref(false)
let observer: IntersectionObserver | null = null

/**
 * Carga los videos inmediatamente
 */
async function loadVideosNow() {
  shouldLoadVideos.value = true
  // Mantener nextTick para evitar “parpadeos” en transición
  await nextTick()
}

/**
 * Usa Intersection Observer para cargar videos cuando la sección sea visible
 */
onMounted(async () => {
  // Esperar a que el DOM esté completamente listo
  await nextTick()

  if (!sectionRef.value) {
    return
  }

  // Usar Intersection Observer para detectar cuando la sección es visible
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Si la sección es visible, cargar videos
        if (entry.isIntersecting && !shouldLoadVideos.value) {
          loadVideosNow()
        }
      })
    },
    {
      // Activar cuando al menos 10% de la sección sea visible
      threshold: 0.1,
      // Cargar antes de que llegue a la vista
      rootMargin: '100px'
    }
  )

  observer.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.videos-section {
  width: 100%;
  padding: 4.5rem 0;
  background: linear-gradient(180deg, #0a0a0a 0%, #141414 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2.25rem;
}

.title {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.96);
}

.subtitle {
  margin: 0.75rem auto 0;
  max-width: 720px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 1.5;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 1rem;
  }

  /* En celular: 3 videos en una sola fila (horizontal) con swipe */
  .grid {
    display: flex;
    flex-wrap: nowrap;
    gap: 1rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 0.75rem;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scroll-padding: 1rem;
  }

  .grid::-webkit-scrollbar {
    display: none;
  }

  .grid {
    scrollbar-width: none;
  }

  .video {
    flex: 0 0 clamp(240px, 82vw, 320px);
    scroll-snap-align: start;
  }
}

.video {
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(215, 172, 67, 0.18);
  padding: 0.75rem;
  min-height: 580px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

.tiktok-iframe {
  width: 100%;
  height: 560px;
  border: 0;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.video-link {
  display: inline-flex;
  justify-content: center;
  margin-top: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 600;
}

.video-link:hover {
  color: rgb(201, 168, 89);
}

/* Placeholder para mostrar antes de cargar videos */
.video-placeholder {
  width: 100%;
  height: 100%;
  min-height: 450px;
  background: linear-gradient(135deg, rgba(26, 58, 82, 0.2) 0%, rgba(201, 168, 89, 0.1) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.video-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.video-placeholder:hover {
  background: linear-gradient(135deg, rgba(26, 58, 82, 0.3) 0%, rgba(201, 168, 89, 0.15) 100%);
  transform: scale(1.02);
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 1;
}

.play-icon {
  width: 64px;
  height: 64px;
  color: rgba(201, 168, 89, 0.8);
  filter: drop-shadow(0 4px 12px rgba(201, 168, 89, 0.3));
  transition: all 0.3s ease;
}

.video-placeholder:hover .play-icon {
  color: rgb(201, 168, 89);
  transform: scale(1.1);
}

.placeholder-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

/* Evitar desbordes */
.video :deep(iframe) {
  width: 100% !important;
}

</style>
