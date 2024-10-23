<template>

  <button class="button">
    <slot></slot> <!-- Espacio dinámico para contenido personalizado -->
  </button>

</template>

<style scoped>
:root {
  --button-bg: #b4f2e5;
  /* Fondo botón igual al azul del fondo */
  --button-bg-hover: #7ee3cd;
  /* Fondo botón al hacer hover (verde del fondo) */
  --button-bg-active: #65e0c5;
  /* Fondo botón al presionar (verde más intenso) */
  --button-text-color: #000000;
  /* Color del texto */
  --button-border-color: #4a90e2;
  /* Color del borde del botón */
  --button-padding-y: 0.5rem;
  /* Padding vertical */
  --button-padding-x: 1rem;
  /* Padding horizontal */
  --button-border-radius: 0.5rem;
  /* Radio del borde */
  --button-font-size: 0.875rem;
  /* Tamaño de la fuente */
  --button-transition: 300ms ease-in-out;
  /* Duración de la transición */
}

.button {
  background-color: var(--button-bg);
  color: var(--button-text-color);
  font-size: var(--button-font-size);
  padding: var(--button-padding-y) var(--button-padding-x);
  border: 2px solid var(--button-border-color);
  /* Agregar el borde del botón */
  border-radius: var(--button-border-radius);
  transition: background-color var(--button-transition),
    border-color var(--button-transition);
  /* Añadir transición para el color del borde */
}

.button:hover {
  background-color: var(--button-bg-hover);
  /* Cambia al verde al hacer hover */
}

.button:active {
  background-color: var(--button-bg-active);
  /* Cambia a un verde más intenso al presionar */
}

/* Cambiar el color del borde al hacer hover */
.button:hover {
  border-color: #357abd;
  /* Cambia el color del borde al hacer hover */
}
</style>
