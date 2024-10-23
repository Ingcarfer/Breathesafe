<template>
  <!-- Mostrar mensaje de cargando datos durante 25 segundos -->
  <div v-if="showLoadingMessage" class="text-center text-gray-500">
    Cargando datos...
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <LocationCard v-for="locality in localities" :key="locality.name" :locality="locality" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
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
  setup() {
    const showLoadingMessage = ref(true); // Control para mostrar el mensaje de carga

    onMounted(() => {
      // Mostrar el mensaje de "Cargando datos..." solo por 25 segundos
      setTimeout(() => {
        showLoadingMessage.value = false;
      }, 20000);
    });

    return {
      showLoadingMessage,
    };
  },
};
</script>
