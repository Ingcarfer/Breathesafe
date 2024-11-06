<script>
import Navbar from '~/components/Navbar/Navbar.vue';
import Footer from '~/components/Footer/Footer.vue';
</script>

<template>
  <!-- Contenedor principal con flex y min-h-screen para ubicar el footer al final -->
  <div class="bg-main min-h-screen flex flex-col">

    <!-- Navbar fijo en la parte superior -->
    <Navbar class="z-10" />

    <!-- Contenedor principal que ocupa el espacio restante -->
    <main class="flex-grow mt-[60px]">
      <slot></slot>
    </main>

    <!-- Footer al final del contenedor principal -->
    <Footer class="z-10" />
  </div>
</template>

<style scoped></style>
