<template>
  <div class="cont-home">
    <h1>Home</h1>
    <div v-if="store.user" >
      <ListUser />
    </div>
    <div v-else>
      <h4>Necesitas logearte!</h4>
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
  display:flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
}
h1{
  text-align: center;
}
</style>