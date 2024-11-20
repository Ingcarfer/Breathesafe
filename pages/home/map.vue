<script>
import { useAirQualityStore } from "~/stores/airQuality";
import { useRuntimeConfig } from '#app';

export default {
  data() {
    return {
      coordinates: null, // Coordenadas del clic
      airQuality: null, // Calidad del aire en las coordenadas
      generalAirQuality: null, // Calidad del aire general
      generalAirQualityData: { aqi: "", humidity: "", temperature: "" }, // Datos generales
      userInteracted: false, // Bandera para saber si el usuario ha interactuado
      isLoadingGeneralAirQuality: true, // Estado de carga para calidad general
    };
  },
  mounted() {
    const airQualityStore = useAirQualityStore();

    // Watch para los datos del store
    this.$watch(
      () => airQualityStore.localities,
      (newLocalities) => {
        if (newLocalities.length > 0) {
          this.generalAirQuality = airQualityStore.overallAirQuality;
          this.generalAirQualityData = newLocalities[0];
          this.isLoadingGeneralAirQuality = false; // Datos cargados
        }
      },
      { immediate: true } // Ejecutar al montar
    );

    // Cargar el script de Google Maps dinámicamente
    const config = useRuntimeConfig();
    const script = document.createElement("script");

    script.src = config.public.mapUrl;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const bogotaBounds = {
        north: 5.0,
        south: 4.3,
        west: -74.5,
        east: -73.8,
      };

      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.711, lng: -74.0721 },
        zoom: 12,
        mapTypeControl: false, // Ocultar control de tipo de mapa
        streetViewControl: false, // Ocultar Street View
        restriction: {
          latLngBounds: bogotaBounds,
          strictBounds: true, // Limitar estrictamente el área
        },
      });

      let marker = null;

      map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        // Guardar las coordenadas
        this.coordinates = { lat, lng };
        this.userInteracted = true;

        // Mostrar marcador en el clic
        if (marker) marker.setMap(null); // Eliminar marcador previo
        marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Estilo de gota invertida
            scaledSize: new google.maps.Size(40, 40), // Tamaño ajustado
          },
        });

        this.getAirQuality(lat, lng);
      });
    };

    document.head.appendChild(script);
  },
  methods: {
    async getAirQuality(lat, lng) {
      const config = useRuntimeConfig();
      try {
        const url = `${config.public.apiUrl}/nearest-sensor-data/${lat}/${lng}`;
        const response = await fetch(url);

        const data = await response.json();

        if (data && data.aqi !== undefined && data.humidity !== undefined) {
          this.airQuality = {
            aqi: data.aqi,
            humidity: data.humidity,
            temperature: data.temperature,
            locality_name: data.locality_name,
            distance: data.distance,
          };
        } else {
          this.airQuality = null;
        }
      } catch (error) {
        this.airQuality = null;
        console.error(error);
      }

    },

    getAirQualityDescription(aqi) {
      if (aqi === null || aqi === 0 || aqi === '-') return ''; // No mostrar descripción si no hay datos válidos
      if (aqi <= 50) return 'Buena';
      if (aqi <= 100) return 'Moderada';
      if (aqi <= 150) return 'Dañina para grupos sensibles';
      if (aqi <= 200) return 'dañina';
      if (aqi <= 300) return 'Muy dañina';
      return 'Peligrosa';
    },

  },
};
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
/* Contenedor que usa flexbox para alinear los elementos */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* Mapa y su estilo */
.map {
  flex: 1;
  margin-right: 20px;
}

/* Estilo para la tarjeta de información */
.locality-card {
  flex: 1;
  margin-top: 80px;
  /* Añadir margen superior para moverla hacia abajo */
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
