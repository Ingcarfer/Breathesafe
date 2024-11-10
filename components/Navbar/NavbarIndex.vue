<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../Button/Button.vue';
import LoginForm from '../Form/LoginForm.vue';
import RegisterForm from '../Form/RegisterForm.vue';
import '@/public/assets/css/navbar.css'; // Importación de estilos para la barra de navegación

export default {
  components: { Button, LoginForm, RegisterForm }, // Declaración de componentes utilizados

  setup() {
    const router = useRouter(); // Obtención del enrutador para la navegación
    const open = ref(false); // Estado que controla la visibilidad del menú
    const showForm = ref('login'); // Valor inicial del formulario que se mostrará
    const Links = [
      { name: "Inicio", link: "/" }, // Enlace de inicio
    ];

    // Función para alternar la visibilidad del menú y restablecer el formulario
    const toggleMenu = () => {
      if (open.value) {
        open.value = false;
      } else {
        // Si el menú está cerrado, redirigimos a la página principal ("/") en pantallas pequeñas
        router.push('/');
        open.value = true;
      }

      if (!open.value) {
        showForm.value = 'login'; // Restablecer al formulario de inicio de sesión
      }
    };

    // Funciones para la navegación a las páginas de autenticación y registro
    const goToAuthPage = () => {
      router.push('/auth');
    };
    const goToRegisterPage = () => {
      router.push('/auth/register');
    };

    // Funciones para alternar entre formularios de inicio de sesión y registro
    const showLoginForm = () => {
      showForm.value = 'login';
    };
    const showRegisterForm = () => {
      showForm.value = 'register';
    };

    return { Links, open, toggleMenu, goToAuthPage, goToRegisterPage, showLoginForm, showRegisterForm, showForm }; // Retorno de variables y funciones al contexto
  }
};
</script>

<template>
  <div :class="[
    'bg-primary text-primary py-3.5 px-6 shadow fixed top-0 left-0 right-0 z-10 md:flex justify-between items-center',
    open ? 'rounded-none' : 'rounded-b-lg'
  ]">
    <!-- Contenedor principal de la barra de navegación, ajusta su apariencia según el estado del menú -->
    <div class="flex items-center cursor-pointer">
      <span class="text-red-500 text-xl mr-1">
        <img src="/assets/img/icono.png" alt="Icono" class="w-10 h-10" /> <!-- Icono del proyecto -->
      </span>
      <h1 class="text-xl">BreatheSafe</h1> <!-- Título del proyecto -->
    </div>

    <!-- Ícono para abrir/cerrar el menú en pantallas pequeñas -->
    <span @click="toggleMenu"
      class="absolute md:hidden right-6 top-1/2 transform -translate-y-1/2 cursor-pointer text-4xl navbar-icon">
      <i :class="[open ? 'bi bi-x' : 'bi bi-filter-left']" class="navbar-icon"></i>
      <!-- Cambia el icono según el estado del menú -->
    </span>

    <!-- Menú de navegación -->
    <ul
      class="md:flex md:items-center md:px-0 px-6 md:pb-0 md:static absolute bg-primary md:w-auto w-full top-full duration-500 ease-in-out rounded-b-lg"
      :class="[open ? 'left-0' : '-left-full']" @click.self="toggleMenu" style="max-height: 600px; overflow-y: auto;">
      <!-- Enlaces de navegación visibles cuando el menú está cerrado -->
      <div v-if="!open" class="flex flex-col md:flex-row md:space-x-4 md:visible invisible">
        <li class="md:mx-4 mb-2 md:mb-0 flex items-center justify-center" v-for="link in Links" :key="link.name">
          <NuxtLink :to="link.link" class="text-xl text-hover">{{ link.name }}</NuxtLink> <!-- Enlace dinámico -->
        </li>
        <Button @click="goToAuthPage" class="mb-2 md:mb-0">Iniciar sesión</Button> <!-- Botón de inicio de sesión -->
        <Button @click="goToRegisterPage" class="mb-2 md:mb-0">Registrarse</Button> <!-- Botón de registro -->
      </div>

      <!-- Formularios de inicio de sesión y registro -->
      <div v-if="open" class="flex flex-col items-center">
        <LoginForm v-if="showForm === 'login'" /> <!-- Componente de formulario de inicio de sesión -->
        <RegisterForm v-if="showForm === 'register'" /> <!-- Componente de formulario de registro -->

        <!-- Mensajes para alternar entre formularios -->
        <div class="text-center mt-4 mb-4">
          <span v-if="showForm === 'login'" @click="showRegisterForm" class="text-blue-500 cursor-pointer">
            ¿No tienes una cuenta? Regístrate
          </span>
          <span v-if="showForm === 'register'" @click="showLoginForm" class="text-blue-500 cursor-pointer">
            ¿Ya tienes una cuenta? Inicia sesión
          </span>
        </div>
      </div>
    </ul>
  </div>
</template>



<style scoped></style>
