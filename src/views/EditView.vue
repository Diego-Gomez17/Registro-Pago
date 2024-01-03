<template>
  <div class="cont-record">
    <h2>Editar Registro</h2>
    <div class="forms">
      <h3>Buscar Pago</h3>
      <div class="d-flex flex-column gap-3">
        <label for=""><b>Rut del apoderado</b></label>
        <input type="text" v-model="rutInput" required />
        <button type="button" @click="searchPay" class="btn btn-warning">
          Buscar
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
            <th scope="col">Modo de pago</th>
            <th scope="col">Administrador</th>
            <th scope="col">Accion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payClient, index) in userOptions" :key="payClient.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ payClient.apoderado.rut }}</td>
            <td>{{ payClient.apoderado.nombre }}</td>
            <td>{{ payClient.alumno.nombre }}</td>
            <td>{{ payClient.alumno.rut }}</td>
            <td>{{ payClient.alumno.ciclo }}</td>
            <td>{{ payClient.alumno.curso }}</td>
            <td>{{ payClient.anualidad }}</td>
            <td>${{ payClient.pago }}</td>
            <td>{{ payClient.fechaPago }}</td>
            <td>{{ payClient.modoPago }}</td>
            <td>{{ payClient.admin }}</td>
            <td>
              <button @click="deletePay(payClient)" class="btn btn-danger">
                x
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
import { ref, push, onValue, child, remove } from "firebase/database";
import { db } from "../Firebase/init";

const payRef = ref(db, "pagos");

const rutInput = refVue();
const userOptions = refVue([]);
function searchPay() {
  const listPay = [];
  // Realiza la búsqueda del apoderado por el rut
  const searchRut = rutInput.value;
  if (searchRut != null) {
    onValue(payRef, (snapshot) => {
      const data = snapshot.val();
      for (const key in data) {
        if (data[key].apoderado.rut === searchRut) {
          listPay.push({
            id: key,
            ...data[key],
          });
        }
      }
    });
  }
  userOptions.value = listPay;
  console.log(userOptions.value);
}

function deletePay(pay) {
  Swal.fire({
    title: "Estas seguro de eliminar este registro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Confirmar",
  }).then((result) => {
    if (result.isConfirmed) {
      remove(ref(db, `pagos/${pay.id}/`));
      console.log("se ha eliminado el documento");
      searchPay();
      Swal.fire({
        title: "Eliminado",
        text: "El registro se ha eliminado con exito",
        icon: "success",
      });
    }
  });
}
</script>
<style>
.cont-record {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
}
.forms {
  margin: 15px;
  border: 2px solid black;
  border-radius: 15px;
  background-color: white;
  padding: 15px;
  width: 85vw;
}
h3{
    text-align: center;
  }
@media (max-width: 1300px) {
  .forms{
    font-size: 12px;
    min-width: 1000px;

  }
  
}
</style>
