<template>
    <div class="cont-curso">
        <p>Ingresar un Curso</p>
        <!-- <label for="">Letra del curo</label>
        <input type="text" v-model="letra"> -->
        <label for="">Nivel del curso</label>
        <input type="text" v-model="nivel">
        <label for="">Ciclo</label>
        <input type="text" v-model="ciclo">
        <button @click="writeCursoData">Nuevo Curso</button>
    </div>
</template>
<script setup>
import { ref as refVue} from 'vue'
import { ref, push } from 'firebase/database'
import { db } from '../Firebase/init'

//const letra = refVue('');
const nivel = refVue('');
const ciclo = refVue();

const cursoRef = ref(db, 'cursos')


function writeCursoData() {
    console.log('escribiendo un nuevo curso')
    const newCurso = {
        //letra: letra.value,
        nivel: nivel.value,
        ciclo: ciclo.value
    }
    push(cursoRef, newCurso);
    
  console.log('curso creado: ', nivel.value, ciclo.value)
}


</script>
<style>
.cont-curso{
    display: flex;
    flex-direction: column;
}
</style>