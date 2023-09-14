<template>
    <div class="cont-apoderado">
        <p>Ingresar un Apoderado</p>
        <label for="">Nombre Apoderado</label>
        <select v-model="selectedUser">
            <option value="">Selecciona un usuario</option>
            <option v-for="user in userOptions" :key="user.id" :value="user.name">{{ user.name }}</option>
        </select>
        <label for="">Anualidad</label>
        <input type="text" v-model="anualidad">
        <label for="">Fecha de Pago</label>
        <input type="text" v-model="fechaPago">
        <label for="">Pago</label>
        <button @click="writeApoderadoData">Nuevo Apoderado</button>
    </div>
</template>
<script setup>
import { ref as refVue, onMounted } from 'vue'
import { ref, push } from 'firebase/database'
import { db } from '../Firebase/init'




const anualidad = refVue('');
const fechaPago = refVue();
const pago = refVue();

const apoderadoRef = ref(db, 'apoderados')


function writeApoderadoData() {
    console.log('escribiendo un nuevo pago')
    const newApoderado = {
        anualidad: anualidad.value,
        fechaPago: fechaPago.value,
        pago: pago.value
    }
    push(apoderadoRef, newApoderado);

    console.log('pago creado: ', anualidad.value, fechaPago.value)
}

//selector
const userOptions = ref([]);
const selectedUser = ref('');
onMounted(() => {
    // Recuperar los datos de los usuarios
    onValue(usersRef, (snapshot) => {
        const userData = snapshot.val();
        const options = [];

        for (const key in userData) {
            if (Object.hasOwnProperty.call(userData, key)) {
                options.push({ id: key, name: userData[key].name });
            }
        }

        userOptions.value = options;
    });
});
//-------------------

</script>
<style scoped>
.cont-apoderado {
    display: flex;
    flex-direction: column;
}
</style>