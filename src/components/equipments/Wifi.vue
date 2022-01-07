<template>
  <div class="station-equipments-item" id="wifi">
    <div v-if="wifi">
      <img src="@/assets/equipments/wifi_true.png" alt="WIFI available">
    </div>
    <div v-else>
      <img src="@/assets/equipments/wifi_false.png" alt="WIFI unavailable">
    </div>
    <p>WIFI</p>
  </div>
</template>

<script>
export default {
  name: "Wifi",
  props: {
    wifi: Boolean
  }
}
</script>
