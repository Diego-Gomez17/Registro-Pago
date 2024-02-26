<template>
  <div class="cont-record">
    <h2>Boleta</h2>
    <div class="forms">
      <h3>Buscar Pago</h3>
      <div class="d-flex flex-column gap-3">
        <label for=""><b>Rut del apoderado</b></label>
        <input type="text" v-model="rutInput" required />
        <button type="button" @click="searchPay" class="btn btn-warning">
          Buscar
        </button>
      </div>
      <div v-for="(payments, year) in paymentsByYear" :key="year">
        <h2>{{ year }}</h2>
        <table class="table">
          <tr>
            <th>Nombre Apodeardo</th>
            <th>Pago</th>
            <th>Anualidad</th>
            <th>Descargar</th>
          </tr>
          <tr>
            <td>{{ payments[0].apoderado.nombre }}</td>
            <td>{{ payments.total }}</td>
            <td>{{ payments[0].anualidad }}</td>
            <td><img src="@/assets/img/download.svg" alt="" srcset="" class="btn btn-success"></td>
          </tr>

        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref as refVue, onMounted } from "vue";
import { ref, push, onValue, child, remove } from "firebase/database";
import { db } from "../Firebase/init";

const payRef = ref(db, "pagos");

const rutInput = refVue();
const paymentsByYear = refVue({});

const userOptions = refVue([]);
function searchPay() {
  const searchRut = rutInput.value;
  if (searchRut !== "") {
    onValue(payRef, (snapshot) => {
      const data = snapshot.val();
      const payments = {};

      for (const key in data) {
        const payment = data[key];
        if (payment.apoderado.rut === searchRut) {
          const year = payment.anualidad;
          if (!payments[year]) {
            payments[year] = [];
          }
          payments[year].push({
            id: key,
            ...payment,
          });
          if (payments[year]["total"]){
            payments[year]["total"] = payments[year]["total"] + payment.pago ;
          }
          else{
            payments[year]["total"] = payment.pago
          }

        }
      }
      for(const age in payments){
        const correction = payments[age].total % 10
        if(correction != 0 ){
          while(true){
            payments[age].total = payments[age].total + 1
            if (payments[age].total % 10 === 0){
              break;
            }
          }
        }
      }
      paymentsByYear.value = payments;
    });
  }
}
</script>
<style scoped>
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
h3 {
  text-align: center;
}
@media (max-width: 1300px) {
  .forms {
    font-size: 12px;
    min-width: 1000px;
  }
}
</style>
