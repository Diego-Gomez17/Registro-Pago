<template>
  <div class="cont-apoderado">
    <h3>Ingresar un Apoderado</h3>
    <label for="">Rut</label>
    <input type="text" id="rut" name="rut" v-model="rut" required />
    <button
      class="btn btn-warning mt-3 mb-3 p-1"
      style="width: 20%"
      @click="buscarApoderadoPorRut()"
    >
      Buscar Apoderado
    </button>
    <label for="">Nombre Apoderado</label>
    <input type="text" id="nombre" v-model="nombre" required />

    <div class="btns">
      <button class="btn btn-success" @click="showPopup">Agregar alumno</button>
      <button class="btn btn-primary" @click="writeApoderadoData">
        Ingresar Apoderado
      </button>
    </div>
    <div v-if="isPopupOpen">
      <div class="popup">
        <div class="cont-popup">
          <h2>Formulario de alumno</h2>
          <form @submit.prevent="addAlumno">
            <div class="form-group">
              <label for="nombre">Nombre del Alumno</label>
              <input
                type="text"
                class="form-control"
                v-model="alumno.nombre"
                required
              />
            </div>

            <div class="form-group">
              <label for="rut">Rut del Alumno</label>
              <input
                type="text"
                class="form-control"
                v-model="alumno.rut"
                required
              />
            </div>
            <br />
            <div class="btns">
              <input
                class="btn btn-success"
                type="submit"
                value="Agregar alumno"
              />
              <button class="btn btn-danger" @click="ClosePopUP">Cerrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <hr style="z-index: -1" />
    <h3 style="text-align: center">Alumnos</h3>
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
          <tr v-for="(alumno, index) in alumnos" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ alumno.nombre }}</td>
            <td>{{ alumno.rut }}</td>
            <td>
              <button class="btn btn-danger" @click="deleteAlumno(alumno)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Loader :isLoading="isLoading" />
</template>
<script setup>
import Loader from "../components/Loader.vue";
import { ref as refVue, onMounted } from "vue";
import { ref, push, get, query, update, set } from "firebase/database";
import { db } from "../Firebase/init";

//loader
const isLoading = refVue(true);
onMounted(() => {
  isLoading.value = false;
});

//database reference
const apoderadoRef = ref(db, "apoderados");

//form data
const nombre = refVue("");
const rut = refVue();
const alumnos = refVue([]);

const alumno = refVue({
  nombre: "",
  rut: "",
});

//post
async function writeApoderadoData() {
  if (nombre.value == "" || rut.value == null) {
    Swal.fire({
      title: "Error!",
      text: "No has ingreasado los datos del apoderado",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
  } else {
    if (alumnos.value.length == 0) {
      Swal.fire({
        title: "Error!",
        text: "No has registrado ningun alumno a este apoderado",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    } else {
      if (Fn.validaRut(rut.value)) {
        // verificar el rut
        Swal.fire({
          title: "Estás seguro de ingresar este usuario?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Mejor no`,
        }).then(async (result) => { 
          if (result.isConfirmed) {
            const newApoderado = {
              nombre: nombre.value,
              rut: rut.value,
              alumnos: alumnos.value,
            };

            // Reference to the specific document
            const apoderadoDocRef = ref(db, `apoderados/${rut.value}`);

            // Check if the document with the specified ID exists
            const apoderadoSnapshot = await get(apoderadoDocRef);
            const apoderadoExists = apoderadoSnapshot.exists();

            // Update or set data based on document existence
            if (apoderadoExists) {
              // Update the existing document
              update(apoderadoDocRef, {
                nombre: nombre.value,
                alumnos: alumnos.value,
              });
              Swal.fire("Actualizado!", "", "success");
            } else {
              // Create a new document with the specified ID
              set(apoderadoDocRef, newApoderado);
              Swal.fire("Guardado!", "", "success");
            }

            resetData();
          } else if (result.isDenied) {
            Swal.fire("No se ha guardado los datos", "", "info");
          }
        });
      }
    }
  }
}

async function buscarApoderadoPorRut() {
  alumnos.value = [];
  const ap = "";
  const querySnapshot = await get(apoderadoRef);
  const apoderados = querySnapshot.val();
  if (apoderados) {
    for (const key in apoderados) {
      if (apoderados[key].rut === rut.value) {
        nombre.value = apoderados[key].nombre;
        for (const index in apoderados[key].alumnos) {
          const newAlumno = Object.assign({}, apoderados[key].alumnos[index]);
          alumnos.value.push(newAlumno);
          alumno.value = {
            nombre: "",
            rut: "",
          };
        }
        //console.log(newAlumno)
        ap = apoderados[key].rut;
        console.log(ap);
      }
    }
    if (ap != null) {
      Swal.fire({
        title: "Rut no encontrado",
        text: "El rut ingreasado aun no esta registrado",
        icon: "info",
        confirmButtonText: "Cerrar",
      });
    }
  }
}

function resetData() {
  nombre.value = "";
  rut.value = "";
  alumnos.value = [];
  alumno.value = {
    nombre: "",
    rut: "",
  };
}
// Valida el rut con su cadena completa "XXXXXXXX-X"
var Fn = {
  validaRut: function (rutCompleto) {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
    var tmp = rutCompleto.split("-");
    var digv = tmp[1];
    var rut = tmp[0];
    if (digv == "K") digv = "k";
    return Fn.dv(rut) == digv;
  },
  dv: function (T) {
    var M = 0,
      S = 1;
    for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? S - 1 : "k";
  },
};
//popup
const isPopupOpen = refVue(false);

function showPopup() {
  isPopupOpen.value = true;
}
function ClosePopUP() {
  isPopupOpen.value = false;
}
function addAlumno() {
  if (Fn.validaRut(alumno.value.rut)) {
    console.log("agregando alumno");
    const newAlumno = Object.assign({}, alumno.value);
    alumnos.value.push(newAlumno);
    console.log("alumno agregado ");
    alumno.value = {
      nombre: "",
      rut: "",
    };
    ClosePopUP();
  } else {
    Swal.fire({
      title: "Error!",
      text: "El rut ingreasado no es correcto",
      icon: "error",
      confirmButtonText: "Cerrar",
    });
    alumno.value.rut = "";
  }
}
function deleteAlumno(alumno) {
  this.alumnos.splice(this.alumnos.indexOf(alumno), 1);
  console.log("eliminando alumno");
}
</script>
<style scoped>
.cont-apoderado {
  display: flex;
  flex-direction: column;
}

.btns {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 15px;
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
  border-radius: 15px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
}

.cont-popup {
  margin: 15px;
  padding: 15px;
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
