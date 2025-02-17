import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#app';

export const useAirQualityStore = defineStore('airQuality', {
  state: () => ({
    localities: [],
  }),

  actions: {
    async fetchAirQualityData() {
      if (this.localities.length > 0) {
        // Si ya tenemos datos, no hacemos la solicitud
        return;
      }

      const config = useRuntimeConfig();
      try {
        const url = config.public.apiUrl + '/sensor-data';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error en la respuesta de la red: ${response.status}`);
        }

        const data = await response.json();

        // Filtrar datos cuyo "aqi" sea "-"
        this.localities = data
          .filter(item => item.average_aqi !== '-' && !isNaN(item.average_aqi)) // Filtrar valores inválidos
          .map(item => ({
            name: item.locality_name,
            aqi: item.average_aqi,
            humidity: `${item.average_humidity}%`,
            temperature: `${item.average_temperature}°C`,
          }));
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    },

    // Función para actualizar los datos cada 30 segundos
    startAutoUpdate() {
      if (process.client) {
        this.fetchAirQualityData(); // Primera llamada
        setInterval(() => this.fetchAirQualityData(), 30000); // Actualizar cada 30 segundos
      }
    },

    // Método para obtener la descripción de la calidad del aire
    getAirQualityDescription(aqi) {
      if (aqi === null || aqi === 0) {
        return '';
      }
     else if (aqi <= 50) {
        return 'Buena';
      } else if (aqi <= 100) {
        return 'Moderada';
      } else if (aqi <= 150) {
        return 'Dañina para grupos sensibles';
      } else if (aqi <= 200) {
        return 'Dañina';
      } else if (aqi <= 300) {
        return 'Muy dañina';
      } else {
        return 'Peligrosa';
      }
    },
  },

  getters: {
    overallAirQuality() {
      const validLocalities = this.localities.filter(locality => !isNaN(locality.aqi));
      if (validLocalities.length === 0) return 'Cargando ...';

      const totalAQI = validLocalities.reduce((sum, locality) => sum + locality.aqi, 0);
      const averageAQI = totalAQI / validLocalities.length;

      return this.getAirQualityDescription(averageAQI);
    },
  },
});
