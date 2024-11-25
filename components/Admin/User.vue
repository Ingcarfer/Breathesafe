<script>
import { useRuntimeConfig } from '#app';

export default {
  data() {
    return {
      users: [],
      selectedUser: null,
      showDeletePopup: false,
      userToDelete: null,
      deleteMessage: '',
      isDeleting: false,
      currentPage: 1,
      usersPerPage: 10,
      searchEmail: '',
    };
  },
  computed: {
    filteredUsers() {
      const filtered = this.users.filter(user =>
        user.email.toLowerCase().includes(this.searchEmail.toLowerCase())
      );
      const startIndex = (this.currentPage - 1) * this.usersPerPage;
      const endIndex = startIndex + this.usersPerPage;
      return filtered.slice(startIndex, endIndex);
    },
    totalPages() {
      const filtered = this.users.filter(user =>
        user.email.toLowerCase().includes(this.searchEmail.toLowerCase())
      );
      return Math.ceil(filtered.length / this.usersPerPage);
    },
  },
  methods: {
    async fetchUsers() {
      const config = useRuntimeConfig();
      try {
        const url = `${config.public.apiUrl}/admin`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener los usuarios');
        const result = await response.json();
        this.users = result.data;
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    },
    openEditModal(user) {
      this.selectedUser = { ...user }; // Clonar el usuario para evitar ediciones directas
    },
    closeEditModal() {
      this.selectedUser = null;
    },
    async submitEditForm() {
      const config = useRuntimeConfig();
      try {
        const url = `${config.public.apiUrl}/admin/${this.selectedUser.id}`;
        const response = await fetch(url, {
          method: 'PUT',
          body: JSON.stringify(this.selectedUser),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Error al actualizar el usuario');
        this.fetchUsers();
        this.closeEditModal();
      } catch (error) {
        console.error('Error al editar el usuario:', error);
      }
    },
    openDeletePopup(user) {
      this.showDeletePopup = true;
      this.userToDelete = user;
    },
    closeDeletePopup() {
      this.showDeletePopup = false;
      this.userToDelete = null;
    },
    async confirmDeleteUser() {
      if (!this.userToDelete) return;

      this.isDeleting = true;
      const config = useRuntimeConfig();
      try {
        const url = `${config.public.apiUrl}/admin/${this.userToDelete.id}`;
        const response = await fetch(url, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar el usuario');
        this.users = this.users.filter(user => user.id !== this.userToDelete.id);
        this.deleteMessage = 'Usuario eliminado con éxito';
        setTimeout(() => {
          this.closeDeletePopup();
          this.deleteMessage = '';
        }, 2000);
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      } finally {
        this.isDeleting = false;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    clearSearch() {
      this.searchEmail = '';
    },
  },
  created() {
    this.fetchUsers();
  },
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-center text-xl font-bold mb-4">Gestión de Usuarios</h1>

    <!-- Buscador por correo -->
    <div class="mb-4 relative">
      <input v-model="searchEmail" type="text" placeholder="Buscar por correo..." class="border p-2 rounded w-full" />
      <button v-if="searchEmail" @click="clearSearch" class="absolute top-1/2 right-4 transform -translate-y-1/2">
        <span class="text-gray-500">X</span>
      </button>
    </div>

    <!-- Tabla de usuarios -->
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 px-4 py-2">ID</th>
          <th class="border border-gray-300 px-4 py-2">Nombre</th>
          <th class="border border-gray-300 px-4 py-2">Apellido</th>
          <th class="border border-gray-300 px-4 py-2">Email</th>
          <th class="border border-gray-300 px-4 py-2">Rol</th>
          <th class="border border-gray-300 px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id" class="text-center">
          <td class="border border-gray-300 px-4 py-2">{{ user.id }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ user.name }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ user.surname }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ user.email }}</td>
          <td class="border border-gray-300 px-4 py-2">
            {{ user.rolId === "1" ? 'Admin' : user.rolId === "3" ? 'Usuario' : 'Desconocido' }}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <button class="button bg-blue-500 text-white px-3 py-1 rounded mr-2" @click="openEditModal(user)">
              Modificar
            </button>
            <button class="bg-red-500 text-white px-3 py-1 rounded" @click="openDeletePopup(user)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Popup para editar usuario -->
    <div v-if="selectedUser" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-lg font-bold mb-4">Modificar Usuario</h2>
        <form @submit.prevent="submitEditForm">
          <!-- Campos de nombre, apellido, email y rol -->
          <div class="relative z-0 mb-6 w-full group">
            <input v-model="selectedUser.name" type="text" placeholder="Nombre" class="peer block w-full p-2"
              required />
          </div>
          <div class="relative z-0 mb-6 w-full group">
            <input v-model="selectedUser.surname" type="text" placeholder="Apellido" class="peer block w-full p-2"
              required />
          </div>
          <div class="relative z-0 mb-6 w-full group">
            <input v-model="selectedUser.email" type="email" placeholder="Correo electrónico"
              class="peer block w-full p-2" required />
          </div>
          <div class="relative z-0 mb-6 w-full group">
            <select v-model="selectedUser.rolId" class="peer block w-full p-2">
              <option value="1">Admin</option>
              <option value="3">Usuario</option>
            </select>
          </div>

          <div class="flex justify-end">
            <button type="button" @click="closeEditModal"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">Cancelar</button>
            <button type="submit" class="button text-white px-4 py-2 rounded">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Popup para confirmar eliminación -->
    <div v-if="showDeletePopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4">¿Estás seguro de eliminar este usuario?</h2>
        <p class="mb-4">Esta acción no se puede deshacer.</p>
        <p v-if="deleteMessage" class="text-green-600 mb-4">{{ deleteMessage }}</p>
        <div class="flex justify-end">
          <button class="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2" @click="closeDeletePopup">
            Cancelar
          </button>
          <button class="bg-red-500 text-white px-4 py-2 rounded" @click="confirmDeleteUser" :disabled="isDeleting">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between mt-4">
      <button class="button bg-gray-300 text-gray-700 px-4 py-2 rounded" :disabled="currentPage === 1"
        @click="previousPage">
        Anterior
      </button>
      <span class="self-center">Página {{ currentPage }} de {{ totalPages }}</span>
      <button class="button bg-gray-300 text-gray-700 px-4 py-2 rounded" :disabled="currentPage === totalPages"
        @click="nextPage">
        Siguiente
      </button>
    </div>
  </div>
</template>
