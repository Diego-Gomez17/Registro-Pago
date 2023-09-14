import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userStore = defineStore("userStore", {
  state: () => ({
    user: ref(null),
  }),
  actions: {
    async detectUser(user) {
      this.user = user;
    },
  },
  getters: {
    userState() {
      return computed(() => user)  //this.user !== null;
    },
  },
});
