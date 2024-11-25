<script>
import { useRuntimeConfig } from '#app';

export default {
  data() {
    return {
      sensors: [],
      selectedSensor: null,
      showDeletePopup: false,
      sensorToDelete: null,
      deleteMessage: '',
      isDeleting: false,
      currentPage: 1,
      sensorsPerPage: 10,
      searchCode: '',
      localities: [],
      newSensor: {
        code_sensor: '',
        localityId: '',
        latitude: '',
        longitude: '',
      },
    };
  },
  computed: {
    filteredSensors() {
      const filtered = this.sensors.filter(sensor =>
        sensor.code_sensor.toLowerCase().includes(this.searchCode.toLowerCase())
      );
      const startIndex = (this.currentPage - 1) * this.sensorsPerPage;
      const endIndex = startIndex + this.sensorsPerPage;
      return filtered.slice(startIndex, endIndex);
    },
    totalPages() {
      const filtered = this.sensors.filter(sensor =>
        sensor.code_sensor.toLowerCase().includes(this.searchCode.toLowerCase())
      );
      return Math.ceil(filtered.length / this.sensorsPerPage);
    },
  },
  methods: {
    async fetchSensors() {
      const config = useRuntimeConfig();
      try {
        const url = `${config.public.apiUrl}/admin/sensors/list`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener los sensores');
        const result = await response.json();
        this.sensors = result.data;
      } catch (error) {
        console.error('Error al obtener los sensores:', error);
      }
    },
    async submitCreateForm() {
      const config = useRuntimeConfig();
      try {
        const url = `${config.public.apiUrl}/admin/sensors/create`;
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(this.newSensor),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Error al crear el sensor');
        this.fetchSensors(); // Actualizar la lista de sensores
        this.newSensor = { code_sensor: '', localityId: '', latitude: '', longitude: '' }; // Reiniciar formulario
      } catch (error) {
        console.error('Error al crear el sensor:', error);
      }
    },


    async fetchLocalities() {
      const config = useRuntimeConfig();
      try {
        const url = `${config.public.apiUrl}/admin/locality/list`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener las localidades');
        const result = await response.json();
        this.localities = result.data; // Asumiendo que la respuesta es un array de localidades
      } catch (error) {
        console.error('Error al obtener las localidades:', error);
      }
    },
    openEditModal(sensor) {
      this.selectedSensor = { ...sensor }; // Clonar el sensor para evitar ediciones directas
    },
    closeEditModal() {
      this.selectedSensor = null;
    },
    async submitEditForm() {
      const config = useRuntimeConfig();
      try {
        const url = `${config.public.apiUrl}/admin/sensors/${this.selectedSensor.id}`;
        const dataToUpdate = {
          code_sensor: this.selectedSensor.code_sensor,
          latitude: this.selectedSensor.latitude,
          longitude: this.selectedSensor.longitude,
          localityId: this.selectedSensor.locality, // Mapear al campo correcto
        };
        const response = await fetch(url, {
          method: 'PUT',
          body: JSON.stringify(dataToUpdate),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Error al actualizar el sensor');
        await this.fetchSensors(); // Actualizar lista después de editar
        this.closeEditModal();
      } catch (error) {
        console.error('Error al editar el sensor:', error);
      }
    },

    openDeletePopup(sensor) {
      this.showDeletePopup = true;
      this.sensorToDelete = sensor;
    },
    closeDeletePopup() {
      this.showDeletePopup = false;
      this.sensorToDelete = null;
    },
    async confirmDeleteSensor() {
      if (!this.sensorToDelete) return;

      this.isDeleting = true;
      const config = useRuntimeConfig();
      try {
        const url = `${config.public.apiUrl}/admin/sensors/${this.sensorToDelete.id}`;
        const response = await fetch(url, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar el sensor');
        this.sensors = this.sensors.filter(sensor => sensor.id !== this.sensorToDelete.id);
        this.deleteMessage = 'Sensor eliminado con éxito';
        setTimeout(() => {
          this.closeDeletePopup();
          this.deleteMessage = '';
        }, 2000);
      } catch (error) {
        console.error('Error al eliminar el sensor:', error);
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
      this.searchCode = '';
    },
  },
  created() {
    this.fetchSensors();
    this.fetchLocalities(); // Obtener las localidades al inicio
  },
};
</script>

<template>
  <div class="p-4">
    <div class="mb-10">
      <h1 class="text-center text-xl font-bold mb-4">Gestión de Sensores</h1>

      <!-- Buscador por código -->
      <div class="mb-4 relative">
        <input v-model="searchCode" type="text" placeholder="Buscar por código..." class="border p-2 rounded w-full" />
        <button v-if="searchCode" @click="clearSearch" class="absolute top-1/2 right-4 transform -translate-y-1/2">
          <span class="text-gray-500">X</span>
        </button>
      </div>

      <!-- Tabla de sensores -->
      <table class="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 px-4 py-2">ID</th>
            <th class="border border-gray-300 px-4 py-2">Localidad</th>
            <th class="border border-gray-300 px-4 py-2">Código</th>
            <th class="border border-gray-300 px-4 py-2">Latitud</th>
            <th class="border border-gray-300 px-4 py-2">Longitud</th>
            <th class="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sensor in filteredSensors" :key="sensor.id" class="text-center">
            <td class="border border-gray-300 px-4 py-2">{{ sensor.id }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ sensor.localityName }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ sensor.code_sensor }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ sensor.latitude }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ sensor.longitude }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <button class="button bg-blue-500 text-white px-3 py-1 rounded mr-2" @click="openEditModal(sensor)">
                Modificar
              </button>
              <button class="bg-red-500 text-white px-3 py-1 rounded" @click="openDeletePopup(sensor)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Popup para editar sensor -->
      <div v-if="selectedSensor" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-lg font-bold mb-4">Modificar Sensor</h2>
          <form @submit.prevent="submitEditForm">
            <!-- Campos de edición -->
            <div class="mb-4">
              <input v-model="selectedSensor.code_sensor" type="text" placeholder="Código del sensor"
                class="border p-2 rounded w-full" required />
            </div>
            <div class="mb-4">
              <input v-model="selectedSensor.latitude" type="text" placeholder="Latitud"
                class="border p-2 rounded w-full" required />
            </div>
            <div class="mb-4">
              <input v-model="selectedSensor.longitude" type="text" placeholder="Longitud"
                class="border p-2 rounded w-full" required />
            </div>
            <div class="mb-4">
              <select v-model="selectedSensor.locality" class="border p-2 rounded w-full" required>
                <option value="" disabled selected>Seleccionar Localidad</option>
                <option v-for="locality in localities" :key="locality.id" :value="locality.id">
                  {{ locality.locality }}
                </option>
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
          <h2 class="text-xl font-semibold mb-4">¿Estás seguro de eliminar este sensor?</h2>
          <p class="mb-4">Esta acción no se puede deshacer.</p>
          <div class="flex justify-end">
            <button @click="closeDeletePopup" class="mr-2 text-gray-500">Cancelar</button>
            <button @click="confirmDeleteSensor" class="bg-red-500 text-white px-4 py-2 rounded" :disabled="isDeleting">
              {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div class="flex justify-between items-center mt-4">
        <button @click="previousPage" :disabled="currentPage === 1" class="button bg-gray-300 px-4 py-2 rounded">
          Anterior
        </button>
        <span class="px-4 py-2">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="button bg-gray-300 px-4 py-2 rounded">
          Siguiente
        </button>
      </div>
    </div>
    <!-- Formulario para agregar un nuevo sensor -->
    <div class="mb-6">
      <h2 class="text-center text-lg font-bold mb-4">Agregar Nuevo Sensor</h2>
      <form @submit.prevent="submitCreateForm">
        <div class="grid grid-cols-2 gap-4">
          <input v-model="newSensor.code_sensor" type="text" placeholder="Código del sensor" class="border p-2 rounded"
            required />
          <select v-model="newSensor.localityId" class="border p-2 rounded" required>
            <option value="" disabled selected>Seleccionar Localidad</option>
            <option v-for="locality in localities" :key="locality.id" :value="locality.id">
              {{ locality.locality }}
            </option>
          </select>
          <input v-model="newSensor.latitude" type="text" placeholder="Latitud" class="border p-2 rounded" required />
          <input v-model="newSensor.longitude" type="text" placeholder="Longitud" class="border p-2 rounded" required />
        </div>
        <div class="flex justify-center mt-4">
          <button type="submit" class="button mt-4 bg-green-500 text-white px-4 py-2 rounded">Agregar
            Sensor</button>
        </div>
      </form>
    </div>
    <!-- Fin del formulario para agregar un nuevo sensor -->

  </div>



</template>

<style scoped>
/* Agregar estilos aquí si es necesario */
</style>
