<script setup>
definePageMeta({
  middleware: 'auth', // Aplica el middleware de autenticación
});

useHead({
  title: "Statistics",
});

import { onMounted, nextTick, ref } from 'vue';
import { useAirQualityStore } from '@/stores/airQuality';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const airQualityStore = useAirQualityStore();
const labels = ref([]);
const airQualityData = ref([]);
const humidityData = ref([]);
const temperatureData = ref([]);
const aqiColors = ref([]); // Array para los colores dinámicos

let airQualityChart = null;
let humidityChart = null;
let temperatureChart = null;

onMounted(async () => {
  await airQualityStore.fetchAirQualityData();
  nextTick(() => {
    updateChartData();
    initializeCharts();
  });
});

function getAQIColor(aqi) {
  if (aqi <= 50) return 'rgba(0, 255, 0, 0.6)'; // Verde para "buena" calidad de aire
  if (aqi <= 100) return 'rgba(255, 255, 0, 0.6)'; // Amarillo para "moderada"
  if (aqi <= 150) return 'rgba(255, 165, 0, 0.6)'; // Naranja para "no saludable para grupos sensibles"
  if (aqi <= 200) return 'rgba(255, 0, 0, 0.6)'; // Rojo para "no saludable"
  if (aqi <= 300) return 'rgba(153, 50, 204, 0.6)'; // Púrpura para "muy no saludable"
  return 'rgba(128, 0, 0, 0.6)'; // Marrón para "peligroso"
}

function updateChartData() {
  // Filtra las localidades cuyo AQI no sea igual a 0
  const localities = airQualityStore.localities.filter(item => item.aqi !== 0);

  // Actualiza los datos de las gráficas solo con las localidades filtradas
  labels.value = localities.map(item => item.name);
  airQualityData.value = localities.map(item => item.aqi);
  humidityData.value = localities.map(item => parseFloat(item.humidity.replace('%', '')));
  temperatureData.value = localities.map(item => parseFloat(item.temperature.replace('°C', '')));
  aqiColors.value = airQualityData.value.map(aqi => getAQIColor(aqi)); // Genera colores basados en el AQI
}

function initializeCharts() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
  };

  if (!airQualityChart) {
    const ctxAQI = document.getElementById('aqiChart').getContext('2d');
    airQualityChart = new Chart(ctxAQI, {
      type: 'bar',
      data: {
        labels: labels.value,
        datasets: [
          {
            label: 'Calidad del Aire (AQI)',
            data: airQualityData.value,
            backgroundColor: aqiColors.value, // Aplica los colores dinámicos
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: { ...chartOptions, scales: { y: { beginAtZero: true } } },
    });
  }

  if (!humidityChart) {
    const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
    humidityChart = new Chart(ctxHumidity, {
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
      options: { ...chartOptions, scales: { y: { beginAtZero: true, max: 100 } } },
    });
  }

  if (!temperatureChart) {
    const ctxTemperature = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(ctxTemperature, {
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
      options: chartOptions,
    });
  }

  [airQualityChart, humidityChart, temperatureChart].forEach(chart => {
    if (chart) chart.update();
  });
}
</script>

<template>
  <div class="relative flex flex-col min-h-screen w-full bg-[#f8fbfb] overflow-x-hidden px-4 sm:px-6 lg:px-8 py-5">
    <h1 class="text-center text-2xl font-bold">Estadísticas de la calidad del aire en Bogotá</h1>

    <!-- Mostrar mensaje de cargando datos solo si no hay datos disponibles -->
    <div v-if="airQualityStore.localities.length === 0" class="loading-container">
      <div class="loader"></div>
      <span class="loading-text">Cargando datos, por favor espere...</span>
    </div>

    <div v-else class="charts-container">
      <div class="chart-wrapper">
        <canvas id="aqiChart"></canvas>
      </div>
      <div class="chart-wrapper">
        <canvas id="humidityChart"></canvas>
      </div>
      <div class="chart-wrapper">
        <canvas id="temperatureChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 25vh;
  color: #4B5563;
  font-family: 'Arial', sans-serif;
}

.loader {
  border: 8px solid #f3f4f6;
  border-top: 8px solid #1a202c;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 15px;
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

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  overflow-x: auto;
  padding: 0 10px;
  /* Agregar un pequeño relleno general */
}

.chart-wrapper {
  width: 100%;
  max-width: 700px;
  height: 350px;
  padding: 0 15px;
  /* Agrega espacio interno para que no se recorte */
  box-sizing: border-box;
  /* Asegura que el padding no afecte el tamaño total */
  margin-left: auto;
  /* Desplaza hacia la derecha */
  margin-right: auto;
  /* Asegura que quede centrado */
}

@media (max-width: 768px) {
  .chart-wrapper {
    min-width: 600px;
    /* Mantener ancho mínimo adecuado */
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    height: 300px;
    min-width: 500px;
    /* Para pantallas muy pequeñas */
    padding: 0 20px;
    /* Ajusta el relleno para evitar recortes */
  }
}
</style>
