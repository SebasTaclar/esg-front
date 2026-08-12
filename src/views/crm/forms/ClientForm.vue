<template>
  <div class="placeholder-view">
    <div class="placeholder-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </div>
    <h2>Formulario de Cliente</h2>
    <p>Formulario para crear o editar clientes.</p>
  </div>
</template>

<style scoped>
.placeholder-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
}
.placeholder-icon { color: var(--c-gray-light); margin-bottom: 16px; }
h2 { font-size: 1.2rem; font-weight: 700; color: var(--c-black); margin-bottom: 8px; }
p { font-size: 0.88rem; color: var(--c-gray); }
</style>
