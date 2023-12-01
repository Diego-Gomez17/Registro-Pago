<template>
  <div class="cont-apoderado">
    <h3>Ingresar un Pago</h3>
    <form @submit.prevent="writeApoderadoData()">
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
      <!-- <label for="">Fecha de Pago</label>
            <VueDatePicker v-model="fechaPago" :enable-time-picker="false" :format="format" :placeholder="fechaPago" /> -->
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
            <th>Status</th>
            <th>Nombre</th>
            <th>Rut</th>
            <th>Ciclo</th>
            <th>Nivel del curso</th>
            <th>Curso</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(alumno, index) in selectedUser.alumnos" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td v-if="!als[index].status">❌</td>
            <td v-else>✅</td>
            <td>{{ alumno.nombre }}</td>
            <td>{{ alumno.rut }}</td>
            <td>
              <select
                v-if="cursosJSON.cursos != null"
                v-model="alumno.ciclo"
                @change="updateNiveles(index, alumno)"
              >
                <option
                  v-for="(curso, key) in cursosJSON.cursos"
                  :value="key"
                  :key="key"
                >
                  {{ curso.name }}
                </option>
              </select>
            </td>
            <td>
              <select v-if="alumno.ciclo != null" v-model="alumno.nivel">
                <option
                  v-for="(nivel, key) in als[index].niveles"
                  :value="key"
                  :key="key"
                >
                  {{ nivel.name }}
                </option>
              </select>
            </td>
            <td>
              <select v-if="alumno.nivel != null" v-model="alumno.curso">
                <option
                  v-for="(lvl, index) in als[index]?.niveles[alumno.nivel]?.lvl"
                  :value="lvl"
                  :key="index"
                >
                  {{ lvl }}
                </option>
              </select>
            </td>
            <td>
              <button class="btn btn-success" @click="saveCicle(alumno, index)">
                Guardar
              </button>
            </td>
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
import JSON from "../../src/utils/cursos.json";
const currentDate = new Date().toLocaleDateString("es-ES");
/* --------------------------------------------------------- */
/* el pago se debe dividir entre los alumnos del apoderado   */
/* --------------------------------------------------------- */

const status = refVue(false);
const anualidad = refVue(String(new Date().getFullYear()));
const cursosJSON = refVue({});
const niveles = refVue({});
const al = refVue({
  niveles: null,
  nivel: null,
  nombre: "",
  rut: "",
  ciclo: "",
  lvl: null,
  curso: null,
});
const als = refVue([al]);
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

function saveCicle(alumno, index) {
  al.value = Object.assign({}, selectedUser.value.alumnos[index]);
  als.value[index] = al.value;
  als.value[index].status = true;
  console.log(als.value);
  if (cursosJSON.value.cursos && cursosJSON.value.cursos[alumno.ciclo]) {
    als.value[index].niveles = cursosJSON.value.cursos[alumno.ciclo].nivel;
    Swal.fire({
      title: "Se ha guardado correctamente los datos del alumno",
      icon: "success",
      confirmButtonText: "Cerrar",
      timer: 1500,
    });
  } else {
    console.error("cursosJSON.value.cursos[alumno.ciclo] es undefined");
  }
}

//post
function writeApoderadoData() {
  console.log("escribiendo un nuevo pago");
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
          const newPago = {
            apoderado: selectedUser.value,
            alumno: {
              nombre: selectedUser.value.alumnos[student].nombre,
              rut: selectedUser.value.alumnos[student].rut,
              ciclo: als.value[student].ciclo,
              nivel: als.value[student].nivel,
              curso: als.value[student].curso,
            },
            pago: pagos,
            anualidad: anualidad.value,
          };
          if (newPago.alumno.curso) {
            push(pagoRef, newPago);
            resetData();
            console.log("pago creado: ", anualidad.value);
            Swal.fire("Saved!", "", "success");
          } else {
            Swal.fire("Debe ingresar los datos del alumno", "", "info");
          }
        }
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
  }
}

//selector apoderado
const apoderadoRef = ref(db, "apoderados");
const userOptions = refVue([]);
const selectedUser = refVue("");

const updateNiveles = (key, alumno) => {
  if (alumno) {
    if (alumno.ciclo) {
      als.value[key].niveles = cursosJSON.value.cursos[alumno.ciclo].nivel;
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
  cursosJSON.value = JSON;
});

function searchApoderado() {
  resetData();
  const rutToSearch = rutInput.value;
  if (!rutToSearch) {
    return;
  }

  // Realiza la búsqueda del apoderado por el rut
  const foundUser = userOptions.value.find((user) => user.rut === rutToSearch);

  if (foundUser) {
    selectedUser.value = foundUser;
    //crea una lista con los alumnos del apoderado
    for (const kid in selectedUser.value.alumnos) {
      al.value = Object.assign({}, selectedUser.value.alumnos[kid]);
      al.value.status = status.value;
      als.value.push(al.value);
    }
    console.log(als.value);
  } else {
    Swal.fire({
      title: "Apoderado no encontrado",
      text: "El Rut ingresado no corresponde a un apoderado existente.",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
    rutInput.value = "";
  }
}

function resetData() {
  selectedUser.value = null;
  anualidad.value = String(new Date().getFullYear());
  fechaPago.value = currentDate;
  pago.value = null;
  al.value = null;
  als.value = [];
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
