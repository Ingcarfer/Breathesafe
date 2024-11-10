<script setup>


// Definir el layout para esta página
definePageMeta({
  layout: 'lindex',
});

// Establecer el título de la página
useHead({
  title: 'BreatheSafe - Inicio'
});
</script>
<template>
  <div class="px-10 flex flex-1 justify-center py-5">
    <div class="layout-content-container flex flex-col max-w-[960px] flex-1">

      <!-- Contenedor de imagen con texto superpuesto -->
      <div class="container">
        <div class="sm:p-4">
          <div
            class="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat sm:gap-8 sm:rounded-xl items-center justify-end px-4 pb-10 sm:px-10 w-full rounded-xl"
            style="
        background-image: linear-gradient(
          rgba(0, 0, 0, 0.1) 0%, 
          rgba(0, 0, 0, 0.4) 100%
        ),
        url('/assets/img/BogotaNocturna.webp');
      ">
            <!-- Texto y Título centrado horizontalmente y en la parte inferior -->
            <div class="flex flex-col gap-2 text-center sm:gap-4 p-4 rounded-md">
              <h1
                class="text-white text-2xl font-bold leading-snug tracking-tight sm:text-4xl sm:font-extrabold sm:leading-tight">
                La calidad del aire de Bogotá
              </h1>
              <h2 class="text-white text-base font-normal leading-relaxed sm:text-lg sm:leading-normal">
                Datos en tiempo real sobre la calidad del aire en Bogotá. Regístrate o inicia sesión para ver nuestra
                gama completa de servicios de monitoreo.
              </h2>
            </div>
          </div>
        </div>
      </div>



      <!-- Sección de información sobre la calidad del aire -->
      <div class="flex flex-col gap-10 px-4 py-10 container mx-auto">
        <div class="flex flex-col gap-4">
          <h1
            class="text-center text-[#0e171b] tracking-light text-[32px] font-bold leading-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em] max-w-[960px] mx-auto">
            ¿Por qué monitorear la calidad del aire?
          </h1>
          <p class="text-[#0e171b] text-base font-normal leading-normal max-w-[960px] mx-auto">
            La contaminación del aire es un gran problema de salud pública. Puede causar una variedad de problemas de
            salud, desde molestias leves hasta enfermedades graves.
          </p>
        </div>
      </div>

      <!-- Sección de recomendaciones -->
      <div class="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
        <div class="flex flex-col gap-3 pb-3">
          <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
            style="background-image: url('/assets/img/protegete.png');">
          </div>
          <div>
            <p class="text-[#111b0e] text-base font-medium leading-normal">
              Protégete de la contaminación del aire
            </p>
            <p class="text-[#609550] text-sm font-normal leading-normal">
              Usa una mascarilla con clasificación N95 o superior para reducir la exposición a partículas dañinas.
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-3 pb-3">
          <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
            style="background-image: url('/assets/img/activo.png');">
          </div>
          <div>
            <p class="text-[#111b0e] text-base font-medium leading-normal">
              Mantente activo al aire libre con buena calidad del aire
            </p>
            <p class="text-[#609550] text-sm font-normal leading-normal">
              Monitorea la calidad del aire para encontrar los mejores momentos para hacer ejercicio al aire libre.
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-3 pb-3">
          <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
            style="background-image: url('/assets/img/camina.png');">
          </div>
          <div>
            <p class="text-[#111b0e] text-base font-medium leading-normal">
              Camina, anda en bicicleta, corre y juega con confianza
            </p>
            <p class="text-[#609550] text-sm font-normal leading-normal">
              Usa datos en tiempo real sobre la calidad del aire para tomar decisiones informadas sobre actividades al
              aire libre.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>



<style scoped></style>
