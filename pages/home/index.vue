<script>
definePageMeta({
  middleware: 'auth', // Aplica el middleware de autenticación
});

import { computed, onMounted } from 'vue';
import { useAirQualityStore } from '~/stores/airQuality';
import LocationGrid from '@/components/Location/LocationGrid.vue';

export default {
  components: {
    LocationGrid,
  },
  setup() {
    // Usamos la Store para acceder y manejar los datos de calidad del aire
    const airQualityStore = useAirQualityStore();

    // Computados para las localidades y la calidad del aire global
    const localities = computed(() => airQualityStore.localities);
    const overallAirQuality = computed(() => airQualityStore.overallAirQuality);

    // Iniciamos la actualización automática de datos al montar el componente
    onMounted(() => {
      airQualityStore.startAutoUpdate();
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
                    <!-- Aquí puedes agregar más controles si los necesitas -->
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Componente para mostrar las localidades y sus datos de calidad del aire -->
          <LocationGrid :localities="localities" />

        </div>
      </div>
    </div>
  </div>

  <!-- Espaciado adicional -->
  <div class="py-10 bg-[#f8fbfb]"></div>
</template>

<style scoped>
/* Puedes agregar estilos específicos aquí si lo necesitas */
</style>
