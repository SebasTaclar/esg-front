<template>
  <section class="clients">
    <div class="clients__container">
      <div class="clients__header">
        <div class="clients__label">
          <span class="clients__label-line"></span>
          NUESTROS CLIENTES
          <span class="clients__label-line"></span>
        </div>
      </div>

      <div class="clients__carousel-wrapper">
        <div class="clients__carousel" ref="carouselRef" @mouseenter="paused = true" @mouseleave="paused = false">
          <div class="clients__track" :class="{ 'is-paused': paused }">
            <div
              v-for="(client, index) in duplicatedClients"
              :key="`${client.name}-${index}`"
              class="clients__item"
            >
              <img :src="client.logo" :alt="client.name" class="clients__logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({
  name: 'ClientsSection'
})

const paused = ref(false)

const clients = [
  { name: 'Vitro', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6-YiqKhVZne8PeDHdvu5Evw249CwRuynrOqggJT5U7Q&s=10' },
  { name: 'Industria CJ', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS01T_itpSTO6A7TY-DrxdEnXT9G-TygS7wIrZS5jet1g&s=10' },
  { name: 'EBM Metrology', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwtLvE4OF_VaVYHH-qAzTtUAcTWKZX9cslWfCRzQwG7A&s=10' },
  { name: 'CIDET', logo: 'https://cidet.org.co/wp-content/uploads/2023/10/cidet-logo.svg' },
  { name: 'Willow Pharma', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrwgD0U0BCescetGhmmxxoAT1cBsO2h707s_Q1s5jVcw&s=10' },
  { name: 'EMTEST S.A.S', logo: 'https://www.emtest.com.co/wp-content/uploads/2024/10/Asset-1@2x-8-400x78.png' },
  { name: 'BGreen', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9fI03uyt-khr94tBCc2lfJ-GUqVWq6W66Gzuvf8OCng&s=10' },
  { name: 'EPA', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrJWVn6LDXc0IMvbo8xIECpMYpSN1EhGktAKz-FufBMw&s' },
  { name: 'Hitachi Energy', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRruCYQuKRn0cMWvEluj3PAVlpLs-KEKSYqUfI1hqAY2O5_SpW-8qBjBvE&s=10' },
  { name: 'Mabe', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6x2r9680vWKctSXNskUUgoIrUMIo8_-hoskV-2xCSFw&s=10' },
  { name: 'SITLAB', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAsyX3KdCNdSfwWWqr4bdnJq7YLVehHopEEfytT6HjvyEmnJStKPOQNg&s' },
  { name: 'Eprodesa', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSILotyK5XQz_b2TVsvUR7FE6kPHyfNhFnJiWqeHVQoQ&s=10' },
  { name: 'Universidad del Norte', logo: 'https://radcolombia.org/web/sites/default/files/archivos/instituciones/universidad-norte/logo-uninorte.png' },
  { name: 'LuminoTest', logo: 'https://fise.co/wp-content/uploads/2020/07/logolumiaiV2.png' },
  { name: 'Zoser', logo: 'https://static.wixstatic.com/media/7afa9b_148ac2038ea64037815f22895aa771ae~mv2.png/v1/fill/w_170,h_61,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo-Zoser-1522x550.png' },
  { name: 'Gotta', logo: 'https://gottaingenieria.com/wp-content/uploads/2021/08/gotta-blue.png' },
  { name: 'Set-Gad Metrología', logo: 'https://setgad.com/wp/wp-content/uploads/2023/03/Logo-Set-y-Gad-Normal.png' },
  { name: 'SM Servimeters', logo: 'https://static.wixstatic.com/media/a73dca_7c59fb2929bd4bc5982504793f13f877~mv2_d_2083_2083_s_2.png' },
  { name: 'High Test', logo: 'https://hightestsas.com/image/logo.png' },
  { name: 'Microlab', logo: 'https://www.microlab.com.co/wp-content/uploads/logo300.svg' }
]

const duplicatedClients = computed(() => [...clients, ...clients, ...clients])
</script>

<style scoped>
.clients {
  padding: 30px 0;
  padding-top: 0px;
  background: #FAFAF8;
  overflow: hidden;
}

.clients__container {
  max-width: 100%;
  margin: 0 auto;
}

.clients__header {
  text-align: center;
  margin-bottom: 48px;
  padding: 0 clamp(16px, 4vw, 44px);
}

.clients__label {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  font-weight: 700;
  color: #C89B2D;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.clients__label-line {
  width: 40px;
  height: 2px;
  background: #C89B2D;
}

.clients__carousel-wrapper {
  width: 100%;
  overflow: hidden;
}

.clients__carousel {
  width: 100%;
  overflow: hidden;
}

.clients__track {
  display: flex;
  gap: 32px;
  animation: scroll 60s linear infinite;
  width: max-content;
}

.clients__track.is-paused {
  animation-play-state: paused;
}

.clients__item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 28px;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #F0F0F0;
  transition: all 0.3s ease;
  flex-shrink: 0;
  width: 200px;
  height: 110px;
}

.clients__item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: #E0E0E0;
}

.clients__logo {
  max-width: 150px;
  max-height: 65px;
  object-fit: contain;
  opacity: 0.85;
  transition: all 0.3s ease;
}

.clients__item:hover .clients__logo {
  opacity: 1;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-200px * 20 - 32px * 20));
  }
}

@media (max-width: 768px) {
  .clients__item {
    width: 160px;
    height: 90px;
    padding: 16px 20px;
  }

  .clients__logo {
    max-width: 120px;
    max-height: 50px;
  }

  .clients__track {
    gap: 20px;
    animation: scroll 120s linear infinite;
  }

  .clients__track.is-paused {
    animation-play-state: paused;
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-160px * 20 - 20px * 20));
    }
  }
}
</style>
