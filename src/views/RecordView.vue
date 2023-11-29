<template>
  <div class="cont-record">
    <h1>Ingrese un nuevo registro</h1>
    <div class="forms">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#addPay" type="button" role="tab"
            aria-controls="addPay" aria-selected="true">Generar Pago</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link " id="home-tab" data-bs-toggle="tab" data-bs-target="#addApoderado" type="button"
            role="tab" aria-controls="addApoderado" aria-selected="false">Añadir apoderado</button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        
        <div class="tab-pane fade show active" id="addPay" role="tabpanel" aria-labelledby="addPay-tab">
          <SetPagos />
        </div>
        <div class="tab-pane fade " id="addApoderado" role="tabpanel" aria-labelledby="addApoderado-tab">
          <SetApoderado />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import SetApoderado from '../components/SetApoderado.vue';
import SetPagos from '../components/setPagos.vue';
</script>

<style scoped>
.cont-record {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
}



h1 {
  text-align: center;
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
