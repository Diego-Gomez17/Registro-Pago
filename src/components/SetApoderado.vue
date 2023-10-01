<template>
    <div class="cont-apoderado">
        <p>Ingresar un Apoderado</p>
        <label for="">Nombre Apoderado</label>
        <input type="text" id="nombre" v-model="nombre">
        <label for="">Rut</label>
        <input type="text" id="rut" v-model="rut">

        <br>
        <button @click="writeApoderadoData">Nuevo Apoderado</button>
        <button @click="showPopup">Agregar alumno adicional</button>

        <div v-if="isPopupOpen">
            <div class="popup">
                <h2>Formulario de alumno</h2>
                <form @submit.prevent="addAlumno">

                    <div class="form-group">
                        <label for="nombre">Nombre del Alumno</label>
                        <input type="text" class="form-control" v-model="alumno.nombre">
                    </div>

                    <div class="form-group">
                        <label for="rut">Rut del Alumno</label>
                        <input type="text" class="form-control" v-model="alumno.rut">
                    </div>

                    <input type="submit" value="Ageregar alumno">
                    <button @click="ClosePopUP">Cerrar</button>
                </form>
            </div>
        </div>
        <ol>
            <li v-for="(alumno, index) in alumnos" :key="index">{{ alumno.nombre }} {{ alumno.rut }} <button
                    @click="deleteAlumno(alumno)">Eliminar</button></li>
        </ol>
    </div>
    <Loader :isLoading="isLoading" />
</template>
<script setup>
import Loader from '../components/Loader.vue';

import { ref as refVue, onMounted } from 'vue'
import { ref, push } from 'firebase/database'
import { db } from '../Firebase/init'
//loader
const isLoading = refVue(true);
onMounted(() => {
    isLoading.value = false;
})

//database reference
const apoderadoRef = ref(db, 'apoderados')


//form data
const nombre = refVue('');
const rut = refVue();
const alumnos = refVue([]);
const alumno = refVue({
    nombre: '',
    rut: ''
})

//post
function writeApoderadoData() {
    console.log('escribiendo un nuevo apoderado')
    //alumnos.value.push(alumno.value)
    const newApoderado = {
        nombre: nombre.value,
        rut: rut.value,
        alumnos: alumnos.value
    }
    push(apoderadoRef, newApoderado);

    console.log('apoderado creado: ', nombre.value, rut.value)
}

//popup
const isPopupOpen = refVue(false);

function showPopup() {
    isPopupOpen.value = true;
}
function ClosePopUP() {
    isPopupOpen.value = false;
}
function addAlumno() {
    console.log('agregando alumno')
    const newAlumno = Object.assign({}, alumno.value)
    alumnos.value.push(newAlumno)
    console.log('alumno agregado ')
}
function deleteAlumno(alumno) {
    this.alumnos.splice(this.alumnos.indexOf(alumno), 1);
    console.log('eliminando alumno')
}

</script>
<style scoped>
.cont-apoderado {
    display: flex;
    flex-direction: column;
}


.popup {
    width: 500px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    color: black;
    border-radius: 5px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
}
</style>