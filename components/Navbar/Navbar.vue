<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRuntimeConfig } from '#imports';
import Button from '../Button/Button.vue';

const open = ref(false);
const userMenuOpen = ref(false);
const Links = [
  { name: "Inicio", link: "/home" },
  { name: "Estadísticas", link: "/home/statistics" },
  { name: "Información", link: "/information" },

];

const router = useRouter();
const username = ref('');
const config = useRuntimeConfig();

const toggleMenu = () => {
  open.value = !open.value;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

// Función para cerrar sesión
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  router.push('/');
  userMenuOpen.value = false;
};

// Función para obtener el nombre del usuario
const fetchUsername = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const url = config.public.apiUrl + "/users/me";
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        username.value = data.data.name;
        localStorage.setItem('username', data.data.name);
      } else {
        console.error('Error al obtener el nombre del usuario:', response.status);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }
};

// Llamar a la función al montar el componente
onMounted(() => {
  fetchUsername();
});
</script>
<template>
  <div :class="[
    'bg-primary text-primary py-3.5 px-6 shadow fixed top-0 left-0 right-0 z-10 md:flex justify-between items-center',
    open ? 'rounded-none' : 'rounded-b-lg'
  ]">
    <div class="flex items-center cursor-pointer">
      <span class="text-red-500 text-xl mr-1">
        <img src="/assets/img/icono.png" alt="Icono" class="w-10 h-10" />
      </span>
      <h1 class="text-xl">BreatheSafe</h1>
    </div>

    <span @click="toggleMenu"
      class="absolute md:hidden right-6 top-1/2 transform -translate-y-1/2 cursor-pointer text-4xl">
      <i :class="[open ? 'bi bi-x' : 'bi bi-filter-left']"></i>
    </span>

    <ul
      class="md:flex md:items-center md:px-0 px-6 md:pb-0 pd-10 md:static absolute bg-primary md:w-auto w-full top-14 duration-300 ease-in"
      :class="[open ? 'left-0 rounded-b-lg' : 'left-[-100%]']">
      <li class="md:mx-4 mb-2 md:mb-0" v-for="link in Links" :key="link.name">
        <NuxtLink :to="link.link" class="text-xl text-hover">{{ link.name }}</NuxtLink>
      </li>

      <!-- Ícono de usuario con menú desplegable -->
      <li class="md:mx-4 mb-2 md:mb-0 relative">
        <span @click="toggleUserMenu" class="cursor-pointer text-3xl user-icon">
          <i class="bi bi-person-circle"></i>
        </span>
        <!-- Aumentar el ancho del menú desplegable -->
        <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-3 z-20">
          <p class="text-gray-700 mb-2">Hola, {{ username }}</p>

          <!-- Apartado para Generar Reportes con ícono -->
          <NuxtLink to="/reports" class="flex items-center  mb-2  text-gray-700 text-hover2">
            <i class="bi bi-file-earmark-text mr-2 "></i>
            Generar Reportes
          </NuxtLink>

          <Button class="w-full" @click="logout">Cerrar Sesión</Button>
        </div>
      </li>
    </ul>
  </div>
</template>



<style scoped></style>
