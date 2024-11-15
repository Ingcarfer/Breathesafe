<script>
import { computed } from 'vue';
import LocationCard from './LocationCard.vue';

export default {
  components: {
    LocationCard,
  },
  props: {
    localities: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    // Computed para verificar si todavía se están cargando los datos
    const isLoading = computed(() => props.localities.length === 0);

    // Calcular el número de cuadros de relleno para completar la última fila
    const fillerCount = computed(() => {
      const remainder = props.localities.length % 3;
      return remainder === 0 ? 0 : 3 - remainder;
    });

    return {
      isLoading,
      fillerCount,
    };
  },
};
</script>

<template>
  <!-- Mostrar mensaje de cargando datos solo si no hay datos disponibles -->
  <div v-if="isLoading" class="loading-container">
    <div class="loader"></div>
    <span class="loading-text">Cargando datos, por favor espere...</span>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Mostrar tarjetas de localidades -->
    <LocationCard v-for="locality in localities" :key="locality.name" :locality="locality" />

    <!-- Agregar cuadros de aviso de uso para completar la fila -->
    <div v-for="n in fillerCount" :key="'filler' + n"
      class="notice-container bg-main locality-card bg-white shadow-md rounded-lg p-4 group">
      <i class="bi bi-info-circle text-info" style="font-size: 1.5rem;"></i>
      <div class="text-xl font-bold mb-2 text-center text-black">Aviso de uso</div>
      <!-- Mensaje de aviso que aparece al pasar el mouse -->
      <p class="notice-text opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black">
        Todos los datos relacionados con la calidad del aire no han sido validados en el momento de su publicación.
        Debido a los procesos de garantía de calidad, esta información puede ser modificada sin previo aviso en
        cualquier momento.
        <br>
        <br>
        Tanto el proyecto <Strong>World Air Quality Index</Strong> como <Strong>BreatheSafe.site</Strong> han tomado
        todas las medidas razonables y ejercido la diligencia necesaria para compilar el contenido presentado.
        <br>
        <br>
        Sin
        embargo, en ningún caso, <Strong>World Air Quality Index</Strong>, <Strong>BreatheSafe.site</Strong> o su equipo
        serán responsables, ya sea por contrato, negligencia o de otra forma, de cualquier pérdida, daño o lesión que
        pueda surgir directa o indirectamente como resultado del uso de esta información.
      </p>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 25vh;
  color: #4B5563;
  font-family: 'Arial', sans-serif;
}

.loader {
  border: 8px solid #f3f4f6;
  border-top: 8px solid #1a202c;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a202c;
  text-align: center;
  animation: fadeIn 2s ease-in-out;
}

/* Estilos para el aviso de uso */
.notice-container {
  position: relative;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  color: #4B5563;
  font-family: 'Arial', sans-serif;
  text-align: center;
}

.notice-text {
  font-size: 0.9rem;
  line-height: 1.4;
  color: #4B5563;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 0.3s ease-in-out, max-height 0.3s ease-in-out;
}

.group:hover .notice-text {
  opacity: 1;
  max-height: 500px;
  /* Altura suficiente para mostrar el contenido */
}

.text-black {
  color: #000;
}

.text-info {
  color: #17a2b8 !important;
  /* Azul claro */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
