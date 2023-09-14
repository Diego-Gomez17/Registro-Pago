<template>
    <div class="cont-apoderado">
        <p>Ingresar un Apoderado</p>
        <label for="">Nombre Apoderado</label>
        <input type="text" id="nombre" v-model="nombre">
        <label for="">Rut</label>
        <input type="text" id="rut" v-model="rut">
        <label for="">Nombre del alumno</label>
        <input type="text" id="alumno" v-model="alumno.nombre">
        <label for="">Rut del alumno</label>
        <input type="text" id="alumnoRut" v-model="alumno.rut">
        <button @click="writeApoderadoData">Nuevo Apoderado</button>
    </div>
</template>
<script setup>
import { ref as refVue} from 'vue'
import { ref, push } from 'firebase/database'
import { db } from '../Firebase/init'

const nombre = refVue('');
const rut = refVue();
const alumno = refVue({
    nombre: '',
    rut: ''});

const apoderadoRef = ref(db, 'apoderados')


function writeApoderadoData() {
    console.log('escribiendo un nuevo apoderado')
    const newApoderado = {
        nombre: nombre.value,
        rut: rut.value,
        alumno: alumno.value
    }
    push(apoderadoRef, newApoderado);
    
  console.log('apoderado creado: ', nombre.value, rut.value)
}


</script>
<style scoped>
    .cont-apoderado{
        display: flex;
        flex-direction: column;
    }
</style>