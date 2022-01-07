<template>
  <div class="station-equipments-item" id="piano">
    <div v-if="piano">
      <img src="@/assets/equipments/piano_true.png" alt="Piano available">
    </div>
    <div v-else>
      <img src="@/assets/equipments/piano_false.png" alt="Piano unavailable">
    </div>
    <p>Piano</p>
  </div>
</template>
<script>
export default {
  name: "Piano",
  props: {
    piano: Boolean
  }
}
</script>

<style scoped>

</style>