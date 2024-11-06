<template>
  <footer class=" bg-primary text-white p-1 text-center rounded-t-lg">
    &copy; IngCarfer-JhonRamos - {{ currentYear }}
  </footer>
</template>

<script setup>
const currentYear = new Date().getUTCFullYear();
</script>

<style scoped>
footer {
  width: 100%;
}
</style>
