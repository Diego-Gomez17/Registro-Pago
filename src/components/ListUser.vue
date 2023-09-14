<template>
    <div v-if="userList">
        <h3>Lista de usarios</h3>
        <ol>
            <li v-for="user  in userList" :key="user.id">
                <p>nombre: {{ user.name }} - email: {{ user.email }}  </p>
            </li>
        </ol>
    </div>
    <div v-else>
        <p>cargando...</p>
    </div>
</template>
<script setup>
import { ref as collection, onValue } from 'firebase/database'
import { ref } from 'vue'
import { db } from '../Firebase/init'
import { onMounted } from 'vue';


const userList = ref([])
const usersData = collection(db, 'users/');
// onMounted(() => {
//     onValue(usersData, (snapshot) => {
//         const data = snapshot.val();
//         userList.value = Object.values(data)
//         const ids = userList.value.map((user) => user.uid)
//         console.log(ids)
//     });
// });
onMounted(() => {
    onValue(usersData, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            userList.value.push(childKey,childData)
        });
    });
});
</script>
<style scoped></style>