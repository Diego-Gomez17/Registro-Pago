
<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/records">Registro</RouterLink>
        <Auth />
      </nav>
    </div>
  </header>

  <RouterView />
</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import  Auth  from './components/auth.vue'
</script>


<style scoped>

nav{
  display: flex;
  justify-content: center;
  gap: 1rem;
  min-width: 1024px;
}


</style>
