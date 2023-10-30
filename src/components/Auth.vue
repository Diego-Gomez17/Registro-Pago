<template lang="">
    <div>
        <div v-if="!store.user">
            <button @click="singIn" class="btn btn-primary p-1">Sing In</button>
          </div>
          <div class="username" v-else>
            <p>{{ store.user.name }}</p>
            <button class="btn btn-primary " @click="userOut">Sign Out</button>
          </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import {
  signInWithPopup, GoogleAuthProvider,
  onAuthStateChanged, signOut
} from 'firebase/auth'
import { auth } from '../Firebase/init'
import { userStore } from '../stores/user';

const store = userStore();
const errMsg = ref()

if (errMsg.value) {
  alert(errMsg.value)
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // El usuario está autenticado, puedes realizar acciones relacionadas con la autenticación aquí
      console.log("Usuario autenticado:", user.displayName);
      const currentUser = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      }
      store.detectUser(currentUser);
      //console.log(store.user.name, "userStore")

    } else {
      console.log("Ningún usuario autenticado.");
      //console.log(store.user.name, "userStore")
    }
  });
});

const singIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // Signed in 
      console.log(result.user.displayName)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

const userOut = () => {
  signOut(auth).then(() => {
    store.detectUser(null);
  }).catch((error) => {
  });
}
</script>
<style scoped>
    .username{
      display: flex;
      flex-direction: row;
      gap:15px;
      justify-content: center;
      align-items: center;

    }
    p{
      color:rgb(209, 213, 216);
    }
    button{
      margin-top: -10px;
    }
</style>