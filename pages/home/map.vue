<script>
import { useAirQualityStore } from "~/stores/airQuality";
import { useRuntimeConfig } from '#app';

export default {
  setup() {
    definePageMeta({
      middleware: 'auth', // Aplica el middleware de autenticación
    });
    useHead({
      title: "Map",
    });
  },
  data() {
    return {
      coordinates: null, // Coordenadas del clic
      airQuality: null, // Calidad del aire en las coordenadas
      generalAirQuality: null, // Calidad del aire general
      generalAirQualityData: { aqi: "", humidity: "", temperature: "" }, // Datos generales
      userInteracted: false, // Bandera para saber si el usuario ha interactuado
      isLoadingGeneralAirQuality: true, // Estado de carga para calidad general
      map: null,
      marker: null,
      isCurrentLocation: false, // Nuevo: Indica si se está usando la ubicación actual
      locationError: false, // Nuevo: Muestra error si no se obtiene la ubicación
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

    script.src = config.public.mapUrl; // Asegúrate de que 'mapUrl' está configurado correctamente
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const bogotaBounds = {
        north: 5.0,
        south: 4.3,
        west: -74.5,
        east: -73.8,
      };

      // Inicializar el mapa
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

      // Escuchar el clic en el mapa
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

        // Obtener datos de calidad del aire
        this.getAirQuality(lat, lng);
      });
    };

    document.head.appendChild(script);
  },
  methods: {
    // Método para obtener la calidad del aire en las coordenadas
    async getAirQuality(lat, lng) {
      const config = useRuntimeConfig();
      try {
        const url = `${config.public.apiUrl}/nearest-sensor-data/${lat}/${lng}`;
        const response = await fetch(url);

        const data = await response.json();

        // Si los datos existen y son válidos
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
    getCurrentLocation() {
      this.locationError = false; // Reinicia el error de ubicación
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.handleLocationClick(latitude, longitude);
            this.map.setCenter({ lat: latitude, lng: longitude });
            this.isCurrentLocation = true;
          },
          (error) => {
            console.error("Error obteniendo ubicación: ", error.message);
            this.locationError = true; // Muestra el error de ubicación
          }
        );
      } else {
        console.error("La geolocalización no es compatible con este navegador.");
        this.locationError = true;
      }
    },
    // Descripción del estado de la calidad del aire según AQI
    getAirQualityDescription(aqi) {
      if (aqi === null || aqi === 0 || aqi === '-') return ''; // No mostrar descripción si no hay datos válidos
      if (aqi <= 50) return 'Buena';
      if (aqi <= 100) return 'Moderada';
      if (aqi <= 150) return 'Dañina para grupos sensibles';
      if (aqi <= 200) return 'Dañina';
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
    <div>

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
          <p><strong>Humedad Promedio:</strong> {{ generalAirQualityData.humidity }}</p>
          <p><strong>Temperatura Promedio:</strong> {{ generalAirQualityData.temperature }}</p>
        </div>

        <div v-if="airQuality">
          <!-- Datos de calidad por coordenadas -->
          <h3 class="text-center text-2xl font-bold">
            Calidad del Aire en
            {{ isCurrentLocation ? "su Ubicación Actual" : "la Ubicación" }}
          </h3>
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
      <div v-if="locationError" class="button-container">
        <button @click="getCurrentLocation" class="button">Ubicación actual</button>
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

.button-container {
  text-align: center;
  /* Centra el contenido dentro del contenedor */
  margin-top: 1rem;
  /* Espacio opcional entre el mensaje y el botón */
}

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
  width: auto;
  /* Ancho completo en pantallas pequeñas */
}

.button:hover {
  background-color: var(--button-bg-hover);
  border-color: #357abd;
}

.button:active {
  background-color: var(--button-bg-active);
}
</style>
