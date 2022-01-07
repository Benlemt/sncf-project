<template>
  <div class="random-btn-container">
    <button class="random-btn" @click="setRandomStation()">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      <p>Choisir une gare au hasard</p>
    </button>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "RandomStationBtn",
  computed: {
    ...mapGetters('stations', {
      'numberStation': 'numberStation'
    }),
  },
  methods: {
    // Select random station in the list (provided by the store)
    setRandomStation() {
      const random = Math.floor(Math.random() * (this.numberStation));
      this.$store.dispatch('stations/selectRandomStation', random);
    }
  }
}
</script>

<style scoped>
.random-btn-container {
  @apply absolute right-4 top-4 z-10;
}

@media (max-width: 768px) {
  .random-btn-container {
    @apply hidden;
  }
}

.random-btn {
  @apply flex bg-white px-4 py-2 rounded-full shadow-lg border border-gray-300;
}

.random-btn:hover {
  @apply bg-gray-50;
}

.random-btn:active {
  @apply bg-gray-100;
}

.random-btn svg {
  @apply h-5 w-5 text-gray-800 mr-2;
}

.random-btn p {
  @apply h-5 text-sm text-gray-800 font-bold;
}
</style>