<template>
  <div class="w-full max-w-md">
    <div class="bg-secondary shadow-lg rounded-lg p-8 mt-10 custom-shadow">
      <div class="text-center">
        <img src="/assets/img/icono.png" alt="Logo BreatheSafe" class="mx-auto mb-5" style="max-width: 200px;" />
      </div>
      <form @submit.prevent="submitForm">
        <!-- Campos del formulario -->
        <div class="relative z-0 mb-6 w-full group">
          <input v-model="name" id="name" type="text" placeholder=" "
            class="peer block py-4 px-4 w-full text-base bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0"
            required @input="validateNameSurname('name')" />
          <label for="name"
            class="absolute text-gray-500 transition-transform duration-200 transform -translate-y-2 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-4 peer-focus:-translate-y-2 peer-focus:scale-75">
            <i class="bi bi-person"></i> Nombre
          </label>
        </div>

        <div class="relative z-0 mb-6 w-full group">
          <input v-model="surname" id="surname" type="text" placeholder=" "
            class="peer block py-4 px-4 w-full text-base bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0"
            required @input="validateNameSurname('surname')" />
          <label for="surname"
            class="absolute text-gray-500 transition-transform duration-200 transform -translate-y-2 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-4 peer-focus:-translate-y-2 peer-focus:scale-75">
            <i class="bi bi-person"></i> Apellido
          </label>
        </div>

        <div class="relative z-0 mb-6 w-full group">
          <input v-model="email" id="email" type="email" placeholder=" "
            class="peer block py-4 px-4 w-full text-base bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0"
            required />
          <label for="email"
            class="absolute text-gray-500 transition-transform duration-200 transform -translate-y-2 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-4 peer-focus:-translate-y-2 peer-focus:scale-75">
            <i class="bi bi-envelope"></i> Correo Electrónico
          </label>
        </div>

        <div class="relative z-0 mb-6 w-full group">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" placeholder=" "
            class="peer block py-4 px-4 w-full text-base bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0"
            required @input="validatePassword" />
          <label for="password"
            class="absolute text-gray-500 transition-transform duration-200 transform -translate-y-2 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-4 peer-focus:-translate-y-2 peer-focus:scale-75">
            <i class="bi bi-key"></i> Contraseña
          </label>
          <i @click="togglePasswordVisibility" :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer text-gray-500"></i>
        </div>

        <div v-if="errorMessage" class="bg-red-100 text-red-700 px-4 py-2 rounded mb-6 text-center">
          {{ errorMessage }}
        </div>

        <div class="flex justify-center mt-6">
          <Button type="submit" class="mb-2 md:mb-0"><i class="bi bi-person-plus-fill"></i> Registrarse</Button>
        </div>
      </form>
    </div>

    <div v-if="successMessage" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-main p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col items-center justify-center">
        <h2 class="text-xl font-semibold text-green-600 text-center">¡Éxito!</h2>
        <p class="mt-2 text-center">{{ successMessage }}</p>
        <Button @click="redirectToHome" class="mt-4  rounded-lg px-4 py-2">
          Aceptar
        </Button>
      </div>
    </div>

  </div>
</template>

<script setup>
import Button from "../Button/Button.vue";
import "@/public/assets/css/form.css";
const config = useRuntimeConfig();

const name = ref("");
const surname = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const validateNameSurname = (field) => {
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
  if (!regex.test(field === 'name' ? name.value : surname.value)) {
    if (field === 'name') {
      name.value = name.value.replace(/[0-9]/g, "");
    } else {
      surname.value = surname.value.replace(/[0-9]/g, "");
    }
  }
};

const validatePassword = () => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
  if (!regex.test(password.value)) {
    errorMessage.value =
      "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un símbolo.";
  } else {
    errorMessage.value = "";
  }
};

const submitForm = async () => {
  if (errorMessage.value) return;

  try {
    const url = config.public.apiUrl + "/register";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
        surname: surname.value,
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.value = "¡Registro exitoso! ya puede iniciar sesión";
      errorMessage.value = "";
    } else if (data.status === 400 && data.messages.email) {
      errorMessage.value = "El correo electrónico ya está registrado.";
      successMessage.value = "";
    } else {
      errorMessage.value = "Error en el registro. Inténtalo de nuevo.";
      successMessage.value = "";
    }
  } catch (error) {
    errorMessage.value =
      "Lo sentimos, estamos presentando problemas en este momento. Inténtalo de nuevo más tarde.";
    successMessage.value = "";
  }
};

const redirectToHome = () => {
  successMessage.value = "";
  // Redirige al usuario a la página de inicio
  useRouter().push("/");
};
</script>
