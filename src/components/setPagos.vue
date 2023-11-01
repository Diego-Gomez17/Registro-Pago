<template>
    <div class="cont-apoderado">
        <p>Ingresar un Pago</p>
        <form @submit.prevent="writeApoderadoData">
            <label for="">Nombre Apoderado</label>
            <select v-model="selectedUser" required>
                <option value="">Selecciona un usuario</option>
                <option v-for="user in userOptions" :key="user.id" :value="user">{{ user.nombre }}</option>
            </select>
            <label for="">Anualidad</label>
            <input type="text" v-model="anualidad" required>
            <label for="">Nivel del curso</label>
            <input type="text" v-model="nivel">
            <label for="">Ciclo</label>
            <input type="text" v-model="ciclo">
            <!-- <label for="">Fecha de Pago</label>
            <VueDatePicker v-model="fechaPago" :enable-time-picker="false" :format="format" :placeholder="fechaPago" /> -->
            <label for="">Pago</label>
            <input type="number" v-model="pago" required>
            <input type="submit" value="Nuevo Pago">
        </form>
        {{  selectedUser }}
    </div>
</template>
<script setup>
import { ref as refVue, onMounted } from 'vue'
import { ref, push, onValue } from 'firebase/database'
import { db } from '../Firebase/init'
const currentDate = new Date().toLocaleDateString('es-ES');


const anualidad = refVue(String(new Date().getFullYear()));
const curso = refVue(''); // primero, segundo <--- agregar
const nivel = refVue(''); // a , b, c
const ciclo = refVue(); // parbulo, primer ciclo ,segundo ciclo, media
const fechaPago = refVue(currentDate);
const pago = refVue(); //aporte voluntario

// el curso es por alumno no por boleta
// crear view para editar apoderados y cambiar el curso de los alumnos

const pagoRef = ref(db, 'pagos')
//formart datePicker
const format = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

//post
function writeApoderadoData() {
    console.log('escribiendo un nuevo pago')
    const newPago = {
        apoderado: selectedUser.value,
        anualidad: anualidad.value,
        nivel: nivel.value,
        ciclo: ciclo.value,
        pago: pago.value
    }
    try {
        newPago.fechaPago = fechaPago.value.toLocaleDateString('es-ES');
        push(pagoRef, newPago);

    } catch (error) {
        newPago.fechaPago = fechaPago.value;
        push(pagoRef, newPago);
    }
    console.log('pago creado: ', anualidad.value)
}

//selector
const apoderadoRef = ref(db, 'apoderados')
const userOptions = refVue([]);
const selectedUser = refVue('');
onMounted(() => {
    // Recuperar los datos de los usuarios
    onValue(apoderadoRef, (snapshot) => {
        const userData = snapshot.val();
        const options = [];

        for (const key in userData) {
            if (Object.hasOwnProperty.call(userData, key)) {
                options.push({
                    id: key,
                    nombre: userData[key].nombre,
                    rut: userData[key].rut,
                    alumnos: userData[key].alumnos,
                });
            }
        }
        userOptions.value = options;
    });
});
</script>
<style scoped>
.cont-apoderado {
    display: flex;
    flex-direction: column;
}

form {
    display: flex;
    flex-direction: column;

}
</style>