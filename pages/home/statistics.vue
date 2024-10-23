<script>
import { ref, onMounted, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
definePageMeta({
  middleware: 'auth'  // Aquí aplicas el middleware
});
export default {
  setup() {
    const localities = ref([]);
    const airQualityData = ref([]); // Datos para la gráfica de AQI
    const humidityData = ref([]); // Datos para la gráfica de Humedad
    const temperatureData = ref([]); // Datos para la gráfica de Temperatura
    const labels = ref([]); // Nombres de las localidades
    const showCharts = ref(false); // Controla la visibilidad de las gráficas
    const loadingMessage = ref(true); // Controla la visibilidad del mensaje de carga

    async function fetchAirQualityData() {
      try {
        //const response = await fetch('http://localhost:8080/api/sensor-data');
        const response = await fetch('https://api.breathesafe.site/api/sensor-data');
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
      // Ocultar las gráficas y mostrar el mensaje de carga
      setTimeout(() => {
        loadingMessage.value = false; // Ocultar mensaje de carga
        showCharts.value = true; // Mostrar gráficas
      }, 22000); // 20 segundos
    });

    return {
      localities,
      airQualityData,
      humidityData,
      temperatureData,
      labels,
      showCharts,
      loadingMessage,
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
            <h1 class="text-3xl font-bold text-center mb-4">Estadísticas de Calidad del Aire en Bogotá</h1>

            <!-- Mensaje de Cargando Gráficas -->
            <div v-if="loadingMessage" class="text-center text-lg font-semibold">Cargando gráficas...</div>

            <!-- Gráfica de Calidad del Aire -->
            <div v-if="showCharts">
              <h2 class="text-xl font-bold mb-2">Calidad del Aire (AQI)</h2>
              <canvas id="aqiChart"></canvas>
            </div>

            <!-- Gráfica de Humedad -->
            <div v-if="showCharts" class="mt-8">
              <h2 class="text-xl font-bold mb-2">Humedad Promedio</h2>
              <canvas id="humidityChart"></canvas>
            </div>

            <!-- Gráfica de Temperatura -->
            <div v-if="showCharts" class="mt-8">
              <h2 class="text-xl font-bold mb-2">Temperatura Promedio</h2>
              <canvas id="temperatureChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
