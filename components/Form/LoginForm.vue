<template>
  <div class="w-full max-w-md">
    <div class="bg-secondary shadow-lg rounded-lg p-8 mt-10 custom-shadow">
      <div class="text-center">
        <!-- Se muestra el logo -->
        <img src="/assets/img/icono.png" alt="Logo BreatheSafe" class="mx-auto mb-5" style="max-width: 200px;" />
      </div>
      <form @submit.prevent="submitForm">
        <!-- Campo de email con etiqueta flotante -->
        <div class="relative z-0 mb-6 w-full group">
          <input v-model="email" id="email" type="email" placeholder=" "
            class="peer block py-4 px-4 w-full text-base bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0"
            required />
          <label for="email"
            class="absolute text-gray-500 transition-transform duration-200 transform -translate-y-2 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-4 peer-focus:-translate-y-2 peer-focus:scale-75">
            <i class="bi bi-envelope"></i> Email
          </label>
        </div>

        <!-- Campo de contraseña con etiqueta flotante -->
        <div class="relative z-0 mb-6 w-full group">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" placeholder=" "
            class="peer block py-4 px-4 w-full text-base bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0"
            required />
          <label for="password"
            class="absolute text-gray-500 transition-transform duration-200 transform -translate-y-2 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-4 peer-focus:-translate-y-2 peer-focus:scale-75">
            <i class="bi bi-key"></i> Contraseña
          </label>
          <!-- Ícono para mostrar/ocultar la contraseña -->
          <i @click="togglePasswordVisibility" :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer text-gray-500"></i>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="bg-red-100 text-red-700 px-4 py-2 rounded mb-6 text-center">
          {{ errorMessage }}
        </div>

        <!-- Botón de login -->
        <div class="flex justify-center mt-6">
          <Button type="submit" :disabled="!email || !password" class="mb-2 md:mb-0">
            <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../Button/Button.vue';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const showPassword = ref(false);
const router = useRouter();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const submitForm = async () => {
  if (!email.value && !password.value) {
    errorMessage.value = 'Por favor, completa ambos campos antes de continuar.';
    return;
  }

  if (!email.value) {
    errorMessage.value = 'El campo de email está vacío.';
    return;
  }

  if (!password.value) {
    errorMessage.value = 'El campo de contraseña está vacío.';
    return;
  }

  const url = 'https://api.breathesafe.site/api/login'; // URL completa de la API

  const datos = {
    email: email.value,
    password: password.value
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (response.status === 401) {
      throw new Error('Credenciales incorrectas. Por favor, revisa tu email y contraseña.');
    }

    if (!response.ok) {
      throw new Error('Lo sentimos, estamos presentando problemas en este momento. Inténtalo de nuevo más tarde.');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Almacena el token en localStorage
    router.push('/home'); // Redirigir automáticamente al dashboard

  } catch (error) {
    errorMessage.value = error.message; // Mostrar el mensaje de error
  }
};

// Observa los cambios en los campos email y password y elimina el mensaje de error
watch([email, password], () => {
  if (errorMessage.value) {
    errorMessage.value = '';
  }
});
</script>
