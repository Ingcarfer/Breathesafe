<script setup>
import RegisterForm from '@/components/Form/RegisterForm.vue';

// Definir el layout para esta página, utilizando 'lindex' como diseño
definePageMeta({
  layout: 'lindex',
});
useHead({
  title: "Register",
});
</script>

<template>
  <!-- Contenedor principal con padding y flex para centrar el formulario de registro -->
  <div class="px-10 flex flex-1 justify-center py-5">
    <!-- Componente del formulario de registro -->
    <RegisterForm />
  </div>
</template>
