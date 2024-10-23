<template>
  <!-- Contenedor principal que ocupa toda la pantalla -->
  <div class="bg-main min-h-screen">
    <!-- Componente de navegación que se fija en la parte superior de la pantalla -->
    <NavbarIndex class="fixed top-0 left-0 right-0 z-10" />

    <!-- Contenido principal, desplazado hacia abajo para no quedar detrás de la Navbar -->
    <main class="mt-[60px]"> <!-- Ajusta este valor según la altura de tu Navbar -->
      <!-- Slot para renderizar contenido dinámico en el componente -->
      <slot></slot>
    </main>
  </div>
</template>

<script>
import NavbarIndex from '~/components/Navbar/NavbarIndex.vue';

export default {
  components: {
    // Registro del componente NavbarIndex para su uso en este componente
    NavbarIndex,
  }
};
</script>
