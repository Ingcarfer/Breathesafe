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

      <!-- Mostrar el nombre del usuario -->
      <li class="md:mx-4 mb-2 md:mb-0">
        <span class="text-xl text-hover">{{ username }}</span>
      </li>

      <Button class="mb-2 md:mb-0" @click="logout">Cerrar Sesión</Button>
    </ul>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Importar useRouter
import Button from '../Button/Button.vue';
import '@/public/assets/css/navbar.css';

export default {
  components: { Button },

  setup() {
    const open = ref(false);
    const Links = [
      { name: "Inicio", link: "/home" },
      { name: "Información", link: "/information" },
    ];

    const router = useRouter(); // Instancia de router
    const username = ref('Usuario'); // Variable reactiva para el nombre de usuario

    const toggleMenu = () => {
      open.value = !open.value;
    };

    // Función para cerrar sesión
    const logout = () => {
      localStorage.removeItem('token'); // Eliminar el token
      localStorage.removeItem('username'); // Opcional: eliminar el nombre de usuario
      router.push('/'); // Redirigir a la página de autenticación
    };

    // Función para obtener el nombre del usuario
    const fetchUsername = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/api/users/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            username.value = data.data.name; // Acceder al nombre del usuario
            // También puedes almacenar el nombre en localStorage si lo deseas
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

    return { Links, open, toggleMenu, logout, username }; // Retorno
  }
}
</script>

<style scoped></style>