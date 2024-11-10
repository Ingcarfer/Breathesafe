<script>
definePageMeta({
  middleware: 'auth', // Aplica el middleware de autenticación
});
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useAirQualityStore } from '@/stores/airQuality';

Chart.register(...registerables);

export default {
  setup() {
    const airQualityStore = useAirQualityStore();
    const airQualityChart = ref(null);
    const humidityChart = ref(null);
    const temperatureChart = ref(null);

    // Datos para las gráficas
    const labels = ref([]);
    const airQualityData = ref([]);
    const humidityData = ref([]);
    const temperatureData = ref([]);

    // Computed para verificar si todavía se están cargando los datos
    const isLoading = computed(() => airQualityStore.localities.length === 0);

    onMounted(() => {
      airQualityStore.startAutoUpdate();
      updateChartData();
      initializeCharts();

      // Observa cambios en `airQualityStore.localities` para actualizar gráficas
      watch(
        () => airQualityStore.localities,
        () => {
          updateChartData();
          updateCharts();
        }
      );
    });

    function updateChartData() {
      const localities = airQualityStore.localities;
      labels.value = localities.map(item => item.name);
      airQualityData.value = localities.map(item => item.aqi);
      humidityData.value = localities.map(item => parseFloat(item.humidity));
      temperatureData.value = localities.map(item => parseFloat(item.temperature));
    }

    function initializeCharts() {
      const ctxAQI = document.getElementById('aqiChart').getContext('2d');
      airQualityChart.value = new Chart(ctxAQI, {
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
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
      humidityChart.value = new Chart(ctxHumidity, {
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
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      const ctxTemperature = document.getElementById('temperatureChart').getContext('2d');
      temperatureChart.value = new Chart(ctxTemperature, {
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
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    function updateCharts() {
      // Verificar si el gráfico existe antes de intentar actualizarlo
      if (airQualityChart.value) {
        airQualityChart.value.data.labels = labels.value;
        airQualityChart.value.data.datasets[0].data = airQualityData.value;
        airQualityChart.value.update();
      }

      if (humidityChart.value) {
        humidityChart.value.data.labels = labels.value;
        humidityChart.value.data.datasets[0].data = humidityData.value;
        humidityChart.value.update();
      }

      if (temperatureChart.value) {
        temperatureChart.value.data.labels = labels.value;
        temperatureChart.value.data.datasets[0].data = temperatureData.value;
        temperatureChart.value.update();
      }
    }

    return {
      isLoading,
    };
  },
};
</script>

<template>
  <!-- Mostrar mensaje de cargando datos solo si no hay datos disponibles -->
  <div v-if="isLoading" class="loading-container">
    <div class="loader"></div>
    <span class="loading-text">Cargando datos, por favor espere...</span>
  </div>

  <div v-else class="relative flex size-full min-h-screen flex-col bg-[#f8fbfb] group/design-root overflow-x-hidden"
    style="font-family: Manrope, 'Noto Sans', sans-serif">
    <div class="layout-container flex h-full grow flex-col">
      <div class="px-4 md:px-40 flex flex-1 justify-center py-5">
        <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div class="@container mb-4">
            <h1 class="text-3xl font-bold mb-4">Estadísticas de Calidad del Aire en Bogotá</h1>

            <div>
              <h2 class="text-xl font-bold mb-2">Calidad del Aire (AQI)</h2>
              <canvas id="aqiChart"></canvas>
            </div>

            <div class="mt-8">
              <h2 class="text-xl font-bold mb-2">Humedad Promedio</h2>
              <canvas id="humidityChart"></canvas>
            </div>

            <div class="mt-8">
              <h2 class="text-xl font-bold mb-2">Temperatura Promedio</h2>
              <canvas id="temperatureChart"></canvas>
            </div>
          </div>
        </div>
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
</style>
