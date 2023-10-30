
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

.wrapper{
  background-color: rgb(30, 54, 192);
}
a {
  text-decoration: none;
  color: white;
}

nav{
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 1rem;
  min-width: 1024px;
  font-size: 1.2rem;
  font-weight: bolder;
}


</style>
