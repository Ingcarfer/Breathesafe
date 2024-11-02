<script>
definePageMeta({
  middleware: 'auth'  // Aquí aplicas el middleware
});

import { ref, onMounted, computed } from 'vue';
import LocationGrid from '@/components/Location/LocationGrid.vue';

export default {
  components: {
    LocationGrid,
  },
  setup() {
    const config = useRuntimeConfig();
    const localities = ref([]); // Lista para almacenar las localidades

    // Función para obtener la calidad del aire desde la nueva API
    async function fetchAirQualityData() {
      try {
        const url = config.public.apiUrl + "/sensor-data";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error en la respuesta de la red: ${response.status}`);
        }

        const data = await response.json(); // Datos JSON de la API
        localities.value = data.map(item => ({
          name: item.locality_name,
          aqi: item.average_aqi,
          humidity: `${item.average_humidity}%`,
          temperature: `${item.average_temperature}°C`,
        }));
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }

    // Calcular el promedio de calidad del aire para todas las localidades
    const overallAirQuality = computed(() => {
      const validLocalities = localities.value.filter(locality => !isNaN(locality.aqi));
      if (validLocalities.length === 0) return 'Sin datos';

      const totalAQI = validLocalities.reduce((sum, locality) => sum + locality.aqi, 0);
      const averageAQI = totalAQI / validLocalities.length;

      return getAirQualityDescription(averageAQI);
    });

    // Descripción de la calidad del aire según el AQI
    function getAirQualityDescription(aqi) {
      if (aqi <= 50) return 'Buena';
      if (aqi <= 100) return 'Moderada';
      if (aqi <= 150) return 'Dañina para grupos sensibles';
      if (aqi <= 200) return 'Muy poco saludable';
      return 'Peligrosa';
    }

    onMounted(() => {
      fetchAirQualityData(); // Obtener los datos al montar el componente
    });

    return {
      localities,
      overallAirQuality,
    };
  },
};
</script>
<template>
  <div class="relative flex size-full min-h-screen flex-col bg-[#f8fbfb] group/design-root overflow-x-hidden"
    style="font-family: Manrope, 'Noto Sans', sans-serif">
    <div class="layout-container flex h-full grow flex-col">
      <div class="px-4 md:px-40 flex flex-1 justify-center py-5">
        <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div class="@container mb-4">
            <div class="@[480px]:p-4">
              <div
                class="flex min-h-[480px] flex-col bg-cover bg-center bg-no-repeat rounded-xl items-start justify-between px-4 pb-0"
                style="background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%),
                url('https://cdn.usegalileo.ai/sdxl10/3337abc3-e676-4000-815e-5c6ed94bc8b8.png');">

                <div class="flex-grow"></div>

                <div class="flex flex-col gap-1 text-left">
                  <h1
                    class="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] mt-0 mb-0">
                    Bogotá
                  </h1>
                  <h2
                    class="text-white text-sm font-bold leading-normal @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal mt-0 mb-0">
                    Calidad del aire: {{ overallAirQuality }}
                  </h2>
                </div>

                <label class="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
                  <div class="flex w-full flex-1 items-stretch rounded-xl h-full">
                  </div>
                </label>
              </div>
            </div>
          </div>
          <LocationGrid :localities="localities" />
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped></style>
