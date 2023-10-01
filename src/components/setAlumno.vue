<template>
    <div>
        <div class="popup-content" v-if="show">
            <!-- Contenido del pop-up -->
            <h3>Agregar alumno</h3>
            <label for="">Nombre del alumno</label>
            <input type="text"  v-model="alumno.nombre">
            <label for="">Rut del alumno</label>
            <input type="text" v-model="alumno.rut">
            <slot></slot>
            <button @click="closePopup">Cerrar</button>
        </div>
    </div>
</template>
<script setup>
import { ref as refVue, defineProps, defineEmits } from 'vue';

const { alumno } = defineProps(['alumno']);
const emit = defineEmits(['agregarAlumno']);
const show = refVue(false);

const closePopup = () => {
  show.value = false;
};
function agregarAlumno() {
    // Aquí puedes realizar alguna validación de datos si es necesario
    // Luego, emite el evento al componente padre con los datos del alumno
    emit('agregarAlumno', alumno);
}
</script>
<style scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }</style>