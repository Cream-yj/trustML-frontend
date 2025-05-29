<script setup></script>

<template>
  <div class="grid-container">
    <logo class="logo-container"></logo>
    <A class="a-container"></A>
    <B class="b-container"></B>
    <C class="c-container"></C>
    <D class="d-container"></D>
    <!-- <E class="e-container"></E> -->
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 450px 400px 500px;
  /* Width A+D+E+G */
  grid-template-rows: 50px 550px 500px;
  /* Height Logo + A + C */
  gap: 5px;
  /* Grid gap */
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
  grid-column: 1 / -1;
  grid-row: 1;
  border: 3px solid #747474;
  border-radius: 3px;
}

.a-container {
  grid-column: 1;
  grid-row: 2;
  border: 2px solid #d4d4d4;
  border-radius: 3px;
}

.b-container {
  grid-column: 1 / 2;
  grid-row: 3;
  border: 2px solid #d4d4d4;
  border-radius: 3px;
}

.c-container {
  grid-column: 2 / 4;
  grid-row: 2;
  border: 2px solid #d4d4d4;
  border-radius: 3px;
}

.d-container {
  grid-column: 2 / -1;
  grid-row: 3;
  border: 2px solid #d4d4d4;
  border-radius: 3px;
}

/* .e-container {
  grid-column: 4 / -1;
  grid-row: 2;
  border: 2px solid #d4d4d4;
  border-radius: 3px;
} */
</style>
