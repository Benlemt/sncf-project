<template>
  <div class="station-equipments-item" id="charger">
    <div v-if="charger">
      <img src="@/assets/equipments/charger_true.png" alt="Charger available">
    </div>
    <div v-else>
      <img src="@/assets/equipments/charger_false.png" alt="Charger unavailable">
    </div>
    <p>Power & Station</p>
  </div>
</template>

<script>
export default {
  name: "Charger",
  props: {
    charger: Boolean
  }
}
</script>

<style scoped>

</style>