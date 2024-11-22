<script setup>
import LoginForm from '@/components/Form/LoginForm.vue';
import { ref, onMounted } from 'vue';
// Definir el layout para esta página, que usará 'lindex' como diseño
definePageMeta({
  layout: 'lindex',
});
useHead({
  title: "Login",
});

</script>

<template>
  <!-- Contenedor principal con padding y flex para centrar el formulario de inicio de sesión -->
  <div class="px-10 flex flex-1 justify-center py-5">
    <!-- Componente del formulario de inicio de sesión -->
    <LoginForm />
  </div>
</template>
