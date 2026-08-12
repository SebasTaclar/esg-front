<template>
  <div class="placeholder-view">
    <div class="placeholder-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    </div>
    <h2>Seguimientos</h2>
    <p>Módulo en construcción. Aquí podrás gestionar todos los seguimientos de proyectos.</p>
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
