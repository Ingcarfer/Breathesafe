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
  <!-- Contenedor principal con padding y flex para centrar el contenido -->
  <div class="px-10 flex flex-1 justify-center py-5">
    <!-- Botones para cambiar entre los componentes -->
    <div class="flex space-x-4">
      <button @click="activeTab = 'user'"
        :class="{ 'button': activeTab === 'user', 'bg-gray-200': activeTab !== 'user' }" class="px-4 py-2 rounded-md">
        Usuario
      </button>
      <button @click="activeTab = 'sensor'"
        :class="{ 'button': activeTab === 'sensor', 'bg-gray-200': activeTab !== 'sensor' }"
        class="px-4 py-2 rounded-md">
        Sensor

      </button>
    </div>
  </div>

  <!-- Condicional para mostrar el componente seleccionado -->
  <div class="px-10 flex flex-1 justify-center py-5">
    <User v-if="activeTab === 'user'" />
    <Sensor v-if="activeTab === 'sensor'" />
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

.button {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  font-size: var(--button-font-size);
  padding: var(--button-padding-y) var(--button-padding-x);
  border: 2px solid var(--button-border-color);
  /* Agregar el borde del botón */
  border-radius: var(--button-border-radius);
  transition: background-color var(--button-transition),
    border-color var(--button-transition);
  /* Añadir transición para el color del borde */
}

.button:hover {
  background-color: var(--button-bg-hover);
  /* Cambia al verde al hacer hover */
}

.button:active {
  background-color: var(--button-bg-active);
  /* Cambia a un verde más intenso al presionar */
}

/* Cambiar el color del borde al hacer hover */
.button:hover {
  border-color: #357abd;
  /* Cambia el color del borde al hacer hover */
}
</style>
