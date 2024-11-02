// middleware/auth.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log(`Middleware 'auth' ejecutado en: ${to.path}`);

  // Función para verificar si el usuario está autenticado
  function isAuthenticated() {
      if (process.client) {
          const token = localStorage.getItem('token');
          return !!token; 
      }
      return false; // En el servidor, no hay autenticación
  }

  // Lista de rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/auth', '/auth/register', '/information/prueba'];

  // Si la ruta actual es pública, no aplicamos el middleware
  if (publicRoutes.includes(to.path)) {
      return;
  }

  // Si el usuario no está autenticado, redirigir a la página de login
  if (!isAuthenticated()) {
      return navigateTo('/'); // Redirige a la página de login
  }
});