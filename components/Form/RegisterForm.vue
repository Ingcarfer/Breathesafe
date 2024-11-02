<template>
  <div class="w-full max-w-md">
    <div class="bg-secondary shadow-lg rounded-lg p-8 mt-10 custom-shadow">
      <div class="text-center">
        <img src="/assets/img/icono.png" alt="Logo BreatheSafe" class="mx-auto mb-5" style="max-width: 200px;" />
      </div>
      <form @submit.prevent="submitForm">
        <!-- Campos del formulario -->
        <!-- Campo de nombre -->
        <div class="relative z-0 mb-6 w-full group">
          <input v-model="name" id="name" type="text" placeholder=" "
            class="peer block py-4 px-4 w-full text-base bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0"
            required @input="validateNameSurname('name')" />
          <label for="name"
            class="absolute text-gray-500 transition-transform duration-200 transform -translate-y-2 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-4 peer-focus:-translate-y-2 peer-focus:scale-75">
            <i class="bi bi-person"></i> Nombre
          </label>
        </div>

        <!-- Campo de apellido -->
        <div class="relative z-0 mb-6 w-full group">
          <input v-model="surname" id="surname" type="text" placeholder=" "
            class="peer block py-4 px-4 w-full text-base bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0"
            required @input="validateNameSurname('surname')" />
          <label for="surname"
            class="absolute text-gray-500 transition-transform duration-200 transform -translate-y-2 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-4 peer-focus:-translate-y-2 peer-focus:scale-75">
            <i class="bi bi-person"></i> Apellido
          </label>
        </div>

        <!-- Campo de correo electrónico -->
        <div class="relative z-0 mb-6 w-full group">
          <input v-model="email" id="email" type="email" placeholder=" "
            class="peer block py-4 px-4 w-full text-base bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0"
            required />
          <label for="email"
            class="absolute text-gray-500 transition-transform duration-200 transform -translate-y-2 scale-75 top-2 left-4 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-4 peer-focus:-translate-y-2 peer-focus:scale-75">
            <i class="bi bi-envelope"></i> Correo Electrónico
          </label>
        </div>

        <!-- Campo de contraseña -->
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

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="bg-red-100 text-red-700 px-4 py-2 rounded mb-6 text-center">
          {{ errorMessage }}
        </div>

        <!-- Botón para registrar -->
        <div class="flex justify-center mt-6">
          <Button type="submit" class="mb-2 md:mb-0"><i class="bi bi-person-plus-fill"></i> Registrarse</Button>
        </div>
      </form>
    </div>

    <!-- Modal para mensaje de éxito -->
    <div v-if="successMessage" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 class="text-xl font-semibold text-green-600">¡Éxito!</h2>
        <p class="mt-2">{{ successMessage }}</p>
        <button @click="redirectToHome" class="mt-4 bg-green-500 text-white rounded-lg px-4 py-2">
          Aceptar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Cambia "export default" por una constante
import Button from "../Button/Button.vue";
import "@/public/assets/css/form.css";
const config = useRuntimeConfig();

const RegisterForm = {
  components: { Button },
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      password: "",
      showPassword: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    validateNameSurname(field) {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
      if (!regex.test(this[field])) {
        this[field] = this[field].replace(/[0-9]/g, "");
      }
    },

    validatePassword() {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
      if (!regex.test(this.password)) {
        this.errorMessage =
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un símbolo.";
      } else {
        this.errorMessage = "";
      }
    },

    async submitForm() {
      if (this.errorMessage) return;

      try {
        const url = config.public.apiUrl + "/register";

        const response = await fetch(url, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.name,
            surname: this.surname,
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          this.successMessage = "¡Registro exitoso! ya puede iniciar sesión";
          this.errorMessage = "";
        } else if (data.status === 400 && data.messages.email) {
          this.errorMessage = "El correo electrónico ya está registrado.";
          this.successMessage = "";
        } else {
          this.errorMessage = "Error en el registro. Inténtalo de nuevo.";
          this.successMessage = "";
        }
      } catch (error) {
        this.errorMessage =
          "Lo sentimos, estamos presentando problemas en este momento. Inténtalo de nuevo más tarde.";
        this.successMessage = "";
      }
    },

    // Redirige al usuario a la página de inicio
    redirectToHome() {
      this.successMessage = ""; // Limpiar el mensaje de éxito
      this.$router.push("/"); // Redirigir al usuario a la página de inicio
    }
  }
};
</script>

<style scoped>
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.z-50 {
  z-index: 50;
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.max-w-sm {
  max-width: 24rem;
}

.w-full {
  width: 100%;
}
</style>
