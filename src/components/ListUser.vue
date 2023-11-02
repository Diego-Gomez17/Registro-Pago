<template>
    <div class="table-apoderados">
        <div v-if="payList.length > 0">
            <h3>Lista de Pagos</h3>
            <input v-model="searchQuery" type="text" placeholder="Buscar" />
            <select v-model="selectedYear">
                <option value="" selected>Todos los años</option>
                <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Rut</th>
                        <th scope="col">Nombre apoderado</th>
                        <th scope="col">Nombre del alumno</th>
                        <th scope="col">Rut del alumno</th>
                        <th scope="col">Curso</th>
                        <th scope="col">Nivel</th>
                        <th scope="col">Anualidad</th>
                        <th scope="col">Pago</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(payClient, index) in filterPayments()" :key="payClient.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ payClient.apoderado.rut }}</td>
                        <td>{{ payClient.apoderado.nombre }}</td>
                        <td> {{ payClient.alumno.nombre }}</td>
                        <td> {{ payClient.alumno.rut }}</td>
                        <td> {{ payClient.ciclo }} </td>
                        <td> {{ payClient.nivel }} </td>
                        <td> {{ payClient.anualidad }} </td>
                        <td> ${{ payClient.pago }} </td>
                    </tr>
                </tbody>
            </table>
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
const searchQuery = refVue(''); // Criterio de búsqueda
const selectedYear = refVue(''); // Año seleccionado en el filtro
const availableYears = refVue([null])//listas de años

onMounted(() => {

    
    onValue(payRef, (snapshot) => {
        const data = snapshot.val();
        if(data){
        const dataArray = Object.values(data);
        const reversedArray = dataArray.reverse(); // Invierte el array

        payList.value = reversedArray;

        const uniqueYears = new Set(); // Conjunto para almacenar anualidades únicas

        for (var payClient of payList.value) {
            uniqueYears.add(payClient.anualidad);
            console.log(payClient.alumno.nombre)
        }

        /*--- ordena las fechas de forma descendente---*/
        const numeros = Array.from(uniqueYears)

        // Convertir los números a números
        const numerosNumeros = numeros.map(numero => Number(numero));

        // Ordenar los números
        numerosNumeros.sort(compare);
        /*---------------------------------------------*/
        availableYears.value = numerosNumeros // Convierte el conjunto a un array

        isLoading.value = false;
    }
    else{
        isLoading.value = false;
    }
    });
});

function compare(a, b) {
    const n1 = Number(a);
    const n2 = Number(b);

    return n2 - n1;
}

function filterPayments() {
    const query = searchQuery.value.toLowerCase();
    const queryYear = selectedYear.value;
    return payList.value.filter((payClient) => {
        const apoderadoNombre = payClient.apoderado.nombre.toLowerCase();
        const alumnoNombre = payClient.alumno.nombre.toLowerCase();
        const rut = payClient.apoderado.rut.toLowerCase();
        const rutAlumno = payClient.alumno.rut

        const anualidad = payClient.anualidad

        // Aplica lógica de filtro por búsqueda
        const searchFilter = apoderadoNombre.includes(query) ||
            alumnoNombre.includes(query) ||
            rut.includes(query) || 
            rutAlumno.includes(query);

        // Aplica lógica de filtro por año si se selecciona un año
        const yearFilter = anualidad.includes(queryYear)
        return searchFilter && yearFilter;
    });
}

</script>
<style scoped>
.table-apoderados {
    margin: 15px;
    border: 2px solid black;
    border-radius: 15px;
    padding: 15px;
}
</style>