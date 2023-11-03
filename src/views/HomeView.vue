<template>
  <div class="cont-home">
    <div v-if="store.user" >
      <h1>Home</h1>
      <ListUser />
    </div>
    <div v-else>
      <div style="display: flex; flex-direction:column; justify-content:center">
        <img src="../assets/img/Colegio.jpg" alt="" width="750" style="position:absolute; left:30%; top:25%; border-radius:15px">
        <h2 style="text-align: center;"><b>Necesitas logearte!</b></h2>
      </div>
    </div>
  </div>
  

</template>
<script setup>
import ListUser from '../components/ListUser.vue'
import { userStore } from '../stores/user';
const store = userStore();

</script>
<style scoped>

.cont-home{
  background-color: white;
  display:flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
}
h1{
  text-align: center;
}
</style>