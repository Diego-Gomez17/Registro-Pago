
<template>
  <header>
    <div class="wrapper">
      <nav>
        <img id="logo" src="./assets/img/logo.png" alt="" >

        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/records">Registro</RouterLink>

        <Auth />
      </nav>
    </div>
  </header>
  <div class="cont">
    <RouterView />
  </div>
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
  padding: 30px;
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: bolder;
}
#logo{
  position: absolute;
  left: 15px;
  top: 15px;
  width: 165px;
}
</style>
