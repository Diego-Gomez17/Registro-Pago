<template>
  <div class="cont-record">
    <h2>Editar Registro</h2>
    <div class="forms">
      <h3>Buscar Pago</h3>
      <form action="" class="d-flex flex-column gap-3">
        <label for="">Rut del apoderado</label>
        <input type="text" v-model="rutInput" required />
        <button type="button" @click="searchPay" class="btn btn-warning">
          Buscar
        </button>
      </form>
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
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(payClient, index) in paginatedPayments"
            :key="payClient.id"
          >
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

const apoderadoRef = ref(db, "pagos");
const userOptions = refVue([]);
const rutInput = refVue();
const listPay= []
function searchPay() {
  // Realiza la búsqueda del apoderado por el rut
  const searchRut = rutInput.value 
  if(searchRut != null)
  {

      onValue(apoderadoRef, (snapshot)=>{
          
          const data = snapshot.val()
          for (const key in data ){
              if( data[key].apoderado.rut === searchRut){
                  listPay.push(data[key])
                  console.log(listPay)
                  
                }
            }
        })
    }
    userOptions = listPay
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
  width: 65vw;
}
</style>
