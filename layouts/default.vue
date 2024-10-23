<script>
import Navbar from '~/components/Navbar/Navbar.vue';

export default {
  components: {
    // Registro del componente Navbar para su uso en este componente
    Navbar,
  }
};
</script>
<template>
  <!-- Contenedor principal que abarca toda la pantalla -->
  <div class="bg-main min-h-screen">

    <!-- Componente de navegación que se renderiza en la parte superior -->
    <Navbar class="fixed top-0 left-0 right-0 z-10" />

    <main class="mt-[60px]">
      <!-- Slot para renderizar contenido dinámico en el componente -->
      <slot></slot>
    </main>

  </div>
</template>
