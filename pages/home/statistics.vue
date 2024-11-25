<script setup>
definePageMeta({
  middleware: 'auth',
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
const aqiColors = ref([]);

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
  if (aqi <= 50) return 'rgba(0, 255, 0, 0.6)';
  if (aqi <= 100) return 'rgba(255, 255, 0, 0.6)';
  if (aqi <= 150) return 'rgba(255, 165, 0, 0.6)';
  if (aqi <= 200) return 'rgba(255, 0, 0, 0.6)';
  if (aqi <= 300) return 'rgba(153, 50, 204, 0.6)';
  return 'rgba(128, 0, 0, 0.6)';
}

function updateChartData() {
  const localities = airQualityStore.localities.filter(item => item.aqi !== 0);

  labels.value = localities.map(item =>
    item.name.length > 10 ? item.name.replace(/(.{10})/g, '$1\n') : item.name
  );
  airQualityData.value = localities.map(item => item.aqi);
  humidityData.value = localities.map(item => parseFloat(item.humidity.replace('%', '')));
  temperatureData.value = localities.map(item => parseFloat(item.temperature.replace('°C', '')));
  aqiColors.value = airQualityData.value.map(aqi => getAQIColor(aqi));
}

function initializeCharts() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 20,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: window.innerWidth < 768 ? 8 : 12,
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
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
            backgroundColor: aqiColors.value,
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
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
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 20,
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 0,
              font: {
                size: window.innerWidth < 768 ? 8 : 12,
              },
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
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
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 20,
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 0,
              font: {
                size: window.innerWidth < 768 ? 8 : 12,
              },
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
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
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  padding: 0 10px;
}

.chart-wrapper {
  width: 100%;
  max-width: 700px;
  height: 350px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .chart-wrapper {
    height: 300px;
  }
}
</style>
