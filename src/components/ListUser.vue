<template>
  <div class="table-apoderados">
    <div class="cont-list" v-if="payList.length > 0">
      <h3>Lista de Pagos</h3>
      <div class="btns">
        <input v-model="searchQuery" type="text" placeholder="Buscar" />
        <select v-model="selectedYear">
          <option value="" selected>Todos los años</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <select
          v-model="ciclo"
          v-if="cursosJSON.cursos != null"
          @change="updateNiveles"
        >
          <option value="" selected>Selecciona un Ciclo</option>
          <option
            v-for="(curso, key) in cursosJSON.cursos"
            :key="key"
            :value="key"
          >
            {{ curso.name }}
          </option>
        </select>
        <select v-if="ciclo != ''" v-model="nivel">
          <option value="" selected>Selecciona un Nivel</option>

          <option v-for="(nivel, key) in niveles" :value="key" :key="key">
            {{ nivel.name }}
          </option>
        </select>
        <select v-if="nivel != ''" v-model="curso">
          <option value="" selected>Selecciona un curso</option>

          <option
            v-for="(lvl, index) in niveles[nivel]?.lvl"
            :value="lvl"
            :key="index"
          >
            {{ lvl }}
          </option>
        </select>
        <button class="btn btn-warning" @click="clearFilter()">Limpiar Filtros</button>
        <button class="btn btn-success" @click="exportToExcel()">
          Descargar Excel
        </button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Rut</th>
            <th scope="col">Nombre apoderado</th>
            <th scope="col">Nombre del alumno</th>
            <th scope="col">Rut del alumno</th>
            <th scope="col">Ciclo</th>
            <th scope="col">Curso</th>
            <th scope="col">Anualidad</th>
            <th scope="col">Pago</th>
            <th scope="col">Fecha de pago</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(payClient, index) in paginatedPayments"
            :key="payClient.id"
          >
            <th scope="row">{{ (currentPage - 1) * perPage + index + 1 }}</th>
            <td>{{ payClient.apoderado.rut }}</td>
            <td>{{ payClient.apoderado.nombre }}</td>
            <td>{{ payClient.alumno.nombre }}</td>
            <td>{{ payClient.alumno.rut }}</td>
            <td>{{ payClient.alumno.ciclo }}</td>
            <td>{{ payClient.alumno.curso }}</td>
            <td>{{ payClient.anualidad }}</td>
            <td>${{ payClient.pago }}</td>
            <td>{{ payClient.fechaPago }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button
          class="btn btn-secondary"
          @click="previousPage"
          :disabled="currentPage === 1"
        >
          Anterior
        </button>
        <span>{{ currentPage }}</span>
        <button
          class="btn btn-dark"
          @click="nextPage"
          :disabled="currentPage * perPage >= totalPayments"
        >
          Siguiente
        </button>
      </div>
    </div>
    <div v-else-if="payList == 0">
      <h3>No hay pagos registrados</h3>
    </div>
  </div>
  <!-- <Loader :isLoading="isLoading" /> -->
</template>
<script setup>
import Loader from "../components/Loader.vue";
import { ref as collection, onValue } from "firebase/database";
import { ref as refVue, computed } from "vue";
import { db, auth } from "../Firebase/init";
import { onMounted } from "vue";
import JSON from '../../src/utils/cursos.json';
import * as XLSX from "xlsx";

const isLoading = refVue(true);

const payList = refVue([]);
const payRef = collection(db, "pagos/");
const searchQuery = refVue(""); // Criterio de búsqueda
const selectedYear = refVue(""); // Año seleccionado en el filtro
const availableYears = refVue([null]); //listas de años

//filtro cursos
const cursosJSON = refVue({});
const niveles = refVue({});
const ciclo = refVue(""); // parbulo, primer ciclo ,segundo ciclo, media
const nivel = refVue(""); // primero, segundo <--- agregar
const curso = refVue(""); // A, B, C

const updateNiveles = () => {
  if (ciclo.value) {
    niveles.value = cursosJSON.value.cursos[ciclo.value].nivel;
    if (nivel.value) {
      niveles.value = cursosJSON.value.cursos[ciclo.value]?.nivel;
    }
  }
};

onMounted(() => {
  cursosJSON.value = JSON

  updateNiveles();

  onValue(payRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const dataArray = Object.values(data);
      const reversedArray = dataArray.reverse(); // Invierte el array

      payList.value = reversedArray;

      const uniqueYears = new Set(); // Conjunto para almacenar anualidades únicas

      for (var payClient of payList.value) {
        uniqueYears.add(payClient.anualidad);
      }
      
      /*--- ordena las fechas de forma descendente---*/
      const numeros = Array.from(uniqueYears);

      // Convertir los números a números
      const numerosNumeros = numeros.map((numero) => Number(numero));

      // Ordenar los números
      numerosNumeros.sort(compare);
      /*---------------------------------------------*/
      availableYears.value = numerosNumeros; // Convierte el conjunto a un array

      isLoading.value = false;
    } else {
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
  const queryCiclo = ciclo.value;
  const queryNivel = nivel.value;
  const queryCurso = curso.value;
  return payList.value.filter((payClient) => {
    
    const apoderadoNombre = payClient.apoderado.nombre.toLowerCase();
    const alumnoNombre = payClient.alumno.nombre.toLowerCase();
    const rut = payClient.apoderado.rut.toLowerCase();
    const rutAlumno = payClient.alumno.rut;

    const anualidad = payClient.anualidad;

    const CCiclo = payClient.alumno.ciclo;
    const CNivel = payClient.alumno.nivel;
    const CCurso = payClient.alumno.curso;

    // Aplica lógica de filtro por búsqueda
    const searchFilter =
      apoderadoNombre.includes(query) ||
      alumnoNombre.includes(query) ||
      rut.includes(query) ||
      rutAlumno.includes(query);
    // Aplica lógica de filtro por año si se selecciona un año
    const yearFilter = anualidad.includes(queryYear);

    // Aplica logica de filtro por cursos
    const cicloFilter = CCiclo.includes(queryCiclo)


    if(queryCiclo != ''){

      const nivelFilter = CNivel.includes(queryNivel);
      if (nivelFilter != '') {
      const cursoFilter = CCurso.includes(queryCurso);
      return searchFilter && yearFilter && cicloFilter && nivelFilter  && cursoFilter
    }
      return searchFilter && yearFilter && cicloFilter && nivelFilter  ;
    }

    return searchFilter && yearFilter && cicloFilter  ;
  });
}

function clearFilter(){
  ciclo.value = ''; // parbulo, primer ciclo ,segundo ciclo, media
  nivel.value = ''; // primero, segundo <--- agregar
  curso.value = ''; // A, B, C
  searchQuery.value = ''; // Criterio de búsqueda
  selectedYear.value = ''; // Año seleccionado en el filtro

}


// Define las variables para el paginador
const currentPage = refVue(1);
const perPage = 10; // Cambia esto al número deseado de elementos por página

// Calcula la lista paginada
const totalPayments = refVue(0);
const paginatedPayments = computed(() => {
  totalPayments.value = filterPayments().length;
  const startIndex = (currentPage.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return filterPayments().slice(startIndex, endIndex);
});

// Funciones para navegar a través de las páginas
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const nextPage = () => {
  if (currentPage.value * perPage < totalPayments.value) {
    currentPage.value += 1;
  }
};



function exportToExcel() {
  // Get the table data.
  const tableData = filterPayments();

  // Create a new workbook.
  const workbook = XLSX.utils.book_new(); // Utiliza XLSX.utils.book_new() en lugar de new XLSX.Workbook()

  // Add a worksheet to the workbook.
  const worksheet = XLSX.utils.aoa_to_sheet([
    // Convierte los datos en un formato que pueda ser agregado a la hoja de cálculo
    [
      "Rut",
      "Nombre apoderado",
      "Nombre del alumno",
      "Rut del alumno",
      "Ciclo",
      "Nivel",
      "Curso",
      "Anualidad",
      "Pago",
      "fecha de pago"
    ],
  ]);
  
  // Iterate over the table data and add it to the worksheet.
  for (let i = 0; i < tableData.length; i++) {
    const payClient = tableData[i];

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          payClient.apoderado.rut,
          payClient.apoderado.nombre,
          payClient.alumno.nombre,
          payClient.alumno.rut,
          payClient.alumno.ciclo,
          payClient.alumno.nivel,
          payClient.alumno.curso,
          payClient.anualidad,
          payClient.pago,
          payClient.fechaPago
        ],
      ],
      { origin: -1 }
    );
  }

  // Add the worksheet to the workbook.
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

  // Save the workbook to a file.
  XLSX.writeFile(workbook, "Registro_Pago.xlsx");
}
</script>
<style scoped>
.table-apoderados {
  margin: 15px;
  border: 2px solid black;
  border-radius: 15px;
  padding: 15px;
}
.btns {
  display: flex;
  flex-direction: wrap;
  gap: 15px;
}
.cont-list {
  display: flex;
  flex-direction: column;
}
.pagination {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
}
.table {
  margin-top: 15px;
}
</style>
