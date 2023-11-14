<template>
  <div class="cont-apoderado">
    <h3>Ingresar un Pago</h3>
    <form @submit.prevent="writeApoderadoData">
      <!-- <label for="">Rut Apoderado</label>
            <select v-model="selectedUser" required>
                <option value="">Selecciona un apoderado</option>
                <option v-for="user in userOptions" :key="user.id" :value="user">{{ user.rut }}</option>
            </select> -->

      <label for="rutInput">Rut Apoderado</label>
      <input type="text" v-model="rutInput" id="rutInput" required />
      <button
        class="btn btn-warning"
        @click="searchApoderado"
        style="margin-top: 15px"
      >
        Buscar
      </button>

      <label for="" style="margin-top: 15px">Nombre apoderado</label>
      <input readonly type="text" :value="selectedUser.nombre" />
      <label for="">Anualidad</label>
      <input type="text" v-model="anualidad" required />
      <label for="ciclo">Ciclo</label>
      <select
        v-if="cursosJSON.cursos != null"
        v-model="ciclo"
        @change="updateNiveles"
      >
        <option
          v-for="(curso, key) in cursosJSON.cursos"
          :value="key"
          :key="key"
        >
          {{ curso.name }}
        </option>
      </select>

      <label for="nivel">Nivel del curso</label>
      <select v-if="ciclo != null" v-model="nivel">
        <option v-for="(nivel, key) in niveles" :value="key" :key="key">
          {{ nivel.name }}
        </option>
      </select>
      <input v-else type="text" disabled readonly />

      <label for="curso">Curso</label>
      <select v-if="nivel != null" v-model="curso">
        <option
          v-for="(lvl, index) in niveles[nivel]?.lvl"
          :value="lvl"
          :key="index"
        >
          {{ lvl }}
        </option>
      </select>
      <input v-else type="text" disabled readonly />
      <label for="">Fecha de Pago</label>
            <VueDatePicker v-model="fechaPago" :enable-time-picker="false" :format="format" :placeholder="fechaPago" />
      <label for="">Pago</label>
      <input type="number" v-model="pago" required />

      <input
        type="submit"
        value="Nuevo Pago"
        class="btn btn-success"
        style="margin-top: 15px"
      />
    </form>
    <div class="list-alumnos">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Rut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(alumno, index) in selectedUser.alumnos" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ alumno.nombre }}</td>
            <td>{{ alumno.rut }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref as refVue, onMounted } from "vue";
import { ref, push, onValue } from "firebase/database";
import { db } from "../Firebase/init";
import { swal } from "sweetalert2/dist/sweetalert2";
const currentDate = new Date().toLocaleDateString("es-ES");
/* --------------------------------------------------------- */
/* el pago se debe dividir entre los alumnos del apoderado   */
/* --------------------------------------------------------- */

const anualidad = refVue(String(new Date().getFullYear()));
const cursosJSON = refVue({});
const niveles = refVue({});
const ciclo = refVue(null); // parbulo, primer ciclo ,segundo ciclo, media
const nivel = refVue(null); // a , b, c
const curso = refVue(null); // primero, segundo <--- agregar
const fechaPago = refVue(currentDate);
const pago = refVue(); //aporte voluntario

const pagoRef = ref(db, "pagos");
//formart datePicker
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

//post
function writeApoderadoData() {
  console.log("escribiendo un nuevo pago");
  console.log(selectedUser.value.alumnos.length);
  var cantAlumnos = selectedUser.value.alumnos.length;
  var pagos = Math.trunc(pago.value / cantAlumnos);

  try {
    //newPago.fechaPago = fechaPago.value.toLocaleDateString('es-ES');
    Swal.fire({
      title: "Estas seguro de ingresar este pago?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: `Mejor no`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        for (let student in selectedUser.value.alumnos) {
          console.log(student);
          console.log(selectedUser.value.alumnos[student].nombre);
          console.log(pagos);
          const newPago = {
            apoderado: selectedUser.value,
            alumno: selectedUser.value.alumnos[student],
            anualidad: anualidad.value,
            ciclo: ciclo.value,
            nivel: nivel.value,
            curso: curso.value,
            pago: pagos,
          };

          push(pagoRef, newPago);
          console.log("pago creado: ", anualidad.value);
        }
        Swal.fire("Saved!", "", "success");
        resetData();
      } else if (result.isDenied) {
        Swal.fire("No se ha guardado los datos", "", "info");
      }
    });
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "no se ha podido registrar el pago",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
    resetData();
  }
}

//selector apoderado
const apoderadoRef = ref(db, "apoderados");
const userOptions = refVue([]);
const selectedUser = refVue("");

const updateNiveles = () => {
  if (ciclo.value) {
    niveles.value = cursosJSON.value.cursos[ciclo.value].nivel;
    nivel.value = Object.keys(niveles.value)[0]; // Establecer el primer nivel como predeterminado
    if (nivel.value) {
      niveles.value = cursosJSON.value.cursos[ciclo.value]?.nivel;
    }
  }
};

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
  // Recupera los cursos
  fetch("../../src/utils/cursos.json")
    .then((response) => response.json())
    .then((data) => (cursosJSON.value = data))
    .catch((error) => console.error("Error al cargar el archivo JSON:", error));

  updateNiveles();
});

function searchApoderado() {
  const rutToSearch = rutInput.value;
  if (!rutToSearch) {
    return;
  }

  // Realiza la búsqueda del apoderado por el rut
  const foundUser = userOptions.value.find((user) => user.rut === rutToSearch);

  if (foundUser) {
    selectedUser.value = foundUser;
  } else {
    // Si no se encuentra, puedes mostrar un mensaje de error o realizar alguna acción
    // como limpiar los campos de búsqueda.
    Swal.fire({
      title: "Apoderado no encontrado",
      text: "El Rut ingresado no corresponde a un apoderado existente.",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
    // También puedes limpiar el campo de búsqueda después de mostrar el mensaje de error.
    rutInput.value = "";
  }
}

function resetData() {
  anualidad.value = String(new Date().getFullYear());
  nivel.value = ""; // a , b, c
  ciclo.value = ""; // parbulo, primer ciclo ,segundo ciclo, media
  fechaPago.value = currentDate;
  pago.value = null;
}
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

.list-alumnos {
  margin: 15px;
  border: 2px solid black;
  border-radius: 15px;
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
