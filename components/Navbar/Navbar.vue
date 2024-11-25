<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRuntimeConfig } from '#imports';
import Button from '../Button/Button.vue';

const open = ref(false);
const userMenuOpen = ref(false);
const isLoading = ref(false); // Estado de carga para el reporte
const Links = [
  { name: "Inicio", link: "/home" },
  { name: "Estadísticas", link: "/home/statistics" },
  { name: "Mapa", link: "/home/map" },
  { name: "Información", link: "/information" },
];

const router = useRouter();
const username = ref('');
const isAdmin = ref(false); // Estado para verificar si el usuario es administrador
const config = useRuntimeConfig();

const toggleMenu = () => {
  open.value = !open.value;
  if (!open.value) {
    userMenuOpen.value = false; // Cierra el menú de usuario si el principal se cierra
  }
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

// Función para cerrar ambos menús al hacer clic en un enlace
const closeMenus = () => {
  open.value = false; // Cierra el menú principal
  userMenuOpen.value = false; // Cierra el menú de usuario
};

// Función para cerrar sesión
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  router.push('/');
  closeMenus(); // Cierra ambos menús
};

// Función para obtener el nombre del usuario
const fetchUsername = async () => {
  if (process.client) {
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
          isAdmin.value = data.data.rolId === "1";
          localStorage.setItem('username', data.data.name);
          localStorage.setItem('userId', data.data.id);
        } else {
          console.error('Error al obtener el nombre del usuario:', response.status);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    } else {
      console.log('No hay token disponible');
    }
  }
};

// Función exclusiva para acciones de administrador
const adminAction = () => {
  if (isAdmin.value) {
    console.log('Acción de administrador ejecutada');
    router.push('/admin');
    closeMenus(); // Cierra ambos menús
  } else {
    console.warn('Acceso denegado. Usuario no es administrador.');
  }
};

// Función para generar el reporte
const generateReport = () => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    const data = {
      userId: userId
    };

    isLoading.value = true;
    const url = config.public.apiUrl + "/generateReport";
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reporte_calidad_aire.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error al generar el reporte:', error);
      })
      .finally(() => {
        isLoading.value = false;
      });
  } else {
    console.error('Usuario no autenticado');
  }
};

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
        <NuxtLink :to="link.link" class="text-xl text-hover" @click="closeMenus">
          {{ link.name }}
        </NuxtLink>
      </li>

      <!-- Ícono de usuario con menú desplegable -->
      <li class="md:mx-4 mb-2 md:mb-0 relative">
        <span @click="toggleUserMenu" class="cursor-pointer text-3xl user-icon">
          <i class="bi bi-person-circle"></i>
        </span>
        <!-- Menú desplegable -->
        <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-3 z-20">
          <p class="text-gray-700 mb-2">Hola, {{ username }}</p>

          <!-- Botón de administrador, visible solo si isAdmin es true -->
          <div class="flex items-center">
            <button v-if="isAdmin" @click="adminAction" class="flex items text-gray-700 text-hover2">
              <i class="bi bi-person-lock mr-2"></i>
              Administrar
            </button>
          </div>

          <!-- Botón para Generar Reporte -->
          <div class="flex items-center">
            <button @click="generateReport" class="flex items text-gray-700 text-hover2">
              <i class="bi bi-file-earmark-text mr-2"></i>
              Generar Reportes
            </button>
            <div v-if="isLoading" class="ml-2 spinner"></div>
          </div>

          <Button class="w-full mt-2" @click="logout">Cerrar Sesión</Button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.spinner {
  border: 4px solid transparent;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
