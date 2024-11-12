<template>
  <div class="bg-main locality-card bg-white shadow-md rounded-lg p-4" @click="toggleDetails"
    @mouseover="showDetails = true" @mouseleave="showDetails = false">
    <div class="locality-name text-xl font-bold mb-2 text-center">{{ locality.name }}</div>

    <!-- "Calidad del aire" y su descripción -->
    <div class="flex items-center mb-2">
      <h3 class="mr-2">Calidad del aire:</h3>
      <div class="locality-description text-2xl font-bold" :class="aqiColorClass">
        {{ locality.aqi !== null ? getAirQualityDescription(locality.aqi) : '--' }}
      </div>
    </div>

    <div class="flex items-center mb-2">
      <h3 class="mr-2">AQI:</h3>
      <div class="locality-aqi text-3xl font-bold text-center" :class="aqiColorClass">
        {{ locality.aqi !== null ? locality.aqi : '--' }}
      </div>
    </div>

    <!-- Descripción general de la localidad -->
    <div class="locality-details text-sm" v-if="showDetails">
      <p>Humedad: {{ locality.humidity }}</p>
      <p>Temperatura: {{ locality.temperature }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    locality: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDetails: false, // Estado para controlar la visibilidad de los detalles
    };
  },
  computed: {
    aqiColorClass() {
      const aqi = this.locality.aqi;
      if (aqi === null) return 'text-gray-500';
      if (aqi <= 50) return 'text-green-500';     // Buena calidad
      if (aqi <= 100) return 'text-yellow-500';   // Moderada
      if (aqi <= 150) return 'text-orange-500';   // No saludable para grupos sensibles
      if (aqi <= 200) return 'text-red-500';      // No saludable
      if (aqi <= 300) return 'text-purple-500';   // Muy no saludable
      return 'text-brown-500';                    // Peligroso
    },
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails; // Alternar la visibilidad de los detalles
    },
    getAirQualityDescription(aqi) {
      if (aqi <= 50) return 'Buena';
      if (aqi <= 100) return 'Moderada';
      if (aqi <= 150) return 'Dañina para grupos sensibles';
      if (aqi <= 200) return 'Muy poco saludable';
      return 'Peligrosa';
    },
  },
};
</script>
