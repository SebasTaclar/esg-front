<template>
  <main class="home-main">
    <section class="section">
      <MainBanner />
    </section>
    <section class="section">
      <PurposeSection />
    </section>
    <section class="section">
      <MethodologySection />
    </section>
    <section class="section">
      <ServicesSection />
    </section>
    <section class="section">
      <WhyChooseSection />
    </section>
    <section class="section">
      <ContactSection />
    </section>
  </main>
</template>

<script setup lang="ts">
import MainBanner from '@/components/MainBanner.vue'
import PurposeSection from '@/components/PurposeSection.vue'
import MethodologySection from '@/components/MethodologySection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import WhyChooseSection from '@/components/WhyChooseSection.vue'
import ContactSection from '@/components/ContactSection.vue'

defineOptions({
  name: 'HomeView'
})
</script>

<style scoped>
.home-main {
  padding-top: 0;
  background: #FAFAFA;
  color: #1A1A1A;
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
