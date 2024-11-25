<script setup>
import { ref, onMounted } from 'vue';
import User from '@/components/Admin/User.vue';
import Sensor from '@/components/Admin/Sensor.vue';

// Variable reactiva para gestionar la vista activa
const activeTab = ref('user');

definePageMeta({
  middleware: 'auth', // Aplica el middleware de autenticación
});

// Definir el layout para esta página
useHead({
  title: "Admin",
});
</script>

<template>
  <!-- Contenedor principal: flex-col en pantallas pequeñas -->
  <div
    class="px-5 sm:px-10 flex flex-col sm:flex-row justify-center items-center py-5 space-y-4 sm:space-y-0 sm:space-x-4">
    <!-- Botones para cambiar entre los componentes -->
    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
      <button @click="activeTab = 'user'"
        :class="{ 'button': activeTab === 'user', 'bg-gray-200': activeTab !== 'user' }"
        class="w-full sm:w-auto px-4 py-2 rounded-md text-center">
        Usuario
      </button>
      <button @click="activeTab = 'sensor'"
        :class="{ 'button': activeTab === 'sensor', 'bg-gray-200': activeTab !== 'sensor' }"
        class="w-full sm:w-auto px-4 py-2 rounded-md text-center">
        Sensor
      </button>
    </div>
  </div>

  <!-- Componente seleccionado: ajustable para pantallas pequeñas -->
  <div class="px-5 sm:px-10 flex flex-col items-center py-5 w-full">
    <User v-if="activeTab === 'user'" class="w-full sm:w-auto" />
    <Sensor v-if="activeTab === 'sensor'" class="w-full sm:w-auto" />
  </div>
</template>

<style scoped>
:root {
  --button-bg: #b4f2e5;
  /* Fondo botón igual al azul del fondo */
  --button-bg-hover: #7ee3cd;
  /* Fondo botón al hacer hover (verde del fondo) */
  --button-bg-active: #65e0c5;
  /* Fondo botón al presionar (verde más intenso) */
  --button-text-color: #000000;
  /* Color del texto */
  --button-border-color: #4a90e2;
  /* Color del borde del botón */
  --button-padding-y: 0.5rem;
  /* Padding vertical */
  --button-padding-x: 1rem;
  /* Padding horizontal */
  --button-border-radius: 0.5rem;
  /* Radio del borde */
  --button-font-size: 0.875rem;
  /* Tamaño de la fuente */
  --button-transition: 300ms ease-in-out;
  /* Duración de la transición */
}

/* Botón responsivo */
.button {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  font-size: var(--button-font-size);
  padding: var(--button-padding-y) var(--button-padding-x);
  border: 2px solid var(--button-border-color);
  border-radius: var(--button-border-radius);
  transition: background-color var(--button-transition), border-color var(--button-transition);
  width: 100%;
  /* Ancho completo en pantallas pequeñas */
}

.button:hover {
  background-color: var(--button-bg-hover);
  border-color: #357abd;
}

.button:active {
  background-color: var(--button-bg-active);
}

/* Contenedor principal */
div {
  width: 100%;
  /* Ajusta al 100% en pantallas pequeñas */
}

/* Diseño responsivo para pantallas pequeñas */
@media (min-width: 640px) {
  .button {
    width: auto;
    /* Botones se ajustan automáticamente en pantallas grandes */
  }
}
</style>
