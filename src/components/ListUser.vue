<template>
    <div>
        <div v-if="payList.length > 0">
            <h3>Lista de usarios</h3>
            <ol>
                <li v-for="payClient  in payList" :key="payClient.id">
                    <p>rut: {{ payClient.apoderado.rut }} - 
                        nombre: {{ payClient.apoderado.nombre }} - 
                        nombre del alumno: {{ payClient.apoderado.alumnos[0].nombre }} - 
                        curso: {{ payClient.ciclo }} -
                        nivel: {{ payClient.nivel }} -
                        Anualidad: {{ payClient.anualidad }} - 
                        Pago: {{ payClient.pago }}
                        
                     </p>
                </li>
            </ol>
        </div>
        <div v-else-if="payList == 0">
            <h3>No hay pagos registrados</h3>
        </div>
    </div>
    <Loader :isLoading="isLoading" />
</template>
<script setup>
import Loader from '../components/Loader.vue';
import { ref as collection, onValue } from 'firebase/database'
import { ref as refVue } from 'vue'
import { db } from '../Firebase/init'
import { onMounted } from 'vue';

const isLoading = refVue(true);


const payList = refVue([])
const payRef = collection(db, 'pagos/');

onMounted(() => {

    onValue(payRef, (snapshot) => {
        const data = snapshot.val();
        payList.value = Object.values(data)
    });
    isLoading.value = false;
});




</script>
<style scoped></style>