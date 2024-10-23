<template>
  <div>
    <!-- Mensaje de carga -->
    <div v-if="loading && showLoadingMessage" class="text-center text-gray-500">
      Cargando datos...
    </div>

    <!-- Mostrar el grid de localidades solo si no está cargando -->
    <LocationGrid v-else :localities="localities" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LocationGrid from '@/components/Location/LocationGrid.vue';

const localities = ref([]);
const loading = ref(true); // Estado de carga
const showLoadingMessage = ref(true); // Controla el mensaje de "Cargando datos..."

// Función para cargar localidades desde la API
const fetchLocalities = async () => {
  try {
    const response = await fetch(`${process.env.API_APP_BASE_URL}/localities`);
    if (!response.ok) {
      throw new Error('Error al cargar las localidades.');
    }
    localities.value = await response.json();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false; // Cambiar el estado de carga a false al finalizar
  }
};

// Configura un timeout para que el mensaje de "Cargando datos..." desaparezca después de 25 segundos
onMounted(() => {
  fetchLocalities();

  setTimeout(() => {
    showLoadingMessage.value = false; // Ocultar el mensaje después de 25 segundos
  }, 25000);
});
</script>
