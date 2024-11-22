<script setup>
import { ref, onMounted } from 'vue';
import { useAirQualityStore } from '@/stores/airQualityStore';
import { useRuntimeConfig } from '#app';

definePageMeta({
  middleware: 'auth', // Aplica el middleware de autenticación
});
useHead({
  title: "Map",
});

// Variables reactivas
const coordinates = ref(null);
const airQuality = ref(null);
const generalAirQuality = ref(null);
const generalAirQualityData = ref({
  aqi: "",
  humidity: "",
  temperature: "",
});
const userInteracted = ref(false);
const isLoadingGeneralAirQuality = ref(true);

// Función para obtener la calidad del aire
async function getAirQuality(lat, lng) {
  const config = useRuntimeConfig();
  try {
    const url = `${config.public.apiUrl}/nearest-sensor-data/${lat}/${lng}`;
    const response = await fetch(url);

    const data = await response.json();

    if (data && data.aqi !== undefined && data.humidity !== undefined) {
      airQuality.value = {
        aqi: data.aqi,
        humidity: data.humidity,
        temperature: data.temperature,
        locality_name: data.locality_name,
        distance: data.distance,
      };
    } else {
      airQuality.value = null;
    }
  } catch (error) {
    airQuality.value = null;
    console.error(error);
  }
}

// Función para describir la calidad del aire
function getAirQualityDescription(aqi) {
  if (aqi === null || aqi === 0 || aqi === '-') return ''; // No mostrar descripción si no hay datos válidos
  if (aqi <= 50) return 'Buena';
  if (aqi <= 100) return 'Moderada';
  if (aqi <= 150) return 'Dañina para grupos sensibles';
  if (aqi <= 200) return 'Dañina';
  if (aqi <= 300) return 'Muy dañina';
  return 'Peligrosa';
}

// Lógica para ejecutar al montar el componente
onMounted(() => {
  const airQualityStore = useAirQualityStore();
  // Código adicional que necesites en el montaje
});
</script>

<template>
  <div class="relative flex size-full min-h-[80vh] flex-container bg-[#f8fbfb] px-4 sm:px-6 lg:px-8 py-5">
    <!-- Mapa -->
    <div id="map" class="map" style="height: 380px; width: 100%; border: 2px solid #000; border-radius: 10px;"></div>

    <!-- Información de la calidad del aire -->
    <div class="bg-main locality-card bg-white shadow-md rounded-lg p-4 mt-5" style="margin-left: 20px;">
      <div v-if="isLoadingGeneralAirQuality && !coordinates">
        <!-- Spinner de carga -->
        <div class="text-center flex justify-center items-center h-full">
          <div class="loader"></div>
          <span class="loading-text">Cargando datos generales, por favor espere...</span>
        </div>
      </div>

      <div v-else-if="generalAirQuality && !coordinates">
        <!-- Datos de la calidad general -->
        <h3 class="text-center text-2xl font-bold">Calidad del Aire General (Bogotá)</h3>
        <p><strong>Calidad del aire:</strong> {{ generalAirQuality }}</p>
        <p><strong>AQI Promedio:</strong> {{ generalAirQualityData.aqi }}</p>
        <p><strong>Humedad Promedio:</strong> {{ generalAirQualityData.humidity }}%</p>
        <p><strong>Temperatura Promedio:</strong> {{ generalAirQualityData.temperature }}°C</p>
      </div>

      <div v-if="airQuality">
        <!-- Datos de calidad por coordenadas -->
        <h3 class="text-center text-2xl font-bold">Calidad del Aire en la Ubicación</h3>
        <p><strong>Calidad del aire:</strong> {{ getAirQualityDescription(airQuality.aqi) }}</p>

        <p><strong>AQI:</strong> {{ airQuality.aqi }}</p>
        <p><strong>Humedad:</strong> {{ airQuality.humidity }}%</p>
        <p><strong>Temperatura:</strong> {{ airQuality.temperature }}°C</p>
        <p><strong>Localidad:</strong> {{ airQuality.locality_name }}</p>
        <p><strong>Distancia al sensor más cercano:</strong> {{ airQuality.distance }} km</p>
      </div>

      <div v-else-if="airQuality === null && userInteracted">
        <!-- Spinner de carga para clic -->
        <div class="text-center flex justify-center items-center h-full">
          <div class="loader"></div>
          <span class="loading-text">Cargando datos, por favor espere...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal con flexbox */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: auto;
  /* Altura automática por defecto */
}

/* Estilo del mapa */
.map {
  flex: 1;
  margin-right: 20px;
  border: 2px solid #000;
  border-radius: 10px;
  height: 380px;
  /* Altura estándar para pantallas grandes */
}

/* Estilo de la tarjeta de información */
.locality-card {
  flex: 1;
  margin-top: 80px;
  /* Margen superior en pantallas grandes */
  padding: 16px;
  /* Espaciado interno */
  border: 2px solid #000;
  border-radius: 10px;
  height: auto;
  /* Ajusta la altura según el contenido */
}

/* Contenedor del spinner centrado */
.flex.justify-center.items-center.h-full {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
}

/* Spinner */
.loader {
  border: 8px solid #f3f4f6;
  border-top: 8px solid #1a202c;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

/* Texto de carga */
.loading-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a202c;
  text-align: center;
  animation: fadeIn 2s ease-in-out;
}

/* Animaciones */
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

/* Media query para pantallas pequeñas */
@media (max-width: 640px) {
  .flex-container {
    flex-direction: column;
    /* Cambia a diseño en columna */
    align-items: stretch;
    /* Asegura que los hijos ocupen todo el ancho */
    height: 100vh;
    /* Ocupa toda la altura de la pantalla */
  }

  .locality-card {
    width: calc(100% - 40px);
    /* Reduce el ancho para dejar espacio en los bordes */
    margin: 8px auto;
    /* Espaciado entre el mapa y la tarjeta */
    padding: 6px;
    /* Reduce el padding */
    overflow-y: auto;
    /* Habilita scroll si el contenido es demasiado largo */
    background-color: #ffffff;
    /* Fondo blanco */
    height: auto;
    /* Deja que la tarjeta ajuste su altura según el contenido */
  }

  .map {
    height: 80%;
    /* Ajusta el mapa para ocupar más espacio */
    border-radius: 10px;
    /* Bordes redondeados */
    border-left: 2px solid #000;
    border-right: 2px solid #000;
  }
}
</style>
