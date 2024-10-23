<template>
  <!-- Contenedor principal de la página -->
  <div class="bg-main min-h-screen flex justify-center items-center bg-gray-100">
    <main>
      <!-- Slot para renderizar contenido dinámico en el componente -->
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
// Script setup vacío, se puede utilizar para definir lógica adicional o importaciones en el futuro
</script>

<style scoped>
/* Estilos específicos para este componente */
</style>
