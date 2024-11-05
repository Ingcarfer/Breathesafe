<script>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  setup() {
    const config = useRuntimeConfig();
    const localities = ref([]);
    const airQualityData = ref([]); // Datos para la gráfica de AQI
    const humidityData = ref([]); // Datos para la gráfica de Humedad
    const temperatureData = ref([]); // Datos para la gráfica de Temperatura
    const labels = ref([]); // Nombres de las localidades

    async function fetchAirQualityData() {
      try {
        const url = config.public.apiUrl + "/sensor-data";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error en la respuesta de la red: ${response.status}`);
        }

        const data = await response.json();
        localities.value = data.map(item => ({
          name: item.locality_name,
          aqi: item.average_aqi,
          humidity: item.average_humidity,
          temperature: item.average_temperature,
        }));

        // Actualizar los datos para las gráficas
        airQualityData.value = localities.value.map(item => item.aqi);
        humidityData.value = localities.value.map(item => item.humidity);
        temperatureData.value = localities.value.map(item => item.temperature);
        labels.value = localities.value.map(item => item.name);

        // Inicializar las gráficas
        initializeCharts();
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }

    // Función para inicializar las gráficas
    function initializeCharts() {
      // Gráfica de Calidad del Aire
      const ctxAQI = document.getElementById('aqiChart').getContext('2d');
      new Chart(ctxAQI, {
        type: 'bar',
        data: {
          labels: labels.value,
          datasets: [
            {
              label: 'Calidad del Aire (AQI)',
              data: airQualityData.value,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Gráfica de Humedad
      const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
      new Chart(ctxHumidity, {
        type: 'line',
        data: {
          labels: labels.value,
          datasets: [
            {
              label: 'Humedad (%)',
              data: humidityData.value,
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Gráfica de Temperatura
      const ctxTemperature = document.getElementById('temperatureChart').getContext('2d');
      new Chart(ctxTemperature, {
        type: 'line',
        data: {
          labels: labels.value,
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: temperatureData.value,
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    onMounted(() => {
      fetchAirQualityData();
    });

    return {
      localities,
      airQualityData,
      humidityData,
      temperatureData,
      labels,
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
            <h1 class="text-3xl font-bold mb-4">Estadísticas de Calidad del Aire en Bogotá</h1>

            <!-- Gráfica de Calidad del Aire -->
            <div>
              <h2 class="text-xl font-bold mb-2">Calidad del Aire (AQI)</h2>
              <canvas id="aqiChart"></canvas>
            </div>

            <!-- Gráfica de Humedad -->
            <div class="mt-8">
              <h2 class="text-xl font-bold mb-2">Humedad Promedio</h2>
              <canvas id="humidityChart"></canvas>
            </div>

            <!-- Gráfica de Temperatura -->
            <div class="mt-8">
              <h2 class="text-xl font-bold mb-2">Temperatura Promedio</h2>
              <canvas id="temperatureChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="py-10 bg-[#f8fbfb] "></div>
</template>

<style scoped></style>
