<template>
  <main class="home-main">
    <section class="section">
      <MainBanner @showRules="openRulesModal" />
    </section>

    <section id="categories" class="section">
      <CategoriesMain />
    </section>

    <section id="products" class="section">
      <FeaturedProducts />
    </section>

    <section class="section">
      <BrandsSection />
    </section>

    <section class="section">
      <WhyChooseUs />
    </section>

    <section class="section">
      <ContactSection />
    </section>

    <section class="section offset">
      <Footer_ />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import MainBanner from '@/components/MainBanner.vue'

const CategoriesMain = defineAsyncComponent(() => import('@/components/CategoriesMain.vue'))
const FeaturedProducts = defineAsyncComponent(() => import('@/components/FeaturedProducts.vue'))
const BrandsSection = defineAsyncComponent(() => import('@/components/BrandsSection.vue'))
const WhyChooseUs = defineAsyncComponent(() => import('@/components/WhyChooseUs.vue'))
const ContactSection = defineAsyncComponent(() => import('@/components/ContactSection.vue'))
const Footer_ = defineAsyncComponent(() => import('@/components/Footer_.vue'))

const showRulesModal = ref(false)

const openRulesModal = () => {
  showRulesModal.value = true
}

const closeRulesModal = () => {
  showRulesModal.value = false
}

defineOptions({
  name: 'HomeView'
})

defineExpose({
  showRulesModal,
  openRulesModal,
  closeRulesModal
})
</script>

<style scoped>
.home-main {
  padding-top: 0;
  background: #FFFFFF;
  color: #0B0B0B;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
}

.section {
  padding: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
</style>
