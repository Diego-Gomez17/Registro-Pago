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
            <td>
              <button @click="download(year,payments)">
                <img
                  src="@/assets/img/download.svg"
                  alt=""
                  srcset=""
                  class="btn btn-success"
                />
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref as refVue, onMounted } from "vue";
import { ref, push, onValue, child, remove, set } from "firebase/database";
import { db } from "../Firebase/init";
import { jsPDF } from "jspdf";

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
          if (payments[year]["total"]) {
            payments[year]["total"] = payments[year]["total"] + payment.pago;
          } else {
            payments[year]["total"] = payment.pago;
          }
        }
      }
      for (const age in payments) {
        const correction = payments[age].total % 10;
        if (correction != 0) {
          while (true) {
            payments[age].total = payments[age].total + 1;
            if (payments[age].total % 10 === 0) {
              break;
            }
          }
        }
      }
      paymentsByYear.value = payments;

    });
  }
}
function download(year, data) {
  const doc = new jsPDF({
    orientation: "landscape"
  });
  //Logo
  doc.setFontSize(20);
  let img = new Image();
  img.src = "/assets/logo-8f341bca.png";
  doc.addImage(img, "png", 5, 0, 30, 30);

  // Datos de la empresa
  doc.text("Francis School", 40, 10);
  doc.text(`Fecha: ${data[0].fechaPago}`,180,10)

  doc.text("Centro General de Apoderados", 40, 20);

  // Apoderado
  doc.text(`Apoderado: ${data[0].apoderado.nombre}`,30,50)
  //total pagado
  doc.text(`Total pagado: $${data.total}`, 30,60);


  //tabla
  doc.text(`Alumno/s:`,30,75)
  // Datos de ejemplo para la tabla
  var generateData = function (data) {
    let result = [];

    for( let i=0; i < data.length; i++){
      result.push (Object.assign({},data[i].alumno))
    }
    return result
  };

  function createHeaders(keys) {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {
      result.push({
        id: keys[i],
        name: keys[i],
        prompt: keys[i],
        width: 90,
        align: "center",
        padding: 0,
      });
    }
    return result;
  }

  var headers = createHeaders([
    "nombre",
    "curso",
    "rut"
  ]);

  doc.table(30, 80, generateData(data), headers, { autoSize: false });


  // Guardar el documento
  doc.save(`boleta_${data[0].apoderado.nombre}_${data[0].anualidad}.pdf`);
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
