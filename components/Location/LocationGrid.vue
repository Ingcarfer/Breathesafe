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

    return {
      isLoading,
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
    <LocationCard v-for="locality in localities" :key="locality.name" :locality="locality" />
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
